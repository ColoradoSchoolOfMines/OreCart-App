"""
Routes for displaying the primary information to be shown on the mobile
frontend.
"""

from datetime import datetime
from typing import Optional

import pytz
from fastapi import APIRouter, Request
from pydantic import BaseModel

from src.model.route_stop import RouteStopModel
from src.model.alert import AlertModel
from src.model.route import RouteModel
from src.model.route_disable import RouteDisableModel
from src.model.stop import StopModel
from src.model.stop_disable import StopDisableModel
from src.model.waypoint import WaypointModel


class CoordinateJSON(BaseModel):
    """
    JSON representation of coodinate information, contains only
    what is necessary for the frontend.
    """

    latitude: float
    longitude: float


class AlertJSON(BaseModel):
    """
    JSON representation of alert information, contains only
    what is necessary for the frontend.
    """

    body: str
    endTime: datetime


class RouteJSON(BaseModel):
    """
    JSON representation of route information, contains only
    what is necessary for the frontend.
    """

    id: int
    name: str
    isActive: bool
    waypoints: list[CoordinateJSON]


class StopJSON(BaseModel):
    """
    JSON representation of stop information, contains only
    what is necessary for the frontend.
    """

    id: int
    name: str
    location: CoordinateJSON
    isActive: bool
    routeIds: list[int]


class DashboardJSON(BaseModel):
    """
    Collated JSON representation of all information needed for the
    for the frontend.
    """

    routes: list[RouteJSON]
    stops: list[StopJSON]
    alert: Optional[AlertJSON]


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/")
async def get_dashboard(req: Request) -> DashboardJSON:
    """
    Obtains all fundamental information to be shown in the frontend's initial screen.
    To prevent overfetching given that basically all information is needed at startup,
    this route is used instead of the more RESTful approach of having separate routes.
    """

    with req.app.state.db.session() as session:
        # Convert to UTC then drop the timezone so we can use it in the DB, which has
        # UTC timestamps without timezone information.
        now = datetime.now(tz=pytz.utc).replace(tzinfo=None)

        # Obtain relevant database information and convert it to the JSON representation
        # we expose to the frontend.
        db_alert = get_current_alert(now, session)
        alert_json = create_alert_json(db_alert)

        db_routes = session.query(RouteModel).all()
        routes_json = create_routes_json(db_routes, db_alert, session)

        db_stops = session.query(StopModel).all()
        stops_json = create_stops_json(db_stops, db_alert, session)

        return DashboardJSON(routes=routes_json, stops=stops_json, alert=alert_json)


def get_current_alert(now: datetime, session) -> Optional[AlertModel]:
    """
    Obtains the alert that is currently active (i.e the current time falls under the
    time range defined for it).
    """

    return (
        session.query(AlertModel)
        .filter(AlertModel.start_datetime <= now, AlertModel.end_datetime >= now)
        .params(now=now)
        .first()
    )


def create_alert_json(db_alert: Optional[AlertModel]) -> Optional[AlertJSON]:
    """
    Converts the alert model from the database into it's JSON representation.
    """

    if not db_alert:
        return None
    return AlertJSON(body=db_alert.text, endTime=db_alert.end_datetime)


def create_routes_json(
    db_routes: list[RouteModel], db_alert: Optional[AlertModel], session
) -> list[RouteJSON]:
    """
    Converts the route model from the databse into it's JSON representation.
    This will query other database elements in order to find information that
    is tied to the route that the frontend also needs (e.g. waypoints).
    """

    return [
        RouteJSON(
            id=db_route.id,
            name=db_route.name,
            isActive=is_route_active(db_route, db_alert, session),
            waypoints=get_waypoints(db_route, session),
        )
        for db_route in db_routes
    ]


def is_route_active(
    db_route: RouteModel, db_alert: Optional[AlertModel], session
) -> bool:
    """
    Queries and returns whether the frontend is currently active, i.e
    not disabled by the current alert.
    """

    if not db_alert:
        # No alert, should be active
        return True

    # If the route is disabled by the current alert, then it is not active.
    enabled = (
        session.query(RouteDisableModel)
        .filter(
            RouteDisableModel.alert_id == db_alert.id,
            RouteDisableModel.route_id == db_route.id,
        )
        .count()
    ) == 0

    return enabled


def get_waypoints(db_route: RouteModel, session) -> list[CoordinateJSON]:
    """
    Queries and returns the JSON representation of the waypoints for the given route.
    """

    db_waypoints = (
        session.query(WaypointModel).filter(WaypointModel.route_id == db_route.id).all()
    )
    return [
        CoordinateJSON(latitude=db_waypoint.lat, longitude=db_waypoint.lon)
        for db_waypoint in db_waypoints
    ]


def create_stops_json(
    db_stops: list[StopModel], db_alert: Optional[AlertModel], session
) -> list[StopJSON]:
    """
    Converts the stop model from the database into it's JSON representation.
    This will query other database elements in order to find information that
    is tied to the stop that the frontend also needs (e.g. route ids).
    """

    return [
        StopJSON(
            id=db_stop.id,
            name=db_stop.name,
            location=CoordinateJSON(latitude=db_stop.lat, longitude=db_stop.lon),
            isActive=is_stop_active(db_stop, db_alert, session),
            routeIds=get_route_ids(db_stop, session),
        )
        for db_stop in db_stops
    ]


def get_route_ids(db_stop: StopModel, session) -> list[int]:
    """
    Queries and returns the route ids that the given stop is assigned to.
    """

    return [
        route_id
        # with_entities returns a tuple we need to unpack for some reason.
        for (route_id,) in session.query(RouteStopModel)
        .filter(RouteStopModel.stop_id == db_stop.id)
        .with_entities(RouteStopModel.route_id)
        .all()
    ]


def is_stop_active(db_stop: StopModel, db_alert: Optional[AlertModel], session) -> bool:
    """
    Queries and returns whether the given stop is currently active, i.e it's marked as
    active in the database and there is no alert that is disabling it.
    """

    if not db_alert:
        # No alert, fall back to if the current stop is marked as active.
        return db_stop.active

    # If the stop is disabled by the current alert, then it is not active.
    enabled = (
        session.query(StopDisableModel)
        .filter(
            StopDisableModel.alert_id == db_alert.id,
            StopDisableModel.stop_id == db_stop.id,
        )
        .count()
    ) == 0

    return db_stop.active and enabled

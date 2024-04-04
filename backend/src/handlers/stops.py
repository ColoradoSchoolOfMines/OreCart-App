"""
Contains routes specific to working with stops.
"""

from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel
from src.model.alert import Alert
from src.model.route_stop import RouteStop
from src.model.stop import Stop
from src.model.stop_disable import StopDisable
from src.request import process_include

# JSON field names/include values
FIELD_ID = "id"
FIELD_NAME = "name"
FIELD_LATITUDE = "latitude"
FIELD_LONGITUDE = "longitude"
FIELD_ROUTE_IDS = "routeIds"
FIELD_IS_ACTIVE = "isActive"
INCLUDES = {
    FIELD_ROUTE_IDS,
    FIELD_IS_ACTIVE,
}

router = APIRouter(prefix="/stops", tags=["stops"])


@router.get("/")
def get_stops(
    req: Request,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    ## Gets all stops.

    **:param include:** Optional list of fields to include. Valid values are:

            - "routeIds": includes the route ids that the stop is assigned to
            - "isActive": includes whether the stop is currently active

    **:return:** A list of stops in the (default) format

        - id
        - name
        - latitude
        - longitude

    """

    include_set = process_include(include, INCLUDES)
    with req.app.state.db.session() as session:
        stops = session.query(Stop).all()

        # Be more efficient and load the current alert only once if
        # we need it for the isActive field.
        alert = None
        if FIELD_IS_ACTIVE in include_set:
            alert = get_current_alert(datetime.now(timezone.utc), session)

        stops_json = []
        for stop in stops:
            stop_json = {
                FIELD_ID: stop.id,
                FIELD_NAME: stop.name,
                FIELD_LATITUDE: stop.lat,
                FIELD_LONGITUDE: stop.lon,
            }

            # Add related values to the route if included
            if FIELD_ROUTE_IDS in include_set:
                stop_json[FIELD_ROUTE_IDS] = query_route_ids(stop.id, session)

            if FIELD_IS_ACTIVE in include_set:
                stop_json[FIELD_IS_ACTIVE] = is_stop_active(stop, alert, session)

            stops_json.append(stop_json)

        return stops_json


@router.get("/{stop_id}")
def get_stop(
    req: Request,
    stop_id: int,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    ## Gets the stop with the specified id.

    **:param stop_id:** Unique integer ID of the stop

    **:param include:** Optional list of fields to include. Valid values are:

        - "routeIds": includes the route ids that the stop is assigned to
        - "isActive": includes whether the stop is currently active

    **:return:** The stop in the (default) format

        - id
        - name
        - latitude
        - longitude
    """

    include_set = process_include(include, INCLUDES)
    with req.app.state.db.session() as session:
        stop = session.query(Stop).filter(Stop.id == stop_id).first()
        if not stop:
            raise HTTPException(status_code=404, detail="Stop not found")

        stop_json = {
            FIELD_ID: stop.id,
            FIELD_NAME: stop.name,
            FIELD_LATITUDE: stop.lat,
            FIELD_LONGITUDE: stop.lon,
        }

        # Add related values to the route if included
        if FIELD_IS_ACTIVE in include_set:
            alert = get_current_alert(datetime.now(timezone.utc), session)
            stop_json[FIELD_IS_ACTIVE] = is_stop_active(stop, alert, session)

        if FIELD_ROUTE_IDS in include_set:
            stop_json[FIELD_ROUTE_IDS] = query_route_ids(stop.id, session)

        return stop_json


def query_route_ids(stop_id: int, session) -> list[int]:
    """
    Queries and returns the route ids that the given stop is assigned to.
    """

    return [
        route_id
        # with_entities returns a tuple we need to unpack for some reason.
        for (route_id,) in session.query(RouteStop)
        .order_by(RouteStop.position)
        .filter(RouteStop.stop_id == stop_id)
        .with_entities(RouteStop.route_id)
        .all()
    ]


def get_current_alert(now: datetime, session) -> Optional[Alert]:
    """
    Queries and returns the current alert, if any, that is active at the given time.
    """

    return (
        session.query(Alert)
        .filter(Alert.start_datetime <= now, Alert.end_datetime >= now)
        .first()
    )


def is_stop_active(stop: Stop, alert: Optional[Alert], session) -> bool:
    """
    Queries and returns whether the given stop is currently active, i.e it's marked as
    active in the database and there is no alert that is disabling it.
    """

    if not alert:
        # No alert, fall back to if the current stop is marked as active.
        return stop.active

    # If the stop is disabled by the current alert, then it is not active.
    enabled = (
        session.query(StopDisable)
        .filter(
            StopDisable.alert_id == alert.id,
            StopDisable.stop_id == stop.id,
        )
        .count()
    ) == 0

    # Might still be disabled even if the current alert does not disable the stop.
    return stop.active and enabled


class StopModel(BaseModel):
    """
    A model for the request body to make a new stop or update a stop
    """

    name: str
    latitude: float
    longitude: float
    active: bool


@router.post("/")
def create_stop(req: Request, stop_model: StopModel) -> dict[str, str]:
    """
    ## Creates a new stop.

    **:param stop_model:** StopModel which includes:

            - name (str)
            - latitude (float)
            - longitude (float)
            - active (bool)

    **:return:** *"OK"* message
    """

    with req.app.state.db.session() as session:
        stop = Stop(
            name=stop_model.name,
            lat=stop_model.latitude,
            lon=stop_model.longitude,
            active=stop_model.active,
        )
        session.add(stop)
        session.commit()

    return {"message": "OK"}


@router.put("/{stop_id}")
def update_stop(
    req: Request,
    stop_id: int,
    stop_model: StopModel,
) -> dict[str, str]:
    """
    ## Updates the stop with the specified id.

    **:param stop_id:** Unique integer ID of the stop

    **:param stop_model:** StopModel which includes:

            - name (str)
            - latitude (float)
            - longitude (float)
            - active (bool)

    **:return:** *"OK"* message
    """

    with req.app.state.db.session() as session:
        stop = session.query(Stop).filter(Stop.id == stop_id).first()
        if not stop:
            raise HTTPException(status_code=404, detail="Stop not found")
        stop.name = stop_model.name
        stop.lat = stop_model.latitude
        stop.lon = stop_model.longitude
        stop.active = stop_model.active

        session.commit()

    return {"message": "OK"}


@router.delete("/{stop_id}")
def delete_stop(req: Request, stop_id: int) -> dict[str, str]:
    """
    ## Deletes the stop with the specified id.

    **:param stop_id:** Unique integer ID of the stop

    **:return:** *"OK"* message
    """

    with req.app.state.db.session() as session:
        stop = session.query(Stop).filter(Stop.id == stop_id).first()
        if not stop:
            raise HTTPException(status_code=404, detail="Stop not found")

        session.query(Stop).filter(Stop.id == stop_id).delete()
        session.commit()

    return {"message": "OK"}

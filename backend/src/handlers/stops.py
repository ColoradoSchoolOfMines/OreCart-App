"""
Contains routes specific to working with stops.
"""

from datetime import datetime, timezone
from typing import Annotated, Any, Optional, Iterator

from fastapi import APIRouter, HTTPException, Query, Request
from src.model.alert import Alert
from src.model.route_stop import RouteStop
from src.model.stop import Stop
from src.model.stop_disable import StopDisable
from src.request import process_include

# JSON field names/include values
FIELD_ID = "id"
FIELD_NAME = "name"
FIELD_ROUTE_IDS = "routeIds"
FIELD_LOCATION = "location"
FIELD_IS_ACTIVE = "isActive"
FIELD_LATITUDE = "latitude"  # Location is includable
FIELD_LONGITUDE = "longitude"  # Location is includable
INCLUDES = {
    FIELD_NAME,
    FIELD_ROUTE_IDS,
    FIELD_LOCATION,
    FIELD_IS_ACTIVE,
}

router = APIRouter(prefix="/stops", tags=["stops"])


@router.get("/")
def get_stops(
    req: Request,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    Gets all stops.
    """

    include_set = process_include(include, INCLUDES)
    with req.app.state.db.session() as session:
        query = session.query(Stop)
        query, entities = apply_includes_to_query(query, include_set)
        stops = []

        alert = None
        if FIELD_IS_ACTIVE in include_set:
            alert = get_current_alert(
                datetime.now(timezone.utc).replace(tzinfo=None), session
            )

        for stop in query.all():
            stop = unpack_entity_tuple(stop, entities)

            if alert:
                stop[FIELD_IS_ACTIVE] = is_stop_active(stop, alert, session)

            if FIELD_ROUTE_IDS in include_set:
                stop[FIELD_ROUTE_IDS] = query_route_ids(stop[FIELD_ID], session)

            stops.append(stop)

        return stops


@router.get("/{stop_id}")
def get_stop(
    req: Request,
    stop_id: int,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    Shared implemntation of the GET /stops endpoints.
    """

    include_set = process_include(include, INCLUDES)
    with req.app.state.db.session() as session:
        query = session.query(Stop).filter(Stop.id == stop_id)
        query, entities = apply_includes_to_query(query, include_set)

        stop = query.first()
        if not stop:
            raise HTTPException(status_code=404, detail="Stop not found")

        stop = unpack_entity_tuple(stop, entities)

        if FIELD_IS_ACTIVE in include_set:
            alert = get_current_alert(datetime.now(timezone.utc), session)
            stop[FIELD_IS_ACTIVE] = is_stop_active(stop, alert, session)

        if FIELD_ROUTE_IDS in include_set:
            stop[FIELD_ROUTE_IDS] = query_route_ids(stop[FIELD_ID], session)

        return stop


def apply_includes_to_query(query, include_set) -> tuple[Any, Iterator[str]]:
    """
    Applies the given include parameters to the given query, reducing the query to only
    the fields that are desired. Since this will cause the query to return a tuple, a
    dictionary is also provided of the names for each value that will appear in the tuple
    in-order. This can be used with unpack_stop_values can be used to turn the tuple into
    a JSON structure.
    """

    entities: dict[str, Any] = {FIELD_ID: Stop.id}
    if FIELD_NAME in include_set:
        entities[FIELD_NAME] = Stop.name

    if FIELD_LOCATION in include_set:
        entities[FIELD_LATITUDE] = Stop.lat
        entities[FIELD_LONGITUDE] = Stop.lon

    if FIELD_IS_ACTIVE in include_set:
        entities[FIELD_IS_ACTIVE] = Stop.active

    return (query.with_entities(*entities.values()), iter(entities.keys()))


def unpack_entity_tuple(result: tuple, entities: Iterator[str]) -> dict:
    """
    Given a tuple of values and a list of the names for each value, returns a dictionary
    mapping each name to its corresponding value.
    """
    return {key: value for key, value in zip(entities, result)}


def query_route_ids(stop_id: int, session) -> list[int]:
    """
    Queries and returns the route ids that the given stop is assigned to.
    """

    return [
        route_id
        # with_entities returns a tuple we need to unpack for some reason.
        for (route_id,) in session.query(RouteStop)
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


def is_stop_active(stop: dict, alert: Optional[Alert], session) -> bool:
    """
    Queries and returns whether the given stop is currently active, i.e it's marked as
    active in the database and there is no alert that is disabling it.
    """

    if not alert:
        # No alert, fall back to if the current stop is marked as active.
        return stop[FIELD_IS_ACTIVE]

    # If the stop is disabled by the current alert, then it is not active.
    enabled = (
        session.query(StopDisable)
        .filter(
            StopDisable.alert_id == alert.id,
            StopDisable.stop_id == stop[FIELD_ID],
        )
        .count()
    ) == 0

    return stop[FIELD_IS_ACTIVE] and enabled

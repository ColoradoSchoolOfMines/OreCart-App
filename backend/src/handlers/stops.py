"""
Contains routes specific to working with stops.
"""

from datetime import datetime, timezone
from typing import Annotated, Any, Optional

from fastapi import APIRouter, HTTPException, Query, Request
from src.model.alert import Alert
from src.model.route_stop import RouteStop
from src.model.stop import Stop
from src.model.stop_disable import StopDisable
from src.request import validate_include

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
def get_all_stops(
    req: Request,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    Gets all stops.
    """
    return get_stop_impl(req, None, include)


@router.get("/{stop_id}")
def get_stop_with_id(
    req: Request,
    stop_id: int,
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    Gets the stop with the specified ID.
    """
    return get_stop_impl(req, stop_id, include)


def get_stop_impl(
    req: Request,
    stop_id: Optional[int],
    include: Annotated[list[str] | None, Query()] = None,
):
    """
    Shared implemntation of the GET /stops endpoints.
    """
    include_set = INCLUDES
    if include:
        include_set = validate_include(include, INCLUDES)

    with req.app.state.db.session() as session:
        return query_stop(stop_id, include_set, session)


def query_stop(
    stop_id: Optional[int], include_set: set[str], session
) -> list[dict] | dict:
    """
    Gets stop information and returns it in the format expected by the client,
    given the specified include parameters.
    """

    stop_query = session.query(Stop)

    # Filter to the ID if specified, otherwise just query for all stops
    if stop_id is not None:
        stop_query = stop_query.filter(Stop.id == stop_id)

    # Unlike other routes, several database columns must be read or not depending
    # on the included values. This requires us to do a more unorthodox query where
    # we selectively include entities to query. However, since such a query will
    # result in a duple of anonymous values, we also have to make sure in what
    # exact order we added each entity to the query so we can reconstruct a JSON
    # object from the tuple.
    entities: dict[str, Any] = {FIELD_ID: Stop.id}
    if FIELD_NAME in include_set:
        entities[FIELD_NAME] = Stop.name
    if FIELD_LOCATION in include_set:
        entities[FIELD_LATITUDE] = Stop.lat
        entities[FIELD_LONGITUDE] = Stop.lon
    if FIELD_IS_ACTIVE in include_set:
        entities[FIELD_IS_ACTIVE] = Stop.active
    stop_query = stop_query.with_entities(*entities.values())
    stops = [
        # If we include the entities foo and bar, that will result in a tuple of
        # (foo, bar). By having the dict mapping "foo", "bar" earlier, we can
        # zip them together to yield {"foo": foo, "bar": bar}.
        {key: value for key, value in zip(entities.keys(), stop)}
        for stop in stop_query.all()
    ]

    if len(stops) == 0:
        raise HTTPException(status_code=404, detail="Stop not found")

    for stop in stops:
        # Query for and add any desired optional values to be included.
        if FIELD_ROUTE_IDS in include_set:
            stop[FIELD_ROUTE_IDS] = query_route_ids(stop[FIELD_ID], session)

        if FIELD_IS_ACTIVE in include_set:
            stop[FIELD_IS_ACTIVE] = is_stop_active(stop, session)

    return stops


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


def is_stop_active(stop: dict, session) -> bool:
    """
    Queries and returns whether the given stop is currently active, i.e it's marked as
    active in the database and there is no alert that is disabling it.
    """

    # Convert to UTC then drop the timezone so we can use it in the DB, which has
    # UTC timestamps without timezone information.
    now = datetime.now(tz=timezone.utc).replace(tzinfo=None)

    alert = (
        session.query(Alert)
        .filter(Alert.start_datetime <= now, Alert.end_datetime >= now)
        .first()
    )

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

import asyncio
import struct
from datetime import datetime, timedelta, timezone
from math import cos, radians, sqrt
from typing import Annotated, Any, Dict, List, Optional, Union

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    Request,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import BaseModel
from sqlalchemy import func
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.route import Route
from src.model.route_stop import RouteStop
from src.model.stop import Stop
from src.model.van_location import VanLocation
from src.model.van_tracker_session import VanTrackerSession
from src.request import process_include

router = APIRouter(prefix="/vans", tags=["vans"])

FIELD_ID = "id"
FIELD_GUID = "guid"
FIELD_LATITUDE = "latitude"
FIELD_LONGITUDE = "longitude"
FIELD_COLOR = "color"
FIELD_ROUTE_ID = "routeId"
FIELD_ROUTE_IDS = "routeIds"
FIELD_ALIVE = "alive"
FIELD_LOCATION = "location"
FIELD_CREATED_AT = "started"
FIELD_UPDATED_AT = "updated"
FIELD_TYPE = "type"
FIELD_ARRIVALS = "arrivals"
FIELD_VAN = "van"
FIELD_VANS = "vans"
TYPE_ERROR = "error"
INCLUDES_V1 = {FIELD_LOCATION}
INCLUDES_V2 = {FIELD_COLOR, FIELD_LOCATION}

THRESHOLD_TIME = timedelta(seconds=10)
AVERAGE_VAN_SPEED_MPS = 8.9408  # 20 mph

EARTH_CIRCUFERENCE_M = 40075 * 1000  # km
DEGREES_IN_CIRCLE = 360  # degrees
DEGREES_PER_M = DEGREES_IN_CIRCLE / EARTH_CIRCUFERENCE_M # degree/m
M_PER_DEGREES = EARTH_CIRCUFERENCE_M / DEGREES_IN_CIRCLE # m/degree
M_PER_FT = 0.3048
THRESHOLD_RADIUS_FT = 100
THRESHOLD_RADIUS_DEGREES = THRESHOLD_RADIUS_FT * M_PER_FT * DEGREES_PER_M
TRHESHOLD_LEAPFROG_PERCENT = 0.5


@router.get("/")
async def get_van_v1(
    req: Request,
    include: Annotated[List[str] | None, Query()] = None,
) -> List[Dict[str, Union[int, str]]]:
    include_set = process_include(include, INCLUDES_V1)
    with req.app.state.db.session() as session:
        tracker_sessions = (
            session.query(VanTrackerSession)
            .order_by(VanTrackerSession.van_guid, VanTrackerSession.created_at.desc())
            .distinct(VanTrackerSession.van_guid)
            .all()
        )
        locations_json: List[Dict[str, Union[int, str]]] = []
        for tracker_session in tracker_sessions:
            van_json = {
                FIELD_ID: int(tracker_session.van_guid),
                FIELD_ROUTE_ID: tracker_session.route_id,
                FIELD_GUID: tracker_session.van_guid,
            }
            if FIELD_LOCATION in include_set:
                van_json[FIELD_LOCATION] = query_most_recent_location(
                    session, tracker_session
                )
            locations_json.append(van_json)
        return locations_json


@router.websocket("/location/subscribe/")
async def subscribe_location_v1(websocket: WebSocket):
    await websocket.accept()

    while True:
        now = datetime.now(timezone.utc)
        with websocket.app.state.db.session() as session:
            tracker_sessions = (
                session.query(VanTrackerSession)
                .filter(
                    VanTrackerSession.dead == False,
                    not_stale(now, VanTrackerSession.created_at),
                )
                .order_by(
                    VanTrackerSession.van_guid, VanTrackerSession.created_at.desc()
                )
                .distinct(VanTrackerSession.van_guid)
                .all()
            )
            locations_json: Dict[int, Dict[str, Union[str, int, float]]] = {}
            for tracker_session in tracker_sessions:
                location = query_most_recent_location(session, tracker_session)
                stops = (
                    session.query(Stop)
                    .join(RouteStop)
                    .filter(RouteStop.route_id == tracker_session.route_id)
                    .order_by(RouteStop.position)
                    .all()
                )
                next_stop_index = (tracker_session.stop_index + 1) % len(stops)
                stop = stops[next_stop_index]
                van_distance_degrees = van_distance_degrees(
                    stop.lat, stop.lon, location.lat, location.lon
                )
                seconds_to_next_stop = van_distance_degrees * M_PER_DEGREES / AVERAGE_VAN_SPEED_MPS
                location_json: Dict[str, Union[str, int, float]] = {
                    "timestamp": int(location.created_at.timestamp()),
                    "latitude": location.lat,
                    "longitude": location.lon,
                    "nextStopId": stop.id,
                    "secondsToNextStop": seconds_to_next_stop,
                }
                locations_json[tracker_session.van_guid] = location_json
            await websocket.send_json(locations_json)
            await asyncio.sleep(2)


@router.get("/v2")
async def get_vans_v2(
    req: Request,
    alive: Optional[bool] = None,
    route_ids: Annotated[List[int] | None, Query()] = None,
    include: Annotated[List[str] | None, Query()] = None,
) -> List[Dict[str, Union[bool, float, str, int, Dict[str, float]]]]:
    include_set = process_include(include, INCLUDES_V2)
    now = datetime.now(timezone.utc)
    with req.app.state.db.session() as session:
        result = query_latest_vans(session, now, alive, route_ids, include_set)
        return result


@router.get("/v2/{van_guid}")
async def get_van_v2(
    req: Request,
    van_guid: str,
    include: Annotated[List[str] | None, Query()] = None,
) -> Dict[str, Union[bool, float, str, int, Dict[str, float]]]:
    include_set = process_include(include, INCLUDES_V2)
    now = datetime.now(timezone.utc)
    with req.app.state.db.session() as session:
        return query_latest_van(session, now, van_guid, include_set)


class VanSubscriptionQueryModel(BaseModel):
    type: str
    guid: Optional[str] = None
    alive: Optional[bool] = None
    routeIds: Optional[List[int]] = None


class VanSubscriptionMessageModel(BaseModel):
    include: List[str]
    query: VanSubscriptionQueryModel


@router.websocket("/v2/subscribe/")
async def subscribe_vans(websocket: WebSocket) -> None:
    await websocket.accept()
    while True:
        try:
            # Given the dynamic nature of subscribing, we actually overload the message
            # sent such that you can specify a vanguid or a route filter rather than
            # having 2 separate http routes.
            msg_json = await websocket.receive_json()
        except WebSocketDisconnect:
            break
        try:
            msg = VanSubscriptionMessageModel(**msg_json)
            include_set = process_include(msg.include, INCLUDES_V2)
            now = datetime.now(timezone.utc)
            with websocket.app.state.db.session() as session:
                resp: Dict[
                    str,
                    Union[
                        str,
                        Dict[str, Union[float, str, bool, int, dict[str, float]]],
                        List[Dict[str, Union[float, str, bool, int, dict[str, float]]]],
                    ],
                ] = {
                    FIELD_TYPE: msg.query.type,
                }
                if msg.query.type == FIELD_VAN:
                    if msg.query.guid is None:
                        raise HTTPException(
                            status_code=400, detail="GUID must be specified"
                        )
                    resp[FIELD_VAN] = query_latest_van(
                        session, now, msg.query.guid, include_set
                    )
                elif msg.query.type == FIELD_VANS:
                    resp[FIELD_VANS] = query_latest_vans(
                        session,
                        now,
                        msg.query.alive,
                        msg.query.routeIds,
                        include_set,
                    )
                else:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid filter " + msg.query.type + " specified",
                    )
                await websocket.send_json(resp)
        except HTTPException as e:
            resp = {
                FIELD_TYPE: TYPE_ERROR,
                TYPE_ERROR: e.detail,
            }
            await websocket.send_json(resp)
            continue
        except Exception as e:
            await websocket.close()
            raise e
    await websocket.close()


def query_latest_van(
    session, now: datetime, guid: str, include_set: set[str]
) -> Dict[str, Union[float, str, bool, int, Dict[str, float]]]:
    tracker_session = (
        session.query(VanTrackerSession)
        .filter(VanTrackerSession.van_guid == guid)
        .first()
    )
    if tracker_session is None:
        raise HTTPException(status_code=404, detail="Van not found")
    return base_query_van(session, now, tracker_session, include_set)


def query_latest_vans(
    session,
    now: datetime,
    alive: Optional[bool],
    route_ids: Optional[List[int]],
    include_set: set[str],
) -> List[Dict[str, Union[float, str, bool, int, Dict[str, float]]]]:
    tracker_query = (
        session.query(VanTrackerSession)
        .order_by(VanTrackerSession.van_guid, VanTrackerSession.created_at.desc())
        .distinct(VanTrackerSession.van_guid)
    )

    tracker_sessions = tracker_query.all()

    if alive is not None:
        tracker_sessions = [
            tracker_session
            for tracker_session in tracker_sessions
            if not tracker_session.dead == alive
            and not_stale(now, tracker_session.created_at)
        ]

    if route_ids is not None:
        tracker_sessions = [
            tracker_session
            for tracker_session in tracker_sessions
            if tracker_session.route_id in route_ids
        ]

    locations_json: List[Dict[str, Union[float, str, bool, int, Dict[str, float]]]] = []
    for tracker_session in tracker_sessions:
        locations_json.append(
            base_query_van(session, now, tracker_session, include_set)
        )
    return locations_json


def base_query_van(
    session, now: datetime, tracker_session: VanTrackerSession, include_set: set[str]
) -> Dict[str, Union[float, str, bool, int, Dict[str, float]]]:
    van_json: Dict[str, Union[float, str, bool, int, Dict[str, float]]] = {
        FIELD_GUID: str(tracker_session.van_guid),
        FIELD_ALIVE: not tracker_session.dead
        and not_stale(now, tracker_session.created_at),
        FIELD_CREATED_AT: int(tracker_session.created_at.timestamp()),
        FIELD_UPDATED_AT: int(tracker_session.updated_at.timestamp()),
    }
    if FIELD_LOCATION in include_set:
        location = query_most_recent_location(session, tracker_session)
        if location is not None:
            van_json[FIELD_LOCATION] = {
                FIELD_LATITUDE: location.lat,
                FIELD_LONGITUDE: location.lon,
            }
    if FIELD_COLOR in include_set:
        route = (
            session.query(Route).filter(Route.id == tracker_session.route_id).first()
        )
        van_json[FIELD_COLOR] = route.color
    return van_json


@router.websocket("/v2/arrivals/subscribe")
async def subscribe_arrivals(websocket: WebSocket) -> None:
    await websocket.accept()
    while True:
        try:
            stop_filter: Dict[str, List[int]] = await websocket.receive_json()
        except WebSocketDisconnect:
            break
        # Make sure stop filter confiorms to expected format
        if not all(
            isinstance(k, str) and isinstance(v, list) for k, v in stop_filter.items()
        ):
            await websocket.send_json(
                {FIELD_TYPE: TYPE_ERROR, TYPE_ERROR: "Invalid stop filter"}
            )
            continue
        now = datetime.now(timezone.utc)
        with websocket.app.state.db.session() as session:
            try:
                arrivals = query_arrivals(session, now, stop_filter)
            except Exception as e:
                await websocket.close()
                raise e
            response = {FIELD_TYPE: FIELD_ARRIVALS, FIELD_ARRIVALS: arrivals}
            await websocket.send_json(response)
    await websocket.close()


def query_arrivals(
    session, now: datetime, stop_filter: Dict[str, List[int]]
) -> Dict[int, Dict[int, int]]:
    arrivals_json: Dict[int, Dict[int, int]] = {}
    for stop_id_str in stop_filter:
        stop_id = int(stop_id_str)
        stop_arrivals_json: Dict[int, int] = {}
        for route_id in stop_filter[stop_id_str]:
            stops = (
                session.query(Stop)
                .join(RouteStop)
                .filter(RouteStop.route_id == route_id)
                .order_by(RouteStop.position)
                .all()
            )
            if not stops:
                continue
            stop_index = next(
                (index for index, stop in enumerate(stops) if stop.id == stop_id),
                None,
            )
            if stop_index is None:
                continue
            distance_m = calculate_van_distance(
                session, now, stops, stop_index, route_id
            )
            if not distance_m:
                continue
            stop_arrivals_json[route_id] = distance_m / AVERAGE_VAN_SPEED_MPS
        if stop_arrivals_json:
            arrivals_json[stop_id] = stop_arrivals_json
    return arrivals_json


def calculate_van_distance(
    session, now: datetime, stops: List[Stop], stop_index: int, route_id: int
):
    current_distance_degrees = 0.0
    current_stop = stops[stop_index]
    start = stop_index
    while True:
        arriving_session = active_session_query(
            session,
            now,
            VanTrackerSession.route_id == route_id,
            VanTrackerSession.stop_index == (stop_index - 1) % len(stops),
        ).first()
        if arriving_session is not None:
            location = query_most_recent_location(session, arriving_session)
            if location is not None:
                current_distance_degrees += distance_degrees(
                    location.lat,
                    location.lon,
                    current_stop.lat,
                    current_stop.lon,
                )
                return current_distance_degrees * M_PER_DEGREES
        # backtrack by decrementing stop_index, wrapping around if necessary
        stop_index = (stop_index - 1) % len(stops)
        if stop_index == start:
            break
        last_stop = current_stop
        current_stop = stops[stop_index]
        current_distance_degrees += distance_degrees(
            last_stop.lat,
            last_stop.lon,
            current_stop.lat,
            current_stop.lon,
        )


@router.post("/routeselect/{van_guid}")  # Called routeselect for backwards compat
async def begin_session(req: Request, van_guid: str) -> HardwareOKResponse:
    body = await req.body()
    route_id = struct.unpack("<i", body)

    with req.app.state.db.session() as session:
        if not session.query(Route).filter_by(id=route_id).first():
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.INVALID_ROUTE_ID
            )

        tracker_sessions = (
            session.query(VanTrackerSession).filter_by(van_guid=van_guid).all()
        )
        for tracker_session in tracker_sessions:
            tracker_session.dead = True
        new_van_tracker_session = VanTrackerSession(
            van_guid=van_guid,
            route_id=route_id,
        )
        session.add(new_van_tracker_session)
        session.commit()

    return HardwareOKResponse()


@router.post("/location/{van_guid}")
async def post_location(req: Request, van_guid: str) -> HardwareOKResponse:
    # byte body: long long for timestamp, double for lat, double for lon
    body = await req.body()
    timestamp_ms, lat, lon = struct.unpack("<Qdd", body)
    timestamp = datetime.fromtimestamp(timestamp_ms / 1000.0, timezone.utc)

    now = datetime.now(timezone.utc)

    # Check that the timestamp is not too far in the past. This implies a statistics
    # update that was delayed in transit and may be irrelevant now.
    if now - timestamp > timedelta(minutes=1):
        raise HardwareHTTPException(
            status_code=400, error_code=HardwareErrorCode.TIMESTAMP_TOO_FAR_IN_PAST
        )

    # Check that the timestamp is not in the future. This implies a hardware clock
    # malfunction.
    if timestamp > now:
        raise HardwareHTTPException(
            status_code=400, error_code=HardwareErrorCode.TIMESTAMP_IN_FUTURE
        )

    with req.app.state.db.session() as session:
        tracker_session = active_session_query(
            session, now, VanTrackerSession.van_guid == van_guid
        ).first()
        if tracker_session is None:
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.CREATE_NEW_SESSION
            )

        stops = (
            session.query(Stop)  # Query Stop instead of RouteStop
            .join(RouteStop, RouteStop.stop_id == Stop.id)
            .filter(RouteStop.route_id == tracker_session.route_id)
            .order_by(RouteStop.position)
            .all()
        )

        # Add location to session
        new_location = VanLocation(
            session_id=tracker_session.id, created_at=timestamp, lat=lat, lon=lon
        )
        session.add(new_location)

        if tracker_session.created_at == tracker_session.updated_at:
            stop_pairs = []
            for i in range(len(stops) - 1):
                left, right = stops[i], stops[i + 1]
                l_distance_degrees = distance_degrees(lat, lon, left.lat, left.lon)
                r_distance_degrees = distance_degrees(lat, lon, right.lat, right.lon)
                stop_pairs.append((i, i + 1, l_distance_degrees, r_distance_degrees))
            closest_stop_pair = min(stop_pairs, key=lambda x: min(x[2], x[3]))
            if closest_stop_pair[2] >= closest_stop_pair[3]:
                tracker_session.stop_index = closest_stop_pair[1]
            else:
                tracker_session.stop_index = closest_stop_pair[0]

        tracker_session.updated_at = timestamp
        session.commit()

        # To find an accurate time estimate for a stop, we need to remove vans that are not arriving at a stop, either
        # because they aren't arriving at the stop or because they have departed it. We achieve this currently by
        # implementing a state machine that tracks the (guessed) current stop of each van. We can then use that to find
        # the next logical stop and estimate the time to arrive to that.

        # We want to consider all of the stops that are coming up for this van, as that allows to handle cases where a
        # stop is erroneously skipped. Also make sure we include subsequent stops that wrap around. The wrap around slice
        # needs to be bounded to 0 to prevent a negative index causing weird slicing behavior.
        subsequent_stops = (
            stops[tracker_session.stop_index + 1 :]
            + stops[: max(tracker_session.stop_index - 1, 0)]
        )
        locations = (
            session.query(VanLocation)
            .filter(
                VanLocation.session_id == tracker_session.id,
                VanLocation.created_at > now - timedelta(seconds=300),
            )
            .order_by(VanLocation.created_at)
        )
        for i, stop in enumerate(subsequent_stops):
            longest_subset: List[datetime] = []
            current_subset: List[datetime] = []

            # Find the longest consequtive subset (i.e streak) where the distance of the past couple of
            # van locations is consistently within this stop's radius.
            for location in locations:
                stop_distance_degrees = distance_degrees(
                    location.lat,
                    location.lon,
                    stop.lat,
                    stop.lon,
                )
                if stop_distance_degrees < THRESHOLD_RADIUS_DEGREES:
                    current_subset.append(location.created_at)
                else:
                    if len(current_subset) > len(longest_subset):
                        longest_subset = current_subset
                    current_subset = []
            if len(current_subset) > len(longest_subset):
                longest_subset = current_subset

            if longest_subset:
                # A streak exists, find the overall duration that this van was within the stop's radius. Since locations
                # are ordered from oldest to newest, we can just subtract the last and first timestamps.
                duration = longest_subset[-1] - longest_subset[0]
            else:
                # No streak, so we weren't at the stop for any amount of time.
                duration = timedelta(seconds=0)

            if duration >= THRESHOLD_TIME:
                # We were at this stop for long enough, move to it. Since the stops iterated through are relative to the
                # current stop, we have to add the current stop index to the current index in the loop to get the actual
                # stop index.
                # Note: It's possible that the van was at another stop's radius for even longer, but this is not considered
                # until real-world testing shows this edge case to be important.
                tracker_session.stop_index = (tracker_session.stop_index + i + 1) % len(
                    stops
                )
                session.commit()
                break

        # That did not work. A van might have leapfrogged a stop due to a delayed location ping instead.
        # Fix this by seeing if there was a point in which a van might have logically went through a stop radius
        # in between two pings across the threshold time.
        break_outer = False
        for i in range(len(locations) - 1):
            if break_outer:
                break
            left = locations[i]
            right = locations[i + 1]
            for i, stop in enumerate(subsequent_stops):
                percent = line_circle_intersection_percentage(
                    left.lat, left.lon, right.lat, right.lon,
                    stop.lat, stop.lon, THRESHOLD_RADIUS_DEGREES)
                duration = right.timestamp - left.timestamp
                if percent > TRHESHOLD_LEAPFROG_PERCENT and right.timestamp - left.timestamp >= THRESHOLD_TIME:
                    tracker_session.stop_index = (tracker_session.stop_index + i + 1) % len(
                        stops
                    )
                    session.commit()
                    break_outer = True
                    break


    return HardwareOKResponse()

def line_circle_intersection_percentage(alat, alon, blat, blon, clat, clon, r):
    # Calculate the distance between points a and b
    line_length_degrees = distance_degrees(alat, alon, blat, blon)

    # Calculate the distance from point c to the line formed by points a and b
    line_distance_degrees = abs((blon - alon)*clat - (blat - alat)*clon + blat*alon - blon*alat) / line_length_degrees

    # If the distance from point c to the line is greater than the radius r, then the line does not intersect the circle
    if line_distance_degrees > r:
        return 0

    # Calculate the two intersection points
    dx, dy = blat - alat, blon - alon
    A = dx**2 + dy**2
    B = 2 * (dx * (alat - clat) + dy * (alon - clon))
    C = (alat - clat)**2 + (alon - clon)**2 - r**2
    det = B**2 - 4*A*C
    t1 = (-B + sqrt(det)) / (2*A)
    t2 = (-B - sqrt(det)) / (2*A)

    # Calculate the distances from point a to each of the intersection points
    d1 = sqrt((alat + t1*dx - alat)**2 + (alon + t1*dy - alon)**2)
    d2 = sqrt((alat + t2*dx - alat)**2 + (alon + t2*dy - alon)**2)

    # The percentage of the line that intersects the circle is the smaller of these two distances divided by the total length of the line
    return min(d1, d2) / line_length_degrees * 100

def active_session_query(session, now: datetime, *filters):
    query = session.query(VanTrackerSession).filter(
        VanTrackerSession.dead == False,
        not_stale(now, VanTrackerSession.created_at),
        *filters
    )
    return query


def not_stale(now: datetime, datetimeish) -> bool:
    return now - datetimeish < timedelta(hours=12)


def query_most_recent_location(
    session, tracker_session: VanTrackerSession
) -> VanLocation:
    return (
        session.query(VanLocation)
        .filter_by(session_id=tracker_session.id)
        .order_by(VanLocation.created_at.desc())
        .first()
    )


def distance_degrees(alat: float, alon: float, blat: float, blon: float) -> float:
    dlat = alat - blat
    dlon = alon - blon
    return sqrt(dlat**2 + dlon**2) 

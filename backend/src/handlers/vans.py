import asyncio
import itertools
import json
import struct
import time
from datetime import datetime, timedelta, timezone
from math import cos, radians, sqrt
from typing import Dict, List, Optional, Set, Union

from fastapi import APIRouter, HTTPException, Query, Request, WebSocket
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.route import Route
from src.model.route_stop import RouteStop
from src.model.stop import Stop
from src.model.van import Van
from src.model.van_location import VanLocation
from src.model.van_tracker_session import VanTrackerSession
from src.request import process_include
from starlette.responses import Response

router = APIRouter(prefix="/vans", tags=["vans"])


@router.websocket("/v2/location/subscribe")
async def subscribe_location(websocket: WebSocket) -> None:
    await websocket.accept()
    while True:
        # Check for any sent text, but don't block waiting for text
        try:
            route_filter: list[int] = json.loads(await websocket.receive_text())
        except:
            # If the websocket is closed, we'll get an exception here
            break

        # Get all tracker sessions
        now = datetime.now(timezone.utc)
        with websocket.app.state.db.session() as session:
            tracker_sessions = (
                session.query(VanTrackerSession)
                .filter(
                    VanTrackerSession.dead == False,
                    VanTrackerSession.created_at > now - timedelta(seconds=300),
                    VanTrackerSession.route_id._in(route_filter),
                )
                .all()
            )
            locations_json = []
            for tracker_session in tracker_sessions:
                location = (
                    session.query(VanLocation)
                    .filter(
                        VanLocation.session_id == tracker_session.id,
                    )
                    .order_by(VanLocation.created_at.desc())
                )
                route = (
                    session.query(Route)
                    .filter(Route.id == tracker_session.route_id)
                    .first()
                )
                locations_json.append(
                    {
                        "latitude": location.lat,
                        "longitude": location.lon,
                        "color": route.color,
                    }
                )
            await websocket.send_json(locations_json)
    await websocket.close()


@router.websocket("/v2/arrivals/subscribe")
async def subscribe_arrivals(websocket: WebSocket) -> None:
    await websocket.accept()
    while True:
        # Check for any sent text, but don't block waiting for text
        try:
            stop_filter: dict[int, list[int]] = json.loads(
                await websocket.receive_text()
            )
        except:
            # If the websocket is closed, we'll get an exception here
            break
        now = datetime.now(timezone.utc)
        with websocket.app.state.db.session() as session:
            arrivals_json = {}
            for stop_id in stop_filter:
                stop_arrivals_json = {}
                for route_id in stop_filter[stop_id]:
                    stops = (
                        session.query(RouteStop)
                        .filter(
                            RouteStop.stop_id == stop_id, RouteStop.route_id == route_id
                        )
                        .order_by(RouteStop.position)
                        .all()
                    )
                    if not stops:
                        continue
                    stop_index = next(
                        (
                            index
                            for index, stop in enumerate(stops)
                            if stop.stop_id == stop_id
                        ),
                        None,
                    )
                    if stop_index is None:
                        continue
                    current_distance = 0.0
                    current_stop = stops[stop_index]
                    while stop_index > 0:
                        arriving_session = (
                            session.query(VanTrackerSession)
                            .filter(
                                VanTrackerSession.stop_index == stop_index,
                                VanTrackerSession.route_id == route_id,
                                VanTrackerSession.dead == False,
                                VanTrackerSession.created_at
                                > now - timedelta(hours=12),
                            )
                            .first()
                        )
                        if arriving_session is not None:
                            location = (
                                session.query(VanLocation)
                                .filter(VanLocation.session_id == arriving_session.id)
                                .order_by(VanLocation.created_at.desc())
                                .first()
                            )
                            if location is not None:
                                current_distance += _distance_meters(
                                    location.lat,
                                    location.lon,
                                    current_stop.lat,
                                    current_stop.lon,
                                )
                                stop_arrivals_json[route_id] = (
                                    current_distance / AVERAGE_VAN_SPEED_MPS
                                )
                                break
                        stop_index -= 1
                        last_stop = current_stop
                        current_stop = stops[stop_index]
                        current_distance += _distance_meters(
                            last_stop.lat,
                            last_stop.lon,
                            current_stop.lat,
                            current_stop.lon,
                        )
                if stop_arrivals_json:
                    arrivals_json[stop_id] = stop_arrivals_json
    await websocket.close()


@router.post("/routeselect/{van_guid}")  # Called routeselect for backwards compat
async def begin_session(req: Request, van_guid: str) -> HardwareOKResponse:
    body = await req.body()
    route_id = struct.unpack("<i", body)

    with req.app.state.db.session() as session:
        van_tracker_session = (
            session.query(VanTrackerSession).filter_by(van_guid=van_guid).first()
        )
        if van_tracker_session is not None:
            van_tracker_session.dead = True
        new_van_tracker_session = VanTrackerSession(
            van_guid=van_guid, route_id=route_id
        )
        session.add(new_van_tracker_session)
        session.commit()

    return HardwareOKResponse()


@router.post("/location/{van_guid}")
async def post_location(req: Request, van_guid: str) -> HardwareOKResponse:
    with req.app.state.db.session() as session:
        van = session.query(Van).filter_by(guid=van_guid).first()
        if van is None:
            new_van = Van(guid=van_guid)
            session.add(new_van)
            session.commit()

    # byte body: long long for timestamp, double for lat, double for lon
    body = await req.body()
    timestamp_ms, lat, lon = struct.unpack("<Qdd", body)
    timestamp = datetime.fromtimestamp(timestamp_ms / 1000.0, timezone.utc)

    current_time = datetime.now(timezone.utc)

    # Check that the timestamp is not too far in the past. This implies a statistics
    # update that was delayed in transit and may be irrelevant now.
    if current_time - timestamp > timedelta(minutes=1):
        raise HardwareHTTPException(
            status_code=400, error_code=HardwareErrorCode.TIMESTAMP_TOO_FAR_IN_PAST
        )

    # Check that the timestamp is not in the future. This implies a hardware clock
    # malfunction.
    if timestamp > current_time:
        raise HardwareHTTPException(
            status_code=400, error_code=HardwareErrorCode.TIMESTAMP_IN_FUTURE
        )

    now = datetime.now(timezone.utc)
    with req.app.state.db.session() as session:
        tracker_session = (
            session.query(VanTrackerSession)
            .filter(
                VanTrackerSession.van_guid == van_guid,
                VanTrackerSession.dead == False,
                VanTrackerSession.created_at > now - timedelta(seconds=300),
            )
            .first()
        )
        if tracker_session is None:
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.CREATE_NEW_SESSION
            )

        # Add location to session
        new_location = VanLocation(
            session_id=tracker_session.id, timestamp=timestamp, lat=lat, lon=lon
        )
        session.add(new_location)
        session.commit()

        stops = (
            session.query(RouteStop)
            .filter(RouteStop.route_id == tracker_session.route_id)
            .order_by(RouteStop.position)
            .join(Stop, RouteStop.stop_id == Stop.id)
            .all()
        )

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
            .order_by(VanLocation.created_at.desc())
        )
        for i, stop in enumerate(subsequent_stops):
            longest_subset: list[datetime] = []
            current_subset: list[datetime] = []

            # Find the longest consequtive subset (i.e streak) where the distance of the past couple of
            # van locations is consistently within this stop's radius.
            for location in locations:
                stop_distance_meters = _distance_meters(
                    location.lat,
                    location.lon,
                    stop.lat,
                    stop.lon,
                )
                if stop_distance_meters < THRESHOLD_RADIUS_M:
                    current_subset.append(location.timestamp)
                else:
                    if len(current_subset) > len(longest_subset):
                        longest_subset = current_subset
                    current_subset = []
            if len(current_subset) > len(longest_subset):
                longest_subset = current_subset

            if longest_subset:
                # A streak exists, find the overall duration that this van was within the stop's radius. Since locations
                # are ordered from oldest to newest, we can just subtract the first and last timestamps.
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

    return HardwareOKResponse()


THRESHOLD_RADIUS_M = 30.48  # 100 ft
THRESHOLD_TIME = timedelta(seconds=30)
AVERAGE_VAN_SPEED_MPS = 8.9408  # 20 mph

KM_LAT_RATIO = 111.32  # km/degree latitude
EARTH_CIRCUFERENCE_KM = 40075  # km
DEGREES_IN_CIRCLE = 360  # degrees


class Coordinate(BaseModel):
    latitude: float
    longitude: float


def _distance_meters(alat: float, alon: float, blat: float, blon: float) -> float:
    dlat = blat - alat
    dlon = blat - alat

    # Simplified distance calculation that assumes the earth is a sphere. This is good enough for our purposes.
    # https://stackoverflow.com/a/39540339
    dlatkm = dlat * KM_LAT_RATIO
    dlonkm = dlon * EARTH_CIRCUFERENCE_KM * cos(radians(alat)) / DEGREES_IN_CIRCLE

    return sqrt(dlatkm**2 + dlonkm**2) * 1000

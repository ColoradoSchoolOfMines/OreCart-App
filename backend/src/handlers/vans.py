import asyncio
import json
import struct
from datetime import datetime, timedelta, timezone
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
from src.request import process_include
from src.vantracking.coordinate import Coordinate
from src.vantracking.location import Location
from starlette.responses import Response


class VanModel(BaseModel):
    """
    A model for the request body to make a new van or update a van
    """

    route_id: int
    guid: str


class VanLocation(BaseModel):
    """
    A model for the request body to make a new van or update a van
    """

    timestamp: datetime
    latitude: float
    longitude: float


router = APIRouter(prefix="/vans", tags=["vans"])

INCLUDE_LOCATION = "location"
INCLUDES: Set[str] = {
    INCLUDE_LOCATION,
}


@router.get("/")
def get_vans(
    req: Request, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    """
    ## Get all vans.

    **:param include:** Optional list of fields to include. Valid values are:

        - "location": includes the current location of the van

    **:return:** A list of vans in the format

        - id
        - routeId
        - guid
    """
    include_set = process_include(include=include, allowed=INCLUDES)
    with req.app.state.db.session() as session:
        vans: List[Van] = session.query(Van).all()

        resp: List[Dict[str, Optional[Union[int, float, str]]]] = [
            {
                "id": van.id,
                "routeId": van.route_id,
                "guid": van.guid,
            }
            for van in vans
        ]

    if INCLUDE_LOCATION in include_set:
        for van in resp:
            van["location"] = req.app.state.van_locations[van["vanId"]]

    return JSONResponse(content=resp)


@router.get("/{van_id}")
def get_van(
    req: Request, van_id: int, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    """
    ## Get a van by ID.

    **:param van_id:** The unique integer ID of the van to retrieve

    **:param include:** Optional list of fields to include. Valid values are:

        - "location": includes the current location of the van

    **:return:** A van in the format

        - id
        - routeId
    """
    include_set = process_include(include=include, allowed=INCLUDES)
    with req.app.state.db.session() as session:
        van: Van = session.query(Van).filter_by(id=van_id).first()
        if van is None:
            return JSONResponse(content={"message": "Van not found"}, status_code=404)

        resp = {
            "id": van_id,
            "routeId": van.route_id,
        }

    return JSONResponse(content=resp)


@router.get("/location/", response_class=Response)
def get_locations(req: Request):
    """
    ## Get all van locations.

    **:return:** JSON of all van locations, including:

            - timestamp
            - latitude
            - longitude
            - nextStopId
            - secondsToNextStop
    """

    vans = get_all_van_ids(req)
    return JSONResponse(content=get_location_for_vans(req, vans))


@router.websocket("/location/subscribe/")
async def subscribe_locations(websocket: WebSocket) -> None:
    """
    ## Subscribe to all van locations.
    """
    await websocket.accept()

    vans = get_all_van_ids(websocket)
    while True:
        locations_json = get_location_for_vans(websocket, vans)
        await websocket.send_json(locations_json)
        await asyncio.sleep(2)


@router.get("/location/{van_id}")
def get_location(req: Request, van_id: int) -> JSONResponse:
    """
    ## Get the location of a van by ID.

    **:param van_id:** The unique integer ID of the van to retrieve

    **:return:** JSON of the van location, including:

                - timestamp
                - latitude
                - longitude
                - nextStopId
                - secondsToNextStop
    """
    if van_id not in req.app.state.van_locations:
        raise HTTPException(detail="Van not found", status_code=404)

    location_json = get_location_for_van(req, van_id)
    return JSONResponse(content=location_json)


@router.websocket("/location/{van_id}/subscribe")
async def subscribe_location(websocket: WebSocket, van_id: int) -> None:
    if van_id not in websocket.app.state.van_locations:
        raise HTTPException(detail="Van not found", status_code=404)

    await websocket.accept()

    while True:
        location_json = get_location_for_van(websocket, van_id)
        await websocket.send_json(location_json)
        await asyncio.sleep(2)


def get_all_van_ids(req: Union[Request, WebSocket]) -> List[int]:
    with req.app.state.db.session() as session:
        return [van_id for (van_id,) in session.query(Van).with_entities(Van.id).all()]


def get_location_for_vans(
    req: Union[Request, WebSocket], van_ids: List[int]
) -> Dict[int, dict[str, Union[str, int]]]:
    locations_json: Dict[int, dict[str, Union[str, int]]] = {}
    for van_id in van_ids:
        state = req.app.state.van_tracker.get_van(van_id)
        if state is None:
            continue
        locations_json[van_id] = {
            "timestamp": int(state.location.timestamp.timestamp()),
            "latitude": state.location.coordinate.latitude,
            "longitude": state.location.coordinate.longitude,
            "nextStopId": state.next_stop.id,
            "secondsToNextStop": int(state.seconds_to_next_stop.total_seconds()),
        }

    return locations_json


def get_location_for_van(
    req: Union[Request, WebSocket], van_id: int
) -> dict[str, Union[str, int]]:
    state = req.app.state.van_tracker.get_van(van_id)
    if state is None:
        return {}
    return {
        "timestamp": int(state.location.timestamp.timestamp()),
        "latitude": state.location.coordinate.latitude,
        "longitude": state.location.coordinate.longitude,
        "nextStopId": state.next_stop.id,
        "secondsToNextStop": int(state.seconds_to_next_stop.total_seconds()),
    }


@router.post("/routeselect/{van_guid}")
async def post_routeselect(req: Request, van_guid: str) -> HardwareOKResponse:
    """
    ## Select a route for a van.

    **:param van_guid:** The unique str identifier of the van

    **:return:** *Hardware OK* message
    """
    body = await req.body()
    route_id = struct.unpack("<i", body)

    with req.app.state.db.session() as session:
        van = session.query(Van).filter_by(guid=van_guid).first()
        if van is None:
            new_van = Van(guid=van_guid, route_id=route_id)
            session.add(new_van)
            session.commit()
        else:
            van.route_id = route_id
            session.commit()

    return HardwareOKResponse()


@router.post("/location/{van_guid}")
async def post_location(req: Request, van_guid: str) -> HardwareOKResponse:
    """
    ## Update the location of a van.

    **:param van_guid:** The unique str identifier of the van

    **:return:** *Hardware OK* message
    """
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

    # Check that the timestamp is the most recent one for the van. This prevents
    # updates from being sent out of order.
    with req.app.state.db.session() as session:
        van = session.query(Van).filter_by(guid=van_guid).first()
        van_state = req.app.state.van_tracker.get_van(van.id)
        if van_state is not None and timestamp < van_state.location.timestamp:
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.TIMESTAMP_NOT_MOST_RECENT
            )

        # The van may be starting up for the first time, in which we need to initialize it's
        # cache entry and stop list. It's better to do this once rather than coupling it with
        # push_location due to the very expensive stop query we have to do.
        if van.id not in req.app.state.van_tracker:
            with req.app.state.db.session() as session:
                # Need to find the likely list of stops this van will go on. It's assumed that
                # this will only change between van activations, so we can query once and then
                # cache this list.
                stops = (
                    session.query(Stop)
                    .join(RouteStop, Stop.id == RouteStop.stop_id)
                    # Make sure all stops will be in order since that's critical for the time estimate
                    .order_by(RouteStop.position)
                    .join(Van, Van.route_id == RouteStop.route_id)
                    .filter(Van.guid == van_guid)
                    # Ignore inactive stops we won't be going to and thus don't need to estimate times for
                    .filter(Stop.active == True)
                    .all()
                )

                if not stops:
                    # No stops implies a van that does not exist
                    raise HardwareHTTPException(
                        status_code=400, error_code=HardwareErrorCode.VAN_DOESNT_EXIST
                    )

                req.app.state.van_tracker.init_van(van.id, stops)

    with req.app.state.db.session() as session:
        van = session.query(Van).filter_by(guid=van_guid).first()
        if van is None:
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.VAN_DOESNT_EXIST
            )

        # Update the van's location
        req.app.state.van_tracker.push_location(
            van.id,
            Location(
                timestamp=timestamp, coordinate=Coordinate(latitude=lat, longitude=lon)
            ),
        )

    return HardwareOKResponse()

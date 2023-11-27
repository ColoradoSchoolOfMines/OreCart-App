import struct
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Set, Union

from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.analytics import Analytics
from src.model.van import Van
from src.request import process_include


class VanModel(BaseModel):
    """
    A model for the request body to make a new van or update a van
    """

    route_id: int
    wheelchair: bool


router = APIRouter(prefix="/vans", tags=["vans"])

INCLUDE_LOCATION = "location"
INCLUDES: Set[str] = {
    INCLUDE_LOCATION,
}


@router.get("/")
def get_vans(
    req: Request, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    include_set = process_include(include=include, allowed=INCLUDES)
    with req.app.state.db.session() as session:
        vans: List[Van] = session.query(Van).all()

        resp: Dict[str, List[Dict[str, Optional[Union[int, float, bool]]]]] = {
            "vans": [
                {
                    "vanId": van.id,
                    "routeId": van.route_id,
                    "wheelchair": van.wheelchair,
                }
                for van in vans
            ]
        }

    if INCLUDE_LOCATION in include_set:
        for van in resp["vans"]:
            if van["vanId"] in req.app.state.van_locations:
                lat, lon, timestamp = req.app.state.van_locations[van["vanId"]]
                van["lat"] = lat
                van["lon"] = lon
                van["timestamp"] = timestamp
            else:
                van["lat"] = None
                van["lon"] = None
                van["timestamp"] = None

    return JSONResponse(content=resp)


@router.get("/{van_id}")
def get_van(
    req: Request, van_id: int, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    include_set = process_include(include=include, allowed=INCLUDES)
    with req.app.state.db.session() as session:
        van: Van = session.query(Van).filter_by(id=van_id).first()
        if van is None:
            return JSONResponse(content={"message": "Van not found"}, status_code=404)

        resp = {
            "vanId": van_id,
            "routeId": van.route_id,
            "wheelchair": van.wheelchair,
        }

    return JSONResponse(content=resp)


@router.post("/")
def post_van(req: Request, van_model: VanModel) -> JSONResponse:
    with req.app.state.db.session() as session:
        van = Van(route_id=van_model.route_id, wheelchair=van_model.wheelchair)

        session.add(van)
        session.commit()

    return JSONResponse(content={"message": "OK"})


@router.put("/{van_id}")
def put_van(req: Request, van_id: int, van_model: VanModel) -> JSONResponse:
    with req.app.state.db.session() as session:
        van: Van = session.query(Van).filter_by(id=van_id).first()
        if van is None:
            return JSONResponse(content={"message": "Van not found"}, status_code=404)

        van.route_id = van_model.route_id
        van.wheelchair = van_model.wheelchair

        session.commit()

    return JSONResponse(content={"message": "OK"})


@router.delete("/{van_id}")
def delete_van(req: Request, van_id: int) -> JSONResponse:
    with req.app.state.db.session() as session:
        van: Van = session.query(Van).filter_by(id=van_id).first()
        if van is None:
            return JSONResponse(content={"message": "Van not found"}, status_code=404)
        session.query(Van).filter_by(id=van_id).delete()

    return JSONResponse(content={"message": "OK"})


@router.post("/location/{van_id}")
async def post_location(req: Request, van_id: int) -> HardwareOKResponse:
    # byte body: long for timestamp, double for lat, double for lon
    body = await req.body()
    timestamp, entered, exited, lat, lon = struct.unpack("!ldd", body)
    timestamp = datetime.fromtimestamp(timestamp, timezone.utc)

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

    req.app.state.van_locations[van_id] = (lat, lon, timestamp)

    return HardwareOKResponse()


@router.get("/location/{van_id}")
def get_location(req: Request, van_id: int) -> JSONResponse:
    if van_id not in req.app.state.van_locations:
        return JSONResponse(content={"message": "Van not found"}, status_code=404)

    lat, lon, timestamp = req.app.state.van_locations[van_id]

    return JSONResponse(content={"lat": lat, "lon": lon, "timestamp": timestamp})

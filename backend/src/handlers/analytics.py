"""
Routes for tracking ridership statistics.
"""

import struct
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Union

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, model_validator
from sqlalchemy.sql import ColumnElement
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.ridership_analytics import RidershipAnalytics
from src.model.van_tracker_session import VanTrackerSession

router = APIRouter(prefix="/analytics", tags=["analytics", "ridership"])


class RidershipFilterModel(BaseModel):
    start_timestamp: Optional[int] = None
    end_timestamp: Optional[int] = None
    route_id: Optional[int]
    session_id: Optional[int]

    @model_validator(mode="after")
    def check_dates(self):
        if self.end_timestamp is not None and self.start_timestamp is not None:
            if self.end_timestamp <= self.start_timestamp:
                raise ValueError("End timestamp must be after start timestamp")
        return self

    @property
    def start_date(self) -> Optional[datetime]:
        if self.start_timestamp is not None:
            return datetime.fromtimestamp(self.start_timestamp, timezone.utc)
        return None

    @property
    def end_date(self) -> Optional[datetime]:
        if self.end_timestamp is not None:
            return datetime.fromtimestamp(self.end_timestamp, timezone.utc)
        return None

    @property
    def filters(self) -> Optional[List[ColumnElement[bool]]]:
        t_filters = []
        if self.start_date is not None:
            t_filters.append(RidershipAnalytics.datetime >= self.start_date)
        if self.end_date is not None:
            t_filters.append(RidershipAnalytics.datetime <= self.end_date)
        if self.route_id is not None:
            t_filters.append(RidershipAnalytics.route_id == self.route_id)
        if self.session_id is not None:
            t_filters.append(RidershipAnalytics.session_id == self.session_id)
        if len(t_filters) == 0:
            return None
        return t_filters


@router.get("/ridership/")
def get_ridership(
    req: Request, filters: Optional[RidershipFilterModel]
) -> List[Dict[str, Union[str, int, float]]]:
    with req.app.state.db.session() as session:
        analytics: List[RidershipAnalytics] = []
        if filters is None or filters.filters is None:
            analytics = session.query(RidershipAnalytics).all()
        else:
            analytics = session.query(RidershipAnalytics).filter(*filters.filters).all()

    # convert analytics to json
    analytics_json: List[Dict[str, Union[str, int, float]]] = []
    for analytic in analytics:
        analytics_json.append(
            {
                "sessionId": analytic.session_id,
                "routeId": analytic.route_id,
                "entered": analytic.entered,
                "exited": analytic.exited,
                "lat": analytic.lat,
                "lon": analytic.lon,
                "datetime": int(analytic.datetime.timestamp()),
            }
        )

    return analytics_json


@router.post("/ridership/{van_guid}")
async def post_ridership_stats(req: Request, van_guid: int):
    """
    ## Upload ridership stats <br>
    This route is used by the hardware components to send ridership statistics to be
    logged in the database. The body of the request is a packed byte array containing
    the following values in order:

        - timestamp of time when response was sent (64-bit milliseconds since epoch)
        - entered (8-bit, number of people who entered the van at a given stop)
        - exited (8-bit, number of people who exited the van at the stop)
        - lat (double-precision float, current latitude of the van at the stop)
        - lon (double-precision float, current longitude of the van at the stop)
    """

    # Unpack the byte body sent by the hardware into their corresponding values
    body = await req.body()
    timestamp_ms, entered, exited, lat, lon = struct.unpack("<Qbbdd", body)
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
        # Find the route that the van is currently on, required by the ridership database.
        # If there is no route, then the van does not exist or is not running.
        tracker_session = session.query(VanTrackerSession).filter(
            VanTrackerSession.van_guid == van_guid,
            VanTrackerSession.dead == False,
            now - VanTrackerSession.created_at < timedelta(hours=12),
        )
        if not tracker_session:
            raise HardwareHTTPException(
                status_code=404, error_code=HardwareErrorCode.VAN_NOT_ACTIVE
            )

        # Check that the timestamp is the most recent one for the van. This prevents
        # updates from being sent out of order, which could mess up the statistics.
        most_recent = (
            session.query(RidershipAnalytics)
            .filter_by(session_id=tracker_session.id)
            .order_by(RidershipAnalytics.datetime.desc())
            .first()
        )
        if most_recent is not None and timestamp <= most_recent.datetime:
            raise HardwareHTTPException(
                status_code=400, error_code=HardwareErrorCode.TIMESTAMP_NOT_MOST_RECENT
            )

        # Finally commit the ridership statistics to the database.
        new_ridership = RidershipAnalytics(
            session_id=tracker_session.id,
            route_id=tracker_session.route_id,
            entered=entered,
            exited=exited,
            lat=lat,
            lon=lon,
            datetime=timestamp,
        )
        session.add(new_ridership)
        session.commit()

    return HardwareOKResponse()

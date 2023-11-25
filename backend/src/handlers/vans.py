from typing import Dict, List, Union

from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
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

ANALYTICS_RIDERSHIP = "analytics-ridership"
INCLUDES = {ANALYTICS_RIDERSHIP}


@router.get("/")
def get_vans(
    req: Request, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    include_set = process_include(include=include, allowed=INCLUDES)
    with req.app.state.db.session() as session:
        vans: List[Van] = session.query(Van).all()

        resp = {
            "vans": [
                {
                    "van_id": van.id,
                    "route_id": van.route_id,
                    "wheelchair": van.wheelchair,
                }
                for van in vans
            ]
        }

        if ANALYTICS_RIDERSHIP in include_set:
            analytics: List[Analytics] = session.query(Analytics).all()
            analytics = list(
                map(
                    lambda analytic: {
                        "id": analytic.id,
                        "van_id": analytic.van_id,
                        "route_id": analytic.route_id,
                        "entered": analytic.entered,
                        "exited": analytic.exited,
                        "lat": analytic.lat,
                        "lon": analytic.lon,
                        "datetime": str(analytic.datetime),
                    },
                    analytics,
                )
            )
            for van in resp["vans"]:
                van["analytics-ridership"] = list(
                    filter(analytics, lambda analytic: analytic.van_id == van.id)
                )

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
            "van_id": van_id,
            "route_id": van.route_id,
            "wheelchair": van.wheelchair,
        }

        if ANALYTICS_RIDERSHIP in include_set:
            analytics: List[Analytics] = (
                session.query(Analytics).filter_by(van_id=van.id).all()
            )
            analytics = list(
                map(
                    lambda analytic: {
                        "id": analytic.id,
                        "van_id": analytic.van_id,
                        "route_id": analytic.route_id,
                        "entered": analytic.entered,
                        "exited": analytic.exited,
                        "lat": analytic.lat,
                        "lon": analytic.lon,
                        "datetime": str(analytic.datetime),
                    },
                    analytics,
                )
            )
            resp["analytics"] = analytics

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

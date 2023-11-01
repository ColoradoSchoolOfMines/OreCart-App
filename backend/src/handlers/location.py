from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.orm import Request

router = APIRouter(prefix="/location", tags=["location"])


class VanLocation(BaseModel):
    lat: float
    lon: float
    van_id: int
    timestamp: int


@router.get("/{van_id}")
def get_van_location(req: Request, van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    # get engine from app state
    engine = req.app.state.engine

    return VanLocation(lat=0.0, lon=0.0, van_id=van_id, timestamp=0)


@router.post("/{van_id}")
def post_van_location(req: Request, van_id: int, van_location: VanLocation):
    # update van location in database

    # get engine from app state
    engine = req.app.state.engine

    return {"message": "Location updated successfully."}

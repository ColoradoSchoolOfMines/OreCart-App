from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(
    prefix="/location",
    tags=["location"]
)

class VanLocation(BaseModel):
    lat: float
    lon: float
    van_id: int
    timestamp: int


@router.get("/{van_id}")
def get_van_location(van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    return VanLocation(lat=0.0, lon=0.0, van_id=van_id, timestamp=0)


@router.post("/{van_id}")
def post_van_location(van_id: int, van_location: VanLocation):
    # update van location in database

    return {"message": "Location updated successfully."}

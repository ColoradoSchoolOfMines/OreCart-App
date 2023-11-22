from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(prefix="/location", tags=["location"])


class VanLocation(BaseModel):
    lat: float
    lon: float
    van_id: int
    timestamp: int


@router.get("/{van_id}")
def get_van_location(req: Request, van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    with req.app.state.db.session() as session:
        # get van location from database
        pass

    return VanLocation(lat=0.0, lon=0.0, van_id=van_id, timestamp=0)


@router.post("/{van_id}")
def post_van_location(req: Request, van_id: int, van_location: VanLocation):
    # update van location in database

    with req.app.state.db.session() as session:
        # update van location in database
        pass

    return {"message": "Location updated successfully."}

from datetime import datetime, timezone
from typing import Annotated, Dict, List, Union

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel
from src.model.ada_request import ADARequest
from src.model.pickup_spot import PickupSpot
from src.request import process_include

router = APIRouter(prefix="/ada", tags=["ada"])

FIELD_PICKUP_SPOTS = "pickup_spot"
INCLUDES = {FIELD_PICKUP_SPOTS}


class PickupSpotModel(BaseModel):
    name: str


@router.get("/pickup_spots")
def get_pickup_spots(req: Request) -> List[Dict[str, Union[str, int, float]]]:
    with req.app.state.db.session() as session:
        pickup_spots = session.query(PickupSpot).all()
        pickup_spots_json: List[Dict[str, Union[str, int, float]]] = []
        for spot in pickup_spots:
            spot_json = {
                "id": spot.id,
                "name": spot.name,
                "latitude": spot.lat,
                "longitude": spot.lon,
            }
            pickup_spots_json.append(spot_json)

        return pickup_spots_json


@router.post("/pickup_spots")
def post_pickup_spot(spot: PickupSpotModel, req: Request):
    new_spot = PickupSpot(name=spot.name)

    with req.app.state.db.session() as session:
        session.add(new_spot)
        session.commit()

    return {"message": "OK"}


@router.put("/pickup_spots/{id}")
def update_pickup_spot(id: int, spot: PickupSpotModel, req: Request):
    with req.app.state.db.session() as session:
        pickup_spot = session.query(PickupSpot).filter(PickupSpot.id == id).first()

        if pickup_spot is None:
            raise HTTPException(status_code=404, detail="Pickup spot not found")

        pickup_spot.name = spot.name
        session.commit()

    return {"message": "OK"}


@router.delete("/pickup_spots/{id}")
def delete_pickup_spot(id: int, req: Request):
    with req.app.state.db.session() as session:
        pickup_spot = session.query(PickupSpot).filter(PickupSpot.id == id).first()

        if pickup_spot is None:
            raise HTTPException(status_code=404, detail="Pickup spot not found")

        session.query(PickupSpot).filter(PickupSpot.id == id).delete()
        session.commit()

    return {"message": "OK"}


class ADARequestModel(BaseModel):
    pickup_spot_id: int
    pickup_time: int
    wheelchair: bool


@router.get("/requests")
def get_ada_requests(
    req: Request,
    filter: str = Query("future"),
    include: Annotated[list[str] | None, Query()] = None,
):
    now = datetime.now(timezone.utc)
    include_set = process_include(include, INCLUDES)
    with req.app.state.db.session() as session:
        if filter == "today":
            end_of_day = datetime.now(timezone.utc).replace(
                hour=23, minute=59, second=59
            )
            ada_requests = session.query(ADARequest).filter(
                ADARequest.created_at >= now, ADARequest.created_at <= end_of_day
            )
        elif filter == "future":
            ada_requests = session.query(ADARequest).filter(
                ADARequest.created_at >= now
            )
        else:
            raise HTTPException(status_code=400, detail=f"Invalid filter {filter}")

        ada_requests = ada_requests.order_by(ADARequest.created_at).all()

        result = []
        for request in ada_requests:
            request_json = {
                "id": request.id,
                "pickup_time": int(request.created_at.timestamp()),
                "wheelchair": request.wheelchair,
            }
            if FIELD_PICKUP_SPOTS in include_set:
                spot = (
                    session.query(PickupSpot)
                    .filter(PickupSpot.id == request.pickup_spot)
                    .first()
                )
                request_json[FIELD_PICKUP_SPOTS] = {
                    "id": spot.id,
                    "name": spot.name,
                    "latitude": spot.lat,
                    "longitude": spot.lon,
                }
            result.append(request_json)

        return result


@router.post("/requests")
def create_ada_request(
    req: Request, ada_request_model: ADARequestModel
) -> dict[str, str]:
    pickup_time = datetime.fromtimestamp(ada_request_model.pickup_time, timezone.utc)
    # Make sure that the pickup time is in the future
    if pickup_time <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Pickup time must be in the future")

    with req.app.state.db.session() as session:
        pickup_spot = (
            session.query(PickupSpot)
            .filter(PickupSpot.id == ada_request_model.pickup_spot_id)
            .count()
        )
        if not pickup_spot:
            raise HTTPException(status_code=400, detail="Pickup spot not found")

        pickup_spot = ADARequest(
            pickup_spot=ada_request_model.pickup_spot_id,
            wheelchair=ada_request_model.wheelchair,
            created_at=pickup_time,
        )
        session.add(pickup_spot)
        session.commit()

    return {"message": "OK"}

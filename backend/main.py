from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class VanLocation(BaseModel):
    lat: float
    long: float
    van_id: int
    timestamp: int


@app.get("/location/van_id}")
def get_van_location(van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    return VanLocation(lat=0.0, long=0.0, van_id=van_id, timestamp=0)

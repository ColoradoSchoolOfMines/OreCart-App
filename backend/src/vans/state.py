
from datetime import datetime
from pydantic import BaseModel

class Coordinate(BaseModel):
    latitude: float
    longitude: float

class Location(BaseModel):
    timestamp: datetime
    coordinate: Coordinate
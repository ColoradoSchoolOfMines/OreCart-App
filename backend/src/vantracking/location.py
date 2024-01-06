from datetime import datetime

from pydantic import BaseModel

from src.vantracking.coordinate import Coordinate

class Location(BaseModel):
    timestamp: datetime
    coordinate: Coordinate

import math
from pydantic import BaseModel
from typing_extensions import Self


class MeterCoordinate(BaseModel):
    x: float
    y: float

class GeoCoordinate(BaseModel):
    latitude: float
    longitude: float

from abc import ABC, abstractmethod
from datetime import datetime

from pydantic import BaseModel

from src.model.stop import Stop
from src.vans.state import Location, Coordinate

from typing import Iterable, Optional

class CachedVanState(BaseModel):
    locations: Iterable[Location]
    stops: list[Stop]
    current_stop_index: int
    
class VanStateCache(ABC):
    @abstractmethod
    def has_van_state(self, van_id: int) -> bool:
        pass

    @abstractmethod
    def get_van_state(self, van_id: int) -> Optional[CachedVanState]:
        pass

    @abstractmethod
    def new_van_state(self, van_id: int, stops: list[Stop]):
        pass

    @abstractmethod
    def set_current_stop(self, van_id: int, index: int):
        pass

    @abstractmethod
    def push_location(self, van_id: int, coordinate: Coordinate):
        pass

from abc import ABC, abstractmethod
from datetime import datetime

from src.model.stop import Stop
from src.vans.state import Location, Coordinate

from typing import Iterable, Optional

class VanStateCache(ABC):
    @abstractmethod
    def __contains__(self, van_id: int):
        pass

    @abstractmethod
    def add(self, van_id: int, stops: list[Stop]):
        pass

    @abstractmethod
    def get_locations(self, van_id: int) -> list[Location]:
        pass

    @abstractmethod
    def push_location(self, van_id: int, location: Location):
        pass

    @abstractmethod
    def get_stops(self, van_id: int) -> list[Stop]:
        pass

    @abstractmethod
    def get_current_stop_index(self, van_id: int) -> Optional[int]:
        pass

    @abstractmethod
    def set_current_stop_index(self, van_id: int, index: int):
        pass

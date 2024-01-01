from abc import ABC, abstractmethod
from datetime import datetime
from typing import Iterable, Optional

from src.model.stop import Stop
from src.vans.state import Coordinate, Location


class VanStateCache(ABC):
    @abstractmethod
    def __contains__(self, van_id: int):
        pass

    @abstractmethod
    def add(self, van_id: int, stops: list[Stop]):
        """
        Add a new van state to the cache tied to the van ID. The stop list will be used for time
        estimates, so it should be in the exact order the van will visit each stop. The van state
        must be consistently updated or it will be removed from the cache.
        """

    @abstractmethod
    def get_locations(self, van_id: int) -> list[Location]:
        """
        Get the current location list tied to the van ID (if it exists). The location list will be
        ordered from oldest to newest location.
        """

    @abstractmethod
    def push_location(self, van_id: int, location: Location):
        """
        Push a new location to the van state tied to the van ID (if it exists). This will extend the
        lifespan of the van state in the cache.
        """

    @abstractmethod
    def get_stops(self, van_id: int) -> list[Stop]:
        """
        Get the current stop list tied to the van ID (if it exists).
        """

    @abstractmethod
    def get_current_stop_index(self, van_id: int) -> Optional[int]:
        """
        Get the current stop of the van state (as the index of the van state's stop list) tied to
        the van ID (if it exists).
        """

    @abstractmethod
    def set_current_stop_index(self, van_id: int, index: int):
        """
        Update the current stop of the van state (as the index of the van state's stop list) tied to
        the van ID (if it exists). This will extend the lifespan of the van state in the cache.
        """

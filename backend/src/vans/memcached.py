from typing import Optional

from src.model.stop import Stop
from src.vans.cache import CachedVanState, Coordinate, VanStateCache


class MemcachedVanStateCache(VanStateCache):
    def __init__(self, config={}):
        raise NotImplementedError

    def has_van_state(self, van_id: int) -> bool:
        raise NotImplementedError

    def get_van_state(self, van_id: int) -> Optional[CachedVanState]:
        raise NotImplementedError

    def new_van_state(self, van_id: int, stops: list[Stop]):
        raise NotImplementedError

    def set_current_stop(self, van_id: int, index: int):
        raise NotImplementedError

    def push_location(self, van_id: int, coordinate: Coordinate):
        raise NotImplementedError

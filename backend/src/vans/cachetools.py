from collections import deque
from datetime import datetime, timedelta, timezone
from typing import Optional

from cachetools import FIFOCache

from src.model.stop import Stop
from src.vans.cache import Coordinate, VanStateCache
from src.vans.state import Location

import time

class TTL:
    def __init__(self, timestamp: float, value: any):
        self.timestamp = timestamp
        self.value = value

    def refresh(self):
        self.timestamp = time.monotonic()

    def expired(self, ttl: int):
        return self.timestamp < time.monotonic() - ttl
    
class TTLQueue:
    def __init__(self, ttl: int):
        self.ttl = ttl
        self.queue = deque()

    def __contains__(self, key):
        for item in self.queue:
            if not item.expired(self.ttl) and item.value == key:
                return True
        return False

    def __iter__(self):
        return map(lambda item: item.value, filter(lambda item: not item.expired(self.ttl), self.queue))

    def push(self, value):
        self.__expire()
        self.queue.appendleft(TTL(timestamp=time.monotonic(), value=value))

    def __expire(self):
        while self.queue:
            item = self.queue[0]
            if item.expired(self.ttl):
                self.queue.popleft()
            else:
                break

class CachedVanState:
    def __init__(self, locations: TTLQueue, stops: list[Stop], current_stop_index: int):
        self.locations = locations
        self.stops = stops
        self.current_stop_index = current_stop_index

class CachetoolsVanStateCache(VanStateCache):
    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300
        self.ttl = int(config["ttl"])
        self.cache = FIFOCache(maxsize=int(config["maxsize"]))

    def __contains__(self, van_id: int):
        return van_id in self.cache

    def add(self, van_id: int, stops: list[Stop]):
        self.__expire()
        self.cache[van_id] = TTL(
            timestamp=time.monotonic(),
            value=CachedVanState(
                locations=TTLQueue(ttl=self.ttl),
                stops=stops,
                current_stop_index=-1,
            )
        )

    def get_locations(self, van_id: int) -> list[Location]:
        entry = self.cache.get(van_id)
        if entry is None:
            return []
        return list(iter(entry.value.locations))

    def push_location(self, van_id: int, location: Location):
        self.__expire()
        entry = self.cache[van_id]
        if entry is None:
            return
        entry.value.locations.push(location)
        entry.refresh()

    def get_stops(self, van_id: int) -> list[Stop]:
        entry = self.cache.get(van_id)
        if entry is None:
            return []
        return entry.value.stops

    def get_current_stop_index(self, van_id: int) -> Optional[int]:
        entry = self.cache.get(van_id)
        if entry is None:
            return None
        return entry.value.current_stop_index

    def set_current_stop_index(self, van_id: int, index: int):
        self.__expire()
        entry = self.cache[van_id]
        if entry is None:
            return
        entry.value.current_stop_index = index
        entry.refresh()

    def __expire(self):
        for van_id, state in self.cache.items():
            if state.expired(self.ttl):
                del self.cache[van_id]

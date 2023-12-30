from collections import deque
from datetime import datetime, timedelta, timezone
from typing import Optional

from cachetools import FIFOCache

from src.model.stop import Stop
from src.vans.cache import CachedVanState, Coordinate, Location, VanStateCache


class CachetoolsVanStateCache(VanStateCache):
    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300
        self.ttl = timedelta(seconds=config["ttl"])
        self.cache = FIFOCache(maxsize=config["maxsize"])

    def has_van_state(self, van_id: int) -> bool:
        return van_id in self.cache

    def get_van_state(self, van_id: int) -> Optional[CachedVanState]:
        return self.cache.get(van_id)

    def new_van_state(self, van_id: int, stops: list[Stop]):
        self.cache[van_id] = CachedVanState(
            locations=TTLQueue(ttl=self.ttl),
            stops=stops,
            current_stop_index=-1,
        )

    def set_current_stop(self, van_id: int, index: int):
        self.cache[van_id].current_stop_index = index

    def push_location(self, van_id: int, coordinate: Coordinate):
        self.cache[van_id].locations.push(coordinate=coordinate)


class TTLQueue:
    def __init__(self, ttl: timedelta):
        self.ttl = ttl
        self.queue = deque()

    def __contains__(self, key):
        self.__expire()
        return key in (v for _, v in self.queue)

    def __iter__(self):
        self.__expire()
        return iter(self.queue)

    def push(self, value):
        self.__expire()
        self.queue.append((datetime.now(timezone.utc), value))

    def __expire(self):
        current_time = datetime.now(timezone.utc)
        while self.queue:
            t, _ = self.queue[0]
            if current_time - t > self.ttl:
                self.queue.popleft()
            else:
                break

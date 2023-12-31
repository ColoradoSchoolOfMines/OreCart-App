from collections import deque
from datetime import datetime, timedelta, timezone
from typing import Optional

from cachetools import FIFOCache

from src.model.stop import Stop
from src.vans.cache import CachedVanState, Coordinate, VanStateCache

import time

from pydantic import BaseModel

class TTLCachedVanState(BaseModel):
    state: CachedVanState
    timestamp: int


class CachetoolsVanStateCache(VanStateCache):
    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300
        self.ttl = config["ttl"]
        self.cache = FIFOCache(maxsize=config["maxsize"])

    def has_van_state(self, van_id: int) -> bool:
        return self.get_van_state(van_id) is not None

    def get_van_state(self, van_id: int) -> Optional[CachedVanState]:
        state = self.cache.get(van_id)
        if state is None or state.timestamp < time.monotonic() - self.ttl:
            return None
        return state.state

    def new_van_state(self, van_id: int, stops: list[Stop]):
        self.__expire()
        self.cache[van_id] = TTLCachedVanState(
            state=CachedVanState(
                locations=TTLQueue(ttl=self.ttl),
                stops=stops,
                current_stop_index=-1,
            ),
            timestamp=time.monotonic(),
        )

    def set_current_stop(self, van_id: int, index: int):
        self.__expire()
        state = self.cache[van_id]
        if state is None:
            return
        state.state.current_stop_index = index
        state.timestamp = time.monotonic()

    def push_location(self, van_id: int, coordinate: Coordinate):
        self.__expire()
        state = self.cache[van_id]
        if state is None:
            return
        state.state.locations.push(coordinate=coordinate)
        state.timestamp = time.monotonic()

    def __expire(self):
        for van_id, state in self.cache.items():
            if state.timestamp < time.monotonic() - self.ttl:
                del self.cache[van_id]


class TTLQueue:
    def __init__(self, ttl: int):
        self.ttl = ttl
        self.queue = deque()

    def __contains__(self, key):
        for t, v in self.queue:
            if v == key and t > time.monotonic() - self.ttl:
                return True

        return key in (v for _, v in self.queue)

    def __iter__(self):
        return filter(lambda x: x[0] > time.monotonic() - self.ttl, self.queue)

    def push(self, value):
        self.__expire()
        self.queue.append((time.monotonic(), value))

    def __expire(self):
        current_time = time.monotonic()
        while self.queue:
            t, _ = self.queue[0]
            if current_time - t > self.ttl:
                self.queue.popleft()
            else:
                break

import time
from collections import deque
from typing import Any, Optional

from cachetools import FIFOCache
from src.model.stop import Stop
from src.vans.cache import VanStateCache
from src.vans.state import Location


class TTL:
    """
    Generic wrapper around a time-to-live (TTL) value that will expire after a certain amount of time
    defined by the class containing an instance of this.
    """

    def __init__(self, value: Any):
        # It's best to use monotonic time for this to avoid accidentally expiring items due to
        # system clock changes.
        self.timestamp = time.monotonic()
        self.value = value

    def refresh(self):
        """
        Renews the lifespan of this item with a new timestamp.
        """
        self.timestamp = time.monotonic()

    def expired(self, ttl: int):
        """
        Returns whether this item has expired based on the TTL value specified.
        """
        return self.timestamp < time.monotonic() - ttl


class TTLQueue:
    """
    A queue-like data structure with time-to-live (TTL) functionality. Items are appended to the front, and
    then popped from the back when they are older than the TTL value specified. Note that the removal of the
    items only occurs when new items are added, but otherwise any view of the queue will only show items that
    have not been expired.
    """

    def __init__(self, ttl: int):
        self.ttl = ttl
        self.queue: deque = deque()

    def __contains__(self, key):
        for item in self.queue:
            if not item.expired(self.ttl) and item.value == key:
                return True
        return False

    def __iter__(self):
        return map(
            lambda item: item.value,
            filter(lambda item: not item.expired(self.ttl), self.queue),
        )

    def push(self, value: Any):
        """
        Pushes a new item to the front of the queue while removing any expired items from the back of the
        queue.
        """
        self.__expire()
        self.queue.append(TTL(value))

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
    """
    A van state cache implementation that uses the cachetools library and some custom caches
    to implement the required functionality.
    """

    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300
        self.ttl = int(config["ttl"])
        # TTLCache cannot be used since it only renews items when they are reassigned. We as a
        # result only want to guard against the cache being too full, hence the usage of a more
        # basic FIFO cache.
        self.cache = FIFOCache(maxsize=int(config["maxsize"]))

    def __contains__(self, van_id: int):
        return van_id in self.cache

    def add(self, van_id: int, stops: list[Stop]):
        # Remove van states that haven't been updated in a while while we can safely mutate
        # the cache.
        self.__expire()
        self.cache[van_id] = TTL(
            CachedVanState(
                locations=TTLQueue(ttl=self.ttl),
                stops=stops,
                current_stop_index=-1,
            )
        )

    def get_locations(self, van_id: int) -> list[Location]:
        entry = self.cache.get(van_id)
        if entry is None:
            raise KeyError("Van state does not exist")
        # We aren't working with a location list, must convert it first.
        return list(iter(entry.value.locations))

    def push_location(self, van_id: int, location: Location):
        # Remove van states that haven't been updated in a while while we can safely mutate
        # the cache.
        self.__expire()
        entry = self.cache[van_id]
        if entry is None:
            raise KeyError("Van state does not exist")
        entry.value.locations.push(location)
        # This van state is still being updated by something, so we should extend its lifespan.
        entry.refresh()

    def get_stops(self, van_id: int) -> list[Stop]:
        entry = self.cache.get(van_id)
        if entry is None:
            raise KeyError("Van state does not exist")
        return entry.value.stops

    def get_current_stop_index(self, van_id: int) -> int:
        entry = self.cache.get(van_id)
        if entry is None:
            raise KeyError("Van state does not exist")
        return entry.value.current_stop_index

    def set_current_stop_index(self, van_id: int, index: int):
        # Remove van states that haven't been updated in a while while we can safely mutate
        # the cache.
        self.__expire()
        entry = self.cache[van_id]
        if entry is None:
            raise KeyError("Van state does not exist")
        entry.value.current_stop_index = index
        # This van state is still being updated by something, so we should extend its lifespan.
        entry.refresh()

    def __expire(self):
        for van_id, state in self.cache.items():
            if state.expired(self.ttl):
                del self.cache[van_id]

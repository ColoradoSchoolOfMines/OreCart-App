import os
from datetime import datetime, timedelta
from math import radians, sqrt
from typing import Optional

from pydantic import BaseModel

from src.model.stop import Stop
from src.vans.cache import VanStateCache
from src.vans.cachetools import CachetoolsVanStateCache
from src.vans.memcached import MemcachedVanStateCache
from src.vans.state import Coordinate, Location

THRESHOLD_RADIUS_M = 1000
THRESHOLD_TIME = timedelta(minutes=2)
AVERAGE_VAN_SPEED_MPS = 8.9408  # 20 mph


class VanState(BaseModel):
    location: Location
    stop: Stop
    time_to: timedelta


def distance_m(a: Coordinate, b: Coordinate) -> float:
    """
    Calculate the Euclidean distance in meters between two points
    on the earth (specified in decimal degrees)
    """
    # Earth’s radius, sphere
    EARTH_RADIUS = 6371

    # distances
    dlat = radians(b.latitude - a.latitude)
    dlon = radians(b.longitude - a.longitude)

    # convert to meters
    return sqrt(dlat**2 + dlon**2) * EARTH_RADIUS * 1000


class VanManager:
    def __init__(self, cache: VanStateCache):
        self.cache = cache

    def init_van(self, van_id: int, stops: list[Stop]):
        self.cache.add_van(van_id, stops)

    def aware_of(self, van_id: int) -> bool:
        self.cache.has_van(van_id)

    def get_van(self, van_id: int) -> Optional[VanState]:
        state = self.cache.get_van_state(van_id)
        if state is None:
            return None
        latest_location = next(state.locations)
        if latest_location is None:
            return None
        next_stop = state.stops[(state.current_stop_index + 1) % len(state.stops)]
        distance = distance_m(latest_location, next_stop.location)
        time_to = timedelta(seconds=distance / AVERAGE_VAN_SPEED_MPS)
        return VanState(location=latest_location, stop=next_stop, time_to=time_to)

    def push_location(self, van_id: int, location: Coordinate):
        state = self.cache.get_van_state(van_id)
        if state is None:
            return
        self.cache.push_location(van_id, location)
        subsequent_stops = state.stop[state.current_stop_index + 1 :]
        for i, stop in enumerate(subsequent_stops):
            distances = [
                (time, distance_m(location, stop.location))
                for time, location in state.locations
            ]
            longest_subset_time_delta = self.__get_longest_subset_time_delta(distances)
            if longest_subset_time_delta >= THRESHOLD_TIME:
                state.current_stop_index = i
                break

    def __get_longest_subset_time_delta(self, distances: list[tuple[datetime, float]]):
        longest_subset = []
        current_subset = []
        for t, distance in distances:
            if distance < THRESHOLD_RADIUS_M:
                current_subset.append(t)
            else:
                if len(current_subset) > len(longest_subset):
                    longest_subset = current_subset
                current_subset = []
        if len(current_subset) > len(longest_subset):
            longest_subset = current_subset
        if longest_subset:
            return longest_subset[-1] - longest_subset[0]
        else:
            return 0

def van_manager():
    config = {}
    for key in os.environ:
        if key.startswith("CACHE_"):
            config[key[6:].lower()] = os.environ[key]

    if "type" not in config:
        raise ValueError("type not in config")

    if config["type"] == "ttl":
        return CachetoolsVanStateCache(config)
    elif config["type"] == "memcached":
        return MemcachedVanStateCache(config)
    else:
        raise ValueError("Invalid cache type")

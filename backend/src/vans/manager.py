import os
from datetime import datetime, timedelta, timezone
from math import radians, sqrt, cos
from typing import Optional

from pydantic import BaseModel

from src.model.stop import Stop
from src.vans.cache import VanStateCache
from src.vans.cachetools import CachetoolsVanStateCache
from src.vans.memcached import MemcachedVanStateCache
from src.vans.state import Coordinate, Location

THRESHOLD_RADIUS_M = 30.48 # 100 ft
THRESHOLD_TIME = timedelta(minutes=1)
AVERAGE_VAN_SPEED_MPS = 8.9408  # 20 mph


class VanState:
    def __init__(self, location: Location, stop: Stop, time_to_next_stop: timedelta):
        self.location = location
        self.next_stop = stop
        self.time_to_next_stop = time_to_next_stop

def distance_m(a: Coordinate, b: Coordinate) -> float:
    """
    Calculate the Euclidean distance in meters between two points
    on the earth (specified in decimal degrees)
    """
    # distances
    dlat = b.latitude - a.latitude
    dlon = b.longitude - a.longitude

    dlatkm = dlat * 111.32
    dlonkm = dlon * 40075 * cos(radians(a.latitude)) / 360

    # convert to meters
    return sqrt(dlatkm**2 + dlonkm**2) * 1000


class VanManager:
    def __init__(self, cache: VanStateCache):
        self.cache = cache

    def __contains__(self, van_id: int):
        return van_id in self.cache

    def init_van(self, van_id: int, stops: list[Stop]):
        self.cache.add(van_id, stops)

    def get_van(self, van_id: int) -> Optional[VanState]:
        if van_id not in self.cache:
            return None
        locations = self.cache.get_locations(van_id)
        if not locations:
            return None
        location = locations[0]
        stops = self.cache.get_stops(van_id)
        current_stop_index = self.cache.get_current_stop_index(van_id)
        next_stop = stops[(current_stop_index + 1) % len(stops)]
        distance = distance_m(location.coordinate, Coordinate(latitude=next_stop.lat, longitude=next_stop.lon))
        time_to = timedelta(seconds=distance / AVERAGE_VAN_SPEED_MPS)
        return VanState(location=location, stop=next_stop, time_to_next_stop=time_to)

    def push_location(self, van_id: int, location: Location):
        if van_id not in self.cache:
            return None
        self.cache.push_location(van_id, location)
        stops = self.cache.get_stops(van_id)
        current_stop_index = self.cache.get_current_stop_index(van_id)
        subsequent_stops = stops[current_stop_index + 1:] + stops[:current_stop_index + 1]
        for i, stop in enumerate(subsequent_stops):
            longest_subset = []
            current_subset = []
            locations = self.cache.get_locations(van_id)
            for location in locations:
                distance = distance_m(location.coordinate, Coordinate(latitude=stop.lat, longitude=stop.lon))
                if distance < THRESHOLD_RADIUS_M:
                    current_subset.append(location.timestamp)
                else:
                    if len(current_subset) > len(longest_subset):
                        longest_subset = current_subset
                    current_subset = []
            if len(current_subset) > len(longest_subset):
                longest_subset = current_subset
            if longest_subset:
                duration = longest_subset[0] - longest_subset[-1]
            else:
                duration = timedelta(seconds=0)
            if duration >= THRESHOLD_TIME:
                self.cache.set_current_stop_index(van_id, i)
                break


def van_manager():
    config = {}
    for key in os.environ:
        if key.startswith("CACHE_"):
            config[key[6:].lower()] = os.environ[key]

    if "type" not in config:
        raise ValueError("type not in config")

    if config["type"] == "ttl":
        return VanManager(CachetoolsVanStateCache(config))
    elif config["type"] == "memcached":
        return VanManager(MemcachedVanStateCache(config))
    else:
        raise ValueError("Invalid cache type")

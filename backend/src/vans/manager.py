from math import radians, cos, sin, asin, sqrt
from collections import deque
from typing import Optional
from datetime import datetime, timedelta, timezone

from cachetools import FIFOCache
from pydantic import BaseModel

from src.model.stop import Stop

THRESHOLD_RADIUS_M = 1000
THRESHOLD_TIME = timedelta(minutes=2)
AVERAGE_VAN_SPEED_MPS = 8.9408 # 20 mph


class Coordinate(BaseModel):
    latitude: float
    longitude: float

class Location(BaseModel):
    timestamp: datetime
    coordinate: Coordinate

class NextStop(BaseModel):
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
    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300

        self.ttl = timedelta(seconds=config["ttl"])
        self.cache = FIFOCache(maxsize=config["maxsize"])

    def init_van(self, van_id: int, stops: list[Stop]):
        self.cache[van_id] = VanState(
            stops=stops, current_stop_index=-1, locations=TTLQueue(self.ttl)
        )

    def aware_of(self, van_id: int) -> bool:
        return van_id in self.cache

    def location(self, van_id: int) -> Optional[Location]:
        state = self.cache.get(van_id, None)
        if state is None:
            return None
        latest = next(state.locations)
        if latest is None:
            return None
        timestamp, coordinate = latest
        return Location(timestamp=timestamp, coordinate=coordinate)

    def next_stop(self, van_id: int) -> Optional[NextStop]:
        state = self.cache.get(van_id, None)
        if state is None:
            return None
        if state.current_stop_index == -1:
            return None
        next_stop = state.stops[(state.current_stop_index + 1) % len(state.stops)]
        distance = distance_m(self.location(van_id), next_stop.location)
        time_until_arrival = timedelta(seconds=distance / AVERAGE_VAN_SPEED_MPS)
        return NextStop(stop=next_stop, time_to=time_until_arrival)

    def push_location(self, van_id: int, location: Coordinate):
        state = self.cache.get(van_id, None)
        if state is None:
            return
        state.locations.push(location)
        subsequent_stops = state.stop[state.current_stop_index + 1 :]
        for i, stop in enumerate(subsequent_stops):
            distances = [
                (time, distance_m(location, stop.location))
                for time, location in state.locations
            ]
            longest_subset_time_delta = self.get_longest_subset_time_delta(distances)
            if longest_subset_time_delta >= THRESHOLD_TIME:
                state.current_stop_index = i
                break

    def get_longest_subset_time_delta(self, distances: list[tuple[datetime, float]]):
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


class VanState(BaseModel):
    stops: list[Stop]
    current_stop_index: int
    locations: TTLQueue

def van_manager():
    return VanManager()
from datetime import timedelta

from src.model.stop import Stop
from src.vantracking.location import Location


class VanState:
    def __init__(self, location: Location, stop: Stop, seconds_to_next_stop: timedelta):
        self.location = location
        self.next_stop = stop
        self.seconds_to_next_stop = seconds_to_next_stop

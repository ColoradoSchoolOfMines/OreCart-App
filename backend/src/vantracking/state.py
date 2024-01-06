from datetime import timedelta

from src.model.stop import Stop
from src.vantracking.location import Location

class VanState:
    def __init__(self, location: Location, stop: Stop, time_to_next_stop: timedelta):
        self.location = location
        self.next_stop = stop
        self.time_to_next_stop = time_to_next_stop


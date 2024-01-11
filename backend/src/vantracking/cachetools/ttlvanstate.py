from src.model.stop import Stop
from src.vantracking.cachetools.ttlqueue import TTLQueue


class TTLVanState:
    def __init__(self, locations: TTLQueue, stops: list[Stop], current_stop_index: int):
        self.locations = locations
        self.stops = stops
        self.current_stop_index = current_stop_index

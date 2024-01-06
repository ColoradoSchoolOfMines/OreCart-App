import time

from typing import Any

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

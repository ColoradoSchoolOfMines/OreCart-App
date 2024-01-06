from collections import deque

from typing import Any

from src.vantracking.cachetools.ttl import TTL

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


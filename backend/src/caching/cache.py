from abc import ABC


class Cache(ABC):
    def __init__(self, config={}):
        raise NotImplementedError

    def get(self, key):
        raise NotImplementedError

    def set(self, key, value):
        raise NotImplementedError

    def delete(self, key):
        raise NotImplementedError

    def clear(self):
        raise NotImplementedError

    def __contains__(self, key):
        raise NotImplementedError

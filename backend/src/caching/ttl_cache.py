from cachetools import TTLCache as _TTLCache

from .cache import Cache

class TTLCache(Cache):
    def __init__(self, config={}):
        if "maxsize" not in config:
            config["maxsize"] = 100
        if "ttl" not in config:
            config["ttl"] = 300

        self.cache = _TTLCache(maxsize=config["maxsize"], ttl=config["ttl"])

    def get(self, key):
        return self.cache.get(key)

    def set(self, key, value):
        self.cache[key] = value

    def delete(self, key):
        del self.cache[key]

    def clear(self):
        self.cache.clear()

    def __contains__(self, key):
        return key in self.cache

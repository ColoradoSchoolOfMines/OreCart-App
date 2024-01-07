from pymemcache.client import base

from .cache import Cache


class Memcached(Cache):
    def __init__(self, config={}):
        self.expire = config["expire"] if "expire" in config else 300
        if "memcache_address" not in config:
            raise ValueError("memcache_address not in config")
        if "memcache_port" not in config:
            raise ValueError("memcache_port not in config")
        self.cache = base.Client(
            [(config["memcache_address"], config["memcache_port"])]
        )

    def get(self, key):
        if not isinstance(key, str):
            raise TypeError("key must be a string")
        return self.cache.get(key)

    def set(self, key, value):
        if not isinstance(key, str):
            raise TypeError("key must be a string")
        if self.cache.get(key) is None:
            self.cache.add(key, value, expire=self.expire)
        else:
            self.cache.set(key, value)

    def delete(self, key):
        if not isinstance(key, str):
            raise TypeError("key must be a string")
        self.cache.delete(key)

    def clear(self):
        self.cache.flush_all()

    def __contains__(self, key):
        if not isinstance(key, str):
            return False
        return self.cache.get(key) is not None

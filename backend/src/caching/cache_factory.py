import os

from .memcached import Memcached
from .ttl_cache import TTLCache


def get_cache():
    config = {}
    for key in os.environ:
        if key.startswith("CACHE_"):
            config[key[6:].lower()] = os.environ[key]

    if "type" not in config:
        raise ValueError("type not in config")

    if config["type"] == "ttl":
        return TTLCache(config)
    elif config["type"] == "memcached":
        return Memcached(config)
    else:
        raise ValueError("Invalid cache type")

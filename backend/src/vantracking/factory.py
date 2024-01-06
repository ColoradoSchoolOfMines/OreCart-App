import os

from src.vantracking.tracker import VanTracker

from src.vantracking.cachetools.cache import CachetoolsVanStateCache
from src.vantracking.memcached.cache import MemcachedVanStateCache

def van_tracker() -> VanTracker:
    """
    Create a new van manager from the environment variable configuration. This will raise a ValueError if the
    configuration is invalid.
    """

    config = {}
    for key in os.environ:
        if key.startswith("CACHE_"):
            config[key[6:].lower()] = os.environ[key]

    if "type" not in config:
        raise ValueError("type not in config")

    if config["type"] == "ttl":
        return VanTracker(CachetoolsVanStateCache(config))
    elif config["type"] == "memcached":
        return VanTracker(MemcachedVanStateCache(config))
    else:
        raise ValueError("Invalid cache type")

from typing import Optional

from fastapi import HTTPException


def process_include(include: Optional[list[str]], allowed: set[str]):
    """
    Validates the include parameter of a request, ensuring that it contains no duplicates
    and only includes valid fields.
    """
    if include is None:
        # Nothing specified, implied to include all fields
        return allowed

    include_set = set(include)
    if len(include_set) != len(include):
        raise HTTPException(status_code=400, detail="Duplicate include parameters")
    if include_set - allowed:
        raise HTTPException(status_code=400, detail="Invalid include parameters")
    return include_set

from fastapi import HTTPException


def validate_include(include: list[str], allowed: set[str]):
    """
    Validates the include parameter of a request, ensuring that it contains no duplicates
    and only includes valid fields.
    """

    include_set = set(include)
    if len(include_set) != len(include):
        raise HTTPException(status_code=400, detail="Duplicate include parameters")
    if include_set - allowed:
        raise HTTPException(status_code=400, detail="Invalid include parameters")
    return include_set

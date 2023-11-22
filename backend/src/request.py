from fastapi import HTTPException

def validate_include(include: list[str], allowed: set[str]):
    include_set = set(include)
    if len(include_set) != len(include):
        raise HTTPException(status_code=400, detail="Duplicate include parameters")
    if include_set - allowed:
        raise HTTPException(status_code=400, detail="Invalid include parameters")
    return include_set

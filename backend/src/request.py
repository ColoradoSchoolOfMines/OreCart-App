from typing import Optional

from fastapi import HTTPException

def require_mtls(request):
    """
    Validates the X-Forward-Key header of a request, ensuring that it is present and
    matches the key specified in the environment.
    """
    if request.headers.get("X-mTLS-Forward-Key") != request.app.state.mtls_forward_key:
        raise HTTPException(status_code=401, detail="Invalid X-Forward-Key header")

def process_include(include: Optional[list[str]], allowed: set[str]):
    """
    Validates the include parameter of a request, ensuring that it contains no duplicates
    and only includes valid fields.
    """
    if include is None:
        # Nothing specified, implied to include all fields
        return {}

    include_set = set(include)
    if len(include_set) != len(include):
        raise HTTPException(status_code=400, detail="Duplicate include parameters")
    if include_set - allowed:
        raise HTTPException(status_code=400, detail="Invalid include parameters")
    return include_set

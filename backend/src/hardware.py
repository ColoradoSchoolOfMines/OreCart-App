"""
Defines middleware and response classes to minimize data use when communicating with
hardware components.
"""
import struct
from enum import Enum

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class HardwareOKResponse(Response):
    """
    This is a custom response class used by hardware components to indicate a
    successful completion (200 OK) of the request with an optional body of bytes
    to be returned. If no body is specified, then the response will have an empty
    body.
    """

    def __init__(self, body: bytes = b""):
        super().__init__(
            content=body,
            status_code=200,
            media_type="application/octet-stream",
        )

    def __eq__(self, __value: object) -> bool:
        return isinstance(__value, HardwareOKResponse) and self.body == __value.body


class HardwareErrorCode(Enum):
    """
    Defines codes for errors returned to the hardware.
    """

    TIMESTAMP_TOO_FAR_IN_PAST = 0
    TIMESTAMP_IN_FUTURE = 1
    VAN_NOT_ACTIVE = 2
    TIMESTAMP_NOT_MOST_RECENT = 3
    VAN_DOESNT_EXIST = 4


class HardwareHTTPException(Exception):
    """
    This is a custom exception class raised when an error occurs on a route
    used by hardware components. To make the response as small as possible
    and save data, an integer error code is used as a packed integer in the
    response body rather than JSON.
    """

    def __init__(self, status_code: int, error_code: HardwareErrorCode):
        super().__init__()
        self.status_code = status_code
        self.error_code = error_code


class HardwareExceptionMiddleware(BaseHTTPMiddleware):
    """
    A middleware mapping HWHTTPException to a response the packed byte it specifies
    """

    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
        except HardwareHTTPException as exc:
            # Is a hardware error, respond with a packed error code byte.
            response = Response(
                content=struct.pack("!b", exc.error_code.value),
                status_code=exc.status_code,
                media_type="application/octet-stream",
            )
        except Exception as exc:
            # Forward exception to base middleware (hopefully the default error handler)
            raise exc
        return response

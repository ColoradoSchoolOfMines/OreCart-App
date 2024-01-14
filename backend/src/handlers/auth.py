import time
from typing import Dict

import jwt
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

# obviously not secure enough for production - this is a placeholder
# I guess the key should be stored in a file instead?
SECRET = "6QYOycQDA1JcS4uct6OyguwTDW9ynW6N"

# how long the token is valid for, in seconds
EXPIRATION_TIME = 7 * 24 * 60 * 60  # 7 days

class AuthModel(BaseModel):
    username: str
    password: str


class VerifyModel(AuthModel):
    jwt: str


@router.post("/login")
async def post_auth_login(auth_model: AuthModel) -> Dict[str, str]:
    # put something here that checks whether the username and password are valid
    current_time = int(time.time())
    token = jwt.encode(
        {
            "aud": auth_model.username,
            "exp": current_time + EXPIRATION_TIME,
            "iat": current_time,
        },
        SECRET
    )
    return {"jwt": token}


@router.post("/verify")
async def post_auth_verify(verify_model: VerifyModel) -> None:
    """Verify a JWT sent from the client."""
    print(f"{verify_model.username=}")
    print(f"{verify_model.password=}")
    print(f"{verify_model.jwt=}")
    print(
        jwt.decode(
            verify_model.jwt,
            key=SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    )

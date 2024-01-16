import time
from typing import Annotated, Dict

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
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

async def verify(req: Request) -> None:
    if "Authorization" not in req.headers:
        raise HTTPException(status_code=401, details="no Authorization header")
    auth_head = req.headers["Authorization"]
    print(auth_head.split(" ")[-1])
    try:
        decoded = jwt.decode(
            auth_head.split(" ")[-1],
            key=SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=400, details="malformed JWT")
    # TODO: check that the jwt is valid by comparing the locally stored jwt with the incoming one
    pass

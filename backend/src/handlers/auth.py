from typing import Dict, Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthModel(BaseModel):
    username: str
    password: str


@router.post("/")
async def post_auth(req: Request) -> Dict[str, str]:
    print(type(req))
    print(req)
    print(await req.body())
    return {"message": "OK"}
# def post_auth(auth_model: AuthModel) -> Dict[str, str]:
#     print(f"{auth_model.username=}")
#     print(f"{auth_model.password=}")
#     return {"message": "OK", "username": auth_model.username, "password": auth_model.password}

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthModel(BaseModel):
    username: str
    password: str


@router.post("/")
async def post_auth(auth_model: AuthModel) -> None:
    print(f"{auth_model.username=}")
    print(f"{auth_model.password=}")

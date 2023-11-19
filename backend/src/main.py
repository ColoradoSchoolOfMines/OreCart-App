import os

import sqlalchemy
from dotenv import load_dotenv
from fastapi import FastAPI

from . import db, hw
from .handlers import location

load_dotenv()

app = FastAPI()
app.add_middleware(hw.HWExceptionMiddleware)
app.include_router(location.router)


@app.on_event("startup")
def startup_event():
    app.state.engine = db.init()

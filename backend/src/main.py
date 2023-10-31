import os

import sqlalchemy
from dotenv import load_dotenv
from fastapi import FastAPI

from . import db
from .handlers import location

load_dotenv()

app = FastAPI()

app.include_router(location.router)


@app.on_event("startup")
def startup_event():
    db.init()

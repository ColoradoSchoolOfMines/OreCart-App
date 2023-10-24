import os

import sqlalchemy
from dotenv import load_dotenv
from fastapi import FastAPI

from .handlers import location
from . import db

load_dotenv()

app = FastAPI()

app.include_router(location.router)


@app.on_event("startup")
def startup_event():
    db.init()
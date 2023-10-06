import os

import sqlalchemy
from dotenv import load_dotenv
from fastapi import FastAPI

from .handlers import location

load_dotenv()

app = FastAPI()

app.include_router(location.router)

@app.on_event("startup")
def startup_event():
    global conn
    conn = sqlalchemy.create_engine(os.getenv("DATABASE_URL") or "")

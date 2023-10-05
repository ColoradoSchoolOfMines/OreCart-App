import os

import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()

app = FastAPI()


@app.on_event("startup")
def startup_event():
    global conn, cursor

    conn = psycopg2.connect(url=os.getenv("DATABASE_URL"))
    cursor = conn.cursor()


class VanLocation(BaseModel):
    lat: float
    long: float
    van_id: int
    timestamp: int


@app.get("/location/{van_id}")
def get_van_location(van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    return VanLocation(lat=0.0, long=0.0, van_id=van_id, timestamp=0)


@app.post("/location/{van_id}")
def post_van_location(van_id: int, van_location: VanLocation):
    # update van location in database

    return {"message": "Location updated successfully."}

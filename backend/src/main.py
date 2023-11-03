import os
import struct

import sqlalchemy
from dotenv import load_dotenv
from fastapi import FastAPI, Request

from . import db
from .handlers import location

load_dotenv()

app = FastAPI()

app.include_router(location.router)

@app.on_event("startup")
def startup_event():
    app.state.engine = db.init()

@app.post('/location')
async def print_request_body(request: Request):
    t = await request.body()

    # Parse uint8_t, IEEE 754 double, IEEE 754 double, uint64_t
    van_id, lat, lon, ts = struct.unpack("<Bddq", t)

    print("van_id", van_id)
    print("lat", lat)
    print("lon", lon)
    print("ts", ts)

    return bytes([1])
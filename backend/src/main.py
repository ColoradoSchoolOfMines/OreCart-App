from cachetools import TTLCache
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import DBWrapper
from .handlers import alert, location, ridership, routes, stops, vans
from .hardware import HardwareExceptionMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(HardwareExceptionMiddleware)
app.include_router(location.router)
app.include_router(routes.router)
app.include_router(stops.router)
app.include_router(alert.router)
app.include_router(ridership.router)
app.include_router(vans.router)


@app.on_event("startup")
def startup_event():
    app.state.db = DBWrapper()
    app.state.van_locations = TTLCache(maxsize=100, ttl=300)

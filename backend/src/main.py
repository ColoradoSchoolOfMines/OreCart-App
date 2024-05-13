from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .handlers import ada, ridership, routes, stops, vans
from .hardware import HardwareExceptionMiddleware
from .routes import alerts
from .vantracking.factory import van_tracker
from .vantracking.tracker import VanTracker

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
app.include_router(ada.router)
app.include_router(routes.router)
app.include_router(stops.router)
app.include_router(alerts.router)
app.include_router(ridership.router)
app.include_router(vans.router)


@app.on_event("startup")
def startup_event():
    app.state.van_tracker: VanTracker = van_tracker()

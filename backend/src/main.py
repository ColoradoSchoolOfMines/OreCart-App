from dotenv import load_dotenv
from fastapi import FastAPI

from .hardware import HardwareExceptionMiddleware
from .db import DBWrapper
from .handlers import location

load_dotenv()

app = FastAPI()
app.add_middleware(HardwareExceptionMiddleware)
app.include_router(location.router)


@app.on_event("startup")
def startup_event():
    app.state.db = DBWrapper()

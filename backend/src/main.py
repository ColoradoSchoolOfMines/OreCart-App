from dotenv import load_dotenv
from fastapi import FastAPI

from .db import DBWrapper
from .handlers import location
from .hardware import HardwareExceptionMiddleware

load_dotenv()

app = FastAPI()
app.add_middleware(HardwareExceptionMiddleware)
app.include_router(location.router)


@app.on_event("startup")
def startup_event():
    app.state.db = DBWrapper()

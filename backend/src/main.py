from dotenv import load_dotenv
from fastapi import FastAPI

from .db import DBWrapper
from .handlers import alert, location

load_dotenv()

app = FastAPI()

app.include_router(location.router)
app.include_router(alert.router)


@app.on_event("startup")
def startup_event():
    app.state.db = DBWrapper()

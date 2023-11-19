from dotenv import load_dotenv
from fastapi import FastAPI

from .db import DBWrapper
from .handlers import location

load_dotenv()

app = FastAPI()

app.include_router(location.router)

@app.on_event("startup")
def startup_event():
    app.state.db = DBWrapper()

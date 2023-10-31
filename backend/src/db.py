import os

import sqlalchemy
from sqlalchemy.orm import DeclarativeBase, Session

engine = None


def init():
    global engine
    engine = sqlalchemy.create_engine(
        os.getenv("DATABASE_URL") or "", pool_size=15, max_overflow=5
    )


class Base(DeclarativeBase):
    pass

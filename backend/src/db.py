import os

import sqlalchemy
from sqlalchemy.orm import DeclarativeBase, Session


def init():
    engine = sqlalchemy.create_engine(
        os.getenv("DATABASE_URL") or "", pool_size=15, max_overflow=5
    )
    return engine


class Base(DeclarativeBase):
    pass

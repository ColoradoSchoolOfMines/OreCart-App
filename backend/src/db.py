import os

import sqlalchemy
from sqlalchemy.orm import DeclarativeBase, Session

conn = None

def init():
    global conn
    conn = sqlalchemy.create_engine(os.getenv("DATABASE_URL") or "")


def transaction():
    return Session(conn)


class Base(DeclarativeBase):
    pass

import os

import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session

class DBWrapper():
    def __init__(self):
        self.engine = sqlalchemy.create_engine(
            os.environ["DATABASE_URL"], pool_size=15, max_overflow=5
        )

    def session(self):
        return Session(self.engine)

class Base(DeclarativeBase):
    """
    This makes an instance of DeclarativeBase which is the inherited model for all models.
    This is an alternative to using declarative_base from sqlalchemy.orm and making
    a new instance of DeclarativeBase upon the creation of each new model.
    """

    pass

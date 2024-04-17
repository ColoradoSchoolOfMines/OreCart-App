import os

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from abc import abc, abstractmethod

class Database:
    session_maker: async_sessionmaker

class Base(DeclarativeBase):
    """
    This makes an instance of DeclarativeBase which is the inherited model for all models.
    This is an alternative to using declarative_base from sqlalchemy.orm and making
    a new instance of DeclarativeBase upon the creation of each new model.
    """

def init():
    engine = create_async_engine(
        os.environ["DATABASE_URL"], pool_size=15, max_overflow=5
    )
    Database.session_maker = async_sessionmaker(engine)

def make_session() -> async_sessionmaker:
    return Database.session_maker

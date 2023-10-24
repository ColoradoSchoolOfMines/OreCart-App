from sqlalchemy import Column, Integer, String

from src.db import Base


class StopModel(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    lat = Column(Integer, nullable=False)
    lon = Column(Integer, nullable=False)
    active = Column(Integer, nullable=False)

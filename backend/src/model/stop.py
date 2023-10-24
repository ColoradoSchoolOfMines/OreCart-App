from sqlalchemy import Boolean, Column, Float, Integer, String
from src.db import Base


class StopModel(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    active = Column(Boolean, nullable=False)

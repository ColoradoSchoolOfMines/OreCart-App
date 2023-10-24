from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer
from src.db import Base


class RidershipModel(Base):
    __tablename__ = "ridership"
    id = Column(Integer, primary_key=True)
    van_id = Column(Integer, ForeignKey("vans.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    entered = Column(Integer, nullable=False)
    exited = Column(Integer, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    datetime = Column(DateTime, nullable=False)

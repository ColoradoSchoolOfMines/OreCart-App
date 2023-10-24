from sqlalchemy import Column, ForeignKey, Integer, Float
from src.db import Base


class WaypointModel(Base):
    __tablename__ = "waypoints"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)

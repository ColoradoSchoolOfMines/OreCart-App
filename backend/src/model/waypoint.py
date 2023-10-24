from sqlalchemy import Column, ForeignKey, Integer
from src.db import Base


class WaypointModel(Base):
    __tablename__ = "waypoints"
    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    lat = Column(Integer, nullable=False)
    lon = Column(Integer, nullable=False)

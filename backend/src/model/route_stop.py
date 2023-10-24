from sqlalchemy import Column, ForeignKey, Integer, String
from src.db import Base


class RouteStopModel(Base):
    __tablename__ = "route_stops"
    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    stop_id = Column(Integer, ForeignKey("stops.id"), nullable=False)

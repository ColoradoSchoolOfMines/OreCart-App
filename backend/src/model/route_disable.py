from sqlalchemy import Column, ForeignKey, Integer, String
from src.db import Base


class RouteDisableModel(Base):
    __tablename__ = "route_disables"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)

from sqlalchemy import Column, ForeignKey, Integer

from src.db import Base


class RouteVanModel(Base):
    __tablename__ = "route_vans"
    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    van_id = Column(Integer, ForeignKey("vans.id"), nullable=False)

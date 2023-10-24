from sqlalchemy import Column, Integer, String

from src.db import Base


class RouteModel(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

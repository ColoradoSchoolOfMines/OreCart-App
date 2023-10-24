from sqlalchemy import Boolean, Column, Integer
from src.db import Base


class VanModel(Base):
    __tablename__ = "vans"
    id = Column(Integer, primary_key=True, nullable=False)
    wheelchair = Column(Boolean, nullable=False)

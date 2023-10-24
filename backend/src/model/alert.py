from sqlalchemy import Column, Integer, String

from src.db import Base


class AlertModel(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    start_datetime = Column(Integer, nullable=False)
    end_datetime = Column(Integer, nullable=False)

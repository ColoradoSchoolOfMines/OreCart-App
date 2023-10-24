from sqlalchemy import Column, Integer, String, DateTime
from src.db import Base


class AlertModel(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)

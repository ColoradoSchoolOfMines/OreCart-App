from sqlalchemy import Column, ForeignKey, Integer

from src.db import Base


class StopDisableModel(Base):
    __tablename__ = "stop_disables"
    id = Column(Integer, primary_key=True, nullable=False)
    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=False)
    stop_id = Column(Integer, ForeignKey("stops.id"), nullable=False)

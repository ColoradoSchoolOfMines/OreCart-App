from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from src.db import Base


class ScheduleModel(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    dow = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

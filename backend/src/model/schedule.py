from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from src.db import Base


class ScheduleModel(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    dow = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

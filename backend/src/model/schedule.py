import datetime

from sqlalchemy import ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class ScheduleModel(Base):
    __tablename__ = "schedules"
    __table_args__ = (
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
        UniqueConstraint("route_id", "dow"),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    route_id: Mapped[int] = mapped_column(nullable=False)
    dow: Mapped[int] = mapped_column(nullable=False)
    start_time: Mapped[datetime.datetime] = mapped_column(nullable=False)
    end_time: Mapped[datetime.datetime] = mapped_column(nullable=False)

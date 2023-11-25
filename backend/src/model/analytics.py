from datetime import datetime

from sqlalchemy import DateTime, ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class Analytics(Base):
    __tablename__ = "analytics"
    __table_args__ = (
        ForeignKeyConstraint(["van_id"], ["vans.id"]),
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
        UniqueConstraint("van_id", "datetime"),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    van_id: Mapped[int] = mapped_column(nullable=False)
    route_id: Mapped[int] = mapped_column(nullable=False)
    entered: Mapped[int] = mapped_column(nullable=False)
    exited: Mapped[int] = mapped_column(nullable=False)
    lat: Mapped[float] = mapped_column(nullable=False)
    lon: Mapped[float] = mapped_column(nullable=False)
    datetime: Mapped[DateTime] = mapped_column(DateTime, nullable=False)

    def __eq__(self, __value: object) -> bool:
        return (
            isinstance(__value, Analytics)
            and self.id == __value.id
            and self.van_id == __value.van_id
            and self.route_id == __value.route_id
            and self.entered == __value.entered
            and self.exited == __value.exited
            and self.lat == __value.lat
            and self.lon == __value.lon
            and self.datetime == __value.datetime
        )

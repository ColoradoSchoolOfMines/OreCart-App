import datetime

from sqlalchemy import ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class Ridership(Base):
    __tablename__ = "ridership"
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
    datetime: Mapped[datetime.datetime] = mapped_column(nullable=False)

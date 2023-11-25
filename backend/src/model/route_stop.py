from sqlalchemy import ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class RouteStop(Base):
    __tablename__ = "route_stops"
    __table_args__ = (
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
        ForeignKeyConstraint(["stop_id"], ["stops.id"]),
        UniqueConstraint("route_id", "stop_id"),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    route_id: Mapped[int] = mapped_column(nullable=False)
    stop_id: Mapped[int] = mapped_column(nullable=False)

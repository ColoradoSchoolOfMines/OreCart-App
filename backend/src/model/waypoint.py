from sqlalchemy import ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class Waypoint(Base):
    __tablename__ = "waypoints"
    __table_args__ = (
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
        UniqueConstraint("route_id", "lat", "lon"),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    route_id: Mapped[int] = mapped_column(nullable=False)
    lat: Mapped[float] = mapped_column(nullable=False)
    lon: Mapped[float] = mapped_column(nullable=False)

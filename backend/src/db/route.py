from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base
from src.db.waypoint import Waypoint  # pylint: disable=unused-import
from typing import Optional


class Route(Base):
    __tablename__ = "routes"
    # Note: DO NOT add the check constraint to this model, it's used in Postgres
    # and SQLite, but SQLite doesn't support check constraints w/regex.
    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )
    name: Mapped[str] = mapped_column(unique=True)
    color: Mapped[Optional[str]] = mapped_column(String(7))
    description: Mapped[str] = mapped_column(String(255))

    waypoints: Mapped["Waypoint"] = relationship(back_populates="route")
    stops: Mapped["Stop"] = relationship(back_populates="routes", secondary="route_stops")
    disabled_by: Mapped["Alert"] = relationship(back_populates="routes_disabled", secondary="route_disables")

    def __eq__(self, __value: object) -> bool:
        # Exclude ID since it'll always differ, only compare on content
        return (
            isinstance(__value, Route)
            and self.name == __value.name
            and self.color == __value.color
        )

    def __repr__(self) -> str:
        return f"<Route id={self.id} name={self.name} color={self.color}>"

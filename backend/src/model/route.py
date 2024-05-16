from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import Base
from src.model.waypoint import Waypoint  # pylint: disable=unused-import


class Route(Base):
    __tablename__ = "routes"
    # Note: DO NOT add the check constraint to this model, it's used in Postgres
    # and SQLite, but SQLite doesn't support check constraints w/regex.
    __table_args__ = (UniqueConstraint("name"),)  # type: ignore
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    color: Mapped[str] = mapped_column(
        String(7),
        nullable=True,
    )
    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        server_default="",
    )

    waypoints = relationship("Waypoint", backref="route", cascade="all, delete-orphan")

    def __eq__(self, __value: object) -> bool:
        # Exclude ID since it'll always differ, only compare on content
        return (
            isinstance(__value, Route)
            and self.name == __value.name
            and self.color == __value.color
        )

    def __repr__(self) -> str:
        return f"<Route id={self.id} name={self.name} color={self.color}>"

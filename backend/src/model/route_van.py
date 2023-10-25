from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class RouteVanModel(Base):
    __tablename__ = "route_vans"
    __table_args__ = (
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
        ForeignKeyConstraint(["van_id"], ["vans.id"]),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    route_id: Mapped[int] = mapped_column(nullable=False)
    van_id: Mapped[int] = mapped_column(nullable=False)

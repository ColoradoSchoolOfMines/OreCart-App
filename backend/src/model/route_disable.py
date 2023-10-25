from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class RouteDisableModel(Base):
    __tablename__ = "route_disables"
    __table_args__ = (
        ForeignKeyConstraint(["alert_id"], ["alerts.id"]),
        ForeignKeyConstraint(["route_id"], ["routes.id"]),
    )
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    alert_id: Mapped[int] = mapped_column(nullable=False)
    route_id: Mapped[int] = mapped_column(nullable=False)

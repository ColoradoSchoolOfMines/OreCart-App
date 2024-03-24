from datetime import datetime

from sqlalchemy import ForeignKey, ForeignKeyConstraint, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src.db import Base
from src.model.types import TZDateTime


class VanLocation(Base):
    __tablename__ = "van_location"
    __table_args__ = (ForeignKeyConstraint(["session_id"], ["van_tracker_session.id"]),)

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TZDateTime, nullable=False, server_default=func.now()
    )
    session_id: Mapped[int] = mapped_column(
        ForeignKey("van_tracker_session.id"), nullable=False
    )
    lat: Mapped[float] = mapped_column(nullable=False)
    lon: Mapped[float] = mapped_column(nullable=False)

    def __eq__(self, other: object) -> bool:
        return (
            isinstance(other, VanLocation)
            and self.created_at == other.created_at
            and self.session_id == other.session_id
            and self.lat == other.lat
            and self.lon == other.lon
        )

    def __repr__(self) -> str:
        return f"<VanLocation id={self.id} created_at={self.created_at} session_id={self.session_id} lat={self.lat} lon={self.lon}>"

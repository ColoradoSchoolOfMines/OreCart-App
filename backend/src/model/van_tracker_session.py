from datetime import datetime

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src.db import Base
from src.model.types import TZDateTime


class VanTrackerSession(Base):
    __tablename__ = "van_tracker_session"

    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TZDateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TZDateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    van_guid: Mapped[String] = mapped_column(String, nullable=False)
    route_id: Mapped[int] = mapped_column(Integer, nullable=False)
    stop_index: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="-1"
    )
    dead: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __eq__(self, __value: object) -> bool:
        return (
            isinstance(__value, VanTrackerSession)
            and self.created_at == __value.created_at
            and self.updated_at == __value.updated_at
            and self.van_guid == __value.van_guid
            and self.route_id == __value.route_id
            and self.stop_index == __value.stop_index
            and self.dead == __value.dead
        )

    def __repr__(self) -> str:
        return f"<VanTrackerSession id={self.id} created_at={self.created_at} updated_at={self.updated_at} van_guid={self.van_guid} route_id={self.route_id} stop_id={self.stop_index} dead={self.dead}>"

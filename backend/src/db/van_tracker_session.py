from datetime import datetime

<<<<<<< HEAD:backend/src/db/van_tracker_session.py
from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from src.db.base import Base
from src.db.types import TZDateTime


class VanTrackerSessionModel(Base):
    __tablename__ = "van_tracker_session"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        TZDateTime, server_default=func.now()  # pylint: disable=all
    )
    updated_at: Mapped[datetime] = mapped_column(
        TZDateTime,
        server_default=func.now(),
        onupdate=func.now(),  # pylint: disable=all
    )
    van_guid: Mapped[str] = mapped_column()
    route_id: Mapped[int] = mapped_column()
    stop_index: Mapped[int] = mapped_column()
    dead: Mapped[bool] = mapped_column()

    locations: Mapped["VanLocation"] = relationship(back_populates="session")
    ridership_analytics: Mapped["RidershipAnalytics"] = relationship(
        back_populates="session"
    )

    def __eq__(self, __value: object) -> bool:
        return (
            isinstance(__value, VanTrackerSessionModel)
=======
from sqlalchemy import Boolean, Integer, String, func
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
        TZDateTime, nullable=False, server_default=func.now()  # pylint: disable=all
    )
    updated_at: Mapped[datetime] = mapped_column(
        TZDateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),  # pylint: disable=all
    )
    van_guid: Mapped[str] = mapped_column(nullable=False)
    route_id: Mapped[int] = mapped_column(nullable=False)
    stop_index: Mapped[int] = mapped_column(nullable=False, server_default="-1")
    dead: Mapped[bool] = mapped_column(nullable=False, default=False)

    def __eq__(self, __value: object) -> bool:
        return (
            isinstance(__value, VanTrackerSession)
>>>>>>> main:backend/src/model/van_tracker_session.py
            and self.created_at == __value.created_at
            and self.updated_at == __value.updated_at
            and self.van_guid == __value.van_guid
            and self.route_id == __value.route_id
            and self.stop_index == __value.stop_index
            and self.dead == __value.dead
        )

    def __repr__(self) -> str:
        return f"<VanTrackerSession id={self.id} created_at={self.created_at} updated_at={self.updated_at} van_guid={self.van_guid} route_id={self.route_id} stop_index={self.stop_index} dead={self.dead}>"

from datetime import datetime

from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base
from src.model.types import TZDateTime


class ADARequest(Base):
    __tablename__ = "ada_requests"
    __table_args__ = (ForeignKeyConstraint(["pickup_spot"], ["pickup_spots.id"]),)
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    pickup_spot: Mapped[int] = mapped_column(nullable=False)
    pickup_time: Mapped[datetime] = mapped_column(TZDateTime, nullable=False)
    wheelchair: Mapped[bool] = mapped_column(nullable=False)

    def __eq__(self, __value: object) -> bool:
        # Exclude ID since it'll always differ, only compare on content
        return (
            isinstance(__value, ADARequest)
            and self.pickup_spot == __value.pickup_spot
            and self.pickup_time == __value.pickup_time
            and self.wheelchair == __value.wheelchair
        )

    def __repr__(self) -> str:
        return f"<AdaRequest id={self.id} pickup_spot={self.pickup_spot} pickup_time={self.pickup_time} wheelchair={self.wheelchair}>"

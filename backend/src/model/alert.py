import datetime

from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class Alert(Base):
    __tablename__ = "alerts"
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    text: Mapped[str] = mapped_column(nullable=False)
    start_datetime: Mapped[datetime.datetime] = mapped_column(nullable=False)
    end_datetime: Mapped[datetime.datetime] = mapped_column(nullable=False)

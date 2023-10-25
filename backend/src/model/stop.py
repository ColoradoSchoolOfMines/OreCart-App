from sqlalchemy.orm import Mapped, mapped_column

from src.db import Base


class StopModel(Base):
    __tablename__ = "stops"
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    lat: Mapped[float] = mapped_column(nullable=False)
    lon: Mapped[float] = mapped_column(nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False)

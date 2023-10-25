from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class VanModel(Base):
    __tablename__ = "vans"
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    wheelchair: Mapped[bool] = mapped_column(nullable=False)

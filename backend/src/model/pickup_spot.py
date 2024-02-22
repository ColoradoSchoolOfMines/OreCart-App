from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.db import Base


class PickupSpot(Base):
    __tablename__ = "pickup_spots"
    __table_args__ = (UniqueConstraint("name"),)
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    def __eq__(self, __value: object) -> bool:
        # Exclude ID since it'll always differ, only compare on content
        return isinstance(__value, PickupSpot) and self.name == __value.name

    def __repr__(self) -> str:
        return f"<PickupSpot id={self.id} name={self.name}>"

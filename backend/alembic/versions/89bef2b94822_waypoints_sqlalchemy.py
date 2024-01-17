"""create waypoints table

Revision ID: 233206860d70
Revises: 87f033493d8b
Create Date: 2023-10-04 17:35:37.020567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "233206860d70"
down_revision: Union[str, None] = "87f033493d8b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("waypoints")
    op.create_table(
        "waypoints",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lon", sa.Float, nullable=False),
        sa.UniqueConstraint("route_id", "lat", "lon"),
    )


def downgrade() -> None:
    op.drop_table("waypoints")

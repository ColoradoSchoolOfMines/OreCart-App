"""create route_stops table

Revision ID: 3e3261e602b0
Revises: 233206860d70
Create Date: 2023-10-04 17:40:15.926603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "3e3261e602b0"
down_revision: Union[str, None] = "233206860d70"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("route_stops")
    op.create_table(
        "route_stops",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stop_id", sa.Integer, sa.ForeignKey("stops.id", ondelete="CASCADE"), nullable=False),
        sa.Column("position", sa.Integer, nullable=False),
        sa.UniqueConstraint("route_id", "stop_id"),
    )


def downgrade() -> None:
    op.drop_table("route_stops")

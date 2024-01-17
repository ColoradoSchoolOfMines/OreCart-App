"""waypoints sqlalchemy

Revision ID: 7b17544b32a1
Revises: 05a50336996b
Create Date: 2024-01-16 21:06:39.535068

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7b17544b32a1"
down_revision: Union[str, None] = "05a50336996b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("waypoints")
    op.create_table(
        "waypoints",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "route_id",
            sa.Integer,
            sa.ForeignKey("routes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lon", sa.Float, nullable=False),
        sa.UniqueConstraint("route_id", "lat", "lon"),
    )


def downgrade() -> None:
    op.drop_table("waypoints")

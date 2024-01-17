"""route_stops sqlalchemy

Revision ID: f09e9fbc7ed3
Revises: c3c081cb6ba8
Create Date: 2024-01-16 21:06:38.878310

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f09e9fbc7ed3"
down_revision: Union[str, None] = "c3c081cb6ba8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("route_stops")
    op.create_table(
        "route_stops",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "route_id",
            sa.Integer,
            sa.ForeignKey("routes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "stop_id",
            sa.Integer,
            sa.ForeignKey("stops.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("position", sa.Integer, nullable=False),
        sa.UniqueConstraint("route_id", "stop_id"),
    )


def downgrade() -> None:
    op.drop_table("route_stops")

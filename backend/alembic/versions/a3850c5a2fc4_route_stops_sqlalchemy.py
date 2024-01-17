"""route_stops sqlalchemy

Revision ID: a3850c5a2fc4
Revises: 77a4e3e6a717
Create Date: 2024-01-16 21:06:40.528073

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a3850c5a2fc4"
down_revision: Union[str, None] = "77a4e3e6a717"
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

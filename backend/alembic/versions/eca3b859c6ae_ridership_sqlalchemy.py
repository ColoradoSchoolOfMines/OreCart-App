"""ridership sqlalchemy

Revision ID: eca3b859c6ae
Revises: 7b17544b32a1
Create Date: 2024-01-16 21:06:39.697730

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "eca3b859c6ae"
down_revision: Union[str, None] = "7b17544b32a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("ridership")
    op.create_table(
        "ridership",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "van_id",
            sa.Integer,
            sa.ForeignKey("vans.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "route_id",
            sa.Integer,
            sa.ForeignKey("routes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("entered", sa.Integer, nullable=False),
        sa.Column("exited", sa.Integer, nullable=False),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lon", sa.Float, nullable=False),
        sa.Column("datetime", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("van_id", "datetime"),
    )


def downgrade() -> None:
    op.drop_table("ridership")

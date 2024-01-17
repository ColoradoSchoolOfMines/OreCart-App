"""schedules sqlalchemy

Revision ID: 03a80025a6fa
Revises: f09e9fbc7ed3
Create Date: 2024-01-16 21:06:39.038834

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.schema import CheckConstraint

# revision identifiers, used by Alembic.
revision: str = "03a80025a6fa"
down_revision: Union[str, None] = "f09e9fbc7ed3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("schedules")
    op.create_table(
        "schedules",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "route_id",
            sa.Integer,
            sa.ForeignKey("routes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "dow", sa.Integer, nullable=False, *CheckConstraint("dow >= 0 AND dow <= 6")
        ),
        sa.Column("start_time", sa.Time, nullable=False),
        sa.Column(
            "end_time",
            sa.Time,
            nullable=False,
            *CheckConstraint("end_time > start_time")
        ),
        sa.UniqueConstraint("route_id", "dow"),
    )


def downgrade() -> None:
    op.drop_table("schedules")

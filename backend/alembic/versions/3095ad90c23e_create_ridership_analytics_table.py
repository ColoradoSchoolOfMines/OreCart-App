"""create ridership analytics table

Revision ID: 3095ad90c23e
Revises: 3282eafd6bb4
Create Date: 2024-03-21 17:37:54.313073

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3095ad90c23e"
down_revision: Union[str, None] = "3282eafd6bb4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
		DROP TABLE IF EXISTS public.ridership;
	"""
    )
    op.create_table(
        "ridership_analytics",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "session_id",
            sa.Integer,
            sa.ForeignKey("van_tracker_session.id", ondelete="CASCADE"),
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
        sa.UniqueConstraint("session_id", "datetime"),
    )


def downgrade() -> None:
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
    op.execute(
        """
		DROP TABLE IF EXISTS public.ridership_analytics;
	"""
    )

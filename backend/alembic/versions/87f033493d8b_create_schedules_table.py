"""create schedules table

Revision ID: 87f033493d8b
Revises: f1a02e4febad
Create Date: 2023-10-04 17:35:29.449383

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "87f033493d8b"
down_revision: Union[str, None] = "f1a02e4febad"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
            "dow",
            sa.Integer,
            nullable=False,
            server_default="0",
        ),
        sa.Column("start_time", sa.Time(timezone=False), nullable=False),
        sa.Column("end_time", sa.Time(timezone=False), nullable=False),
        sa.UniqueConstraint("route_id", "dow"),
        sa.CheckConstraint("dow >= 0 AND dow <= 6"),
        sa.CheckConstraint("end_time > start_time"),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.schedules;
    """
    )

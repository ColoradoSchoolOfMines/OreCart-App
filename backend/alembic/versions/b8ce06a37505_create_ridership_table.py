"""create ridership table

Revision ID: b8ce06a37505
Revises: e74cdc7a92b6
Create Date: 2023-10-04 17:40:44.364879

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b8ce06a37505"
down_revision: Union[str, None] = "e74cdc7a92b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
    op.execute(
        """
		DROP TABLE IF EXISTS public.ridership;
	"""
    )

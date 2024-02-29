"""create ada requests table

Revision ID: 8166e12f260c
Revises: 38c5326f0334
Create Date: 2024-02-22 10:38:27.424804

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "8166e12f260c"
down_revision: Union[str, None] = "38c5326f0334"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "ada_requests",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "pickup_spot",
            sa.Integer,
            sa.ForeignKey("pickup_spots.id"),
            nullable=False,
        ),
        sa.Column("pickup_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("wheelchair", sa.Boolean, nullable=False),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.ada_requests;
    """
    )

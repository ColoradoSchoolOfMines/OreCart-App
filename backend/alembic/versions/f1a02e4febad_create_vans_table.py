"""create vans table

Revision ID: f1a02e4febad
Revises: 311f80f8b8dd
Create Date: 2023-10-04 17:31:57.484449

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f1a02e4febad"
down_revision: Union[str, None] = "311f80f8b8dd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "vans",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id"), nullable=True),
        sa.Column("guid", sa.String(15), nullable=False),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.vans;
    """
    )

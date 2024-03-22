"""drop van table

Revision ID: 8b773adbb487
Revises: 3095ad90c23e
Create Date: 2024-03-21 17:52:31.297787

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8b773adbb487'
down_revision: Union[str, None] = '3095ad90c23e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.vans CASCADE;
    """
    )


def downgrade() -> None:
    op.create_table(
        "vans",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id"), nullable=True),
        sa.Column("guid", sa.String(15), nullable=False),
    )
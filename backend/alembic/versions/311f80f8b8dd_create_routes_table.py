"""create routes table

Revision ID: 311f80f8b8dd
Revises: 174e5a759f2d
Create Date: 2023-10-04 17:32:02.895752

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "311f80f8b8dd"
down_revision: Union[str, None] = "174e5a759f2d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "routes",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.UniqueConstraint("name"),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.routes;
    """
    )

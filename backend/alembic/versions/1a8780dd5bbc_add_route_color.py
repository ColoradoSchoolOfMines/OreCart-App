"""add route color

Revision ID: 1a8780dd5bbc
Revises: c3c081cb6ba8
Create Date: 2024-01-18 14:05:37.390091

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.schema import CheckConstraint

# revision identifiers, used by Alembic.
revision: str = "1a8780dd5bbc"
down_revision: Union[str, None] = "c3c081cb6ba8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "routes",
        sa.Column(
            "color",
            sa.String(),
            nullable=False,
            server_default="#000000",
            *CheckConstraint("color ~* '^#([A-Fa-f0-9]{6})$')")
        ),
    )


def downgrade() -> None:
    op.drop_column("routes", "color")

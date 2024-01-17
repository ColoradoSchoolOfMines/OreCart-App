"""routes sqlalchemy

Revision ID: 05a50336996b
Revises: e5948f4d075b
Create Date: 2024-01-16 21:06:39.374182

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "05a50336996b"
down_revision: Union[str, None] = "e5948f4d075b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("routes")
    op.create_table(
        "routes",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
    )


def downgrade() -> None:
    op.drop_table("routes")

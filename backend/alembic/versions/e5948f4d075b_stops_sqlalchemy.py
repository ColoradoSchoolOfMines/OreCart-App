"""stops sqlalchemy

Revision ID: e5948f4d075b
Revises: 03a80025a6fa
Create Date: 2024-01-16 21:06:39.215529

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e5948f4d075b"
down_revision: Union[str, None] = "03a80025a6fa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("stops")
    op.create_table(
        "stops",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lon", sa.Float, nullable=False),
        sa.Column("active", sa.Boolean, nullable=False),
        sa.UniqueConstraint("lat", "lon"),
    )


def downgrade() -> None:
    op.drop_table("stops")

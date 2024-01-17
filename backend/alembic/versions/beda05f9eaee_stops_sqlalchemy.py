"""create stops table

Revision ID: 174e5a759f2d
Revises: dc6fb3eee9e3
Create Date: 2023-10-04 17:25:22.810006

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "174e5a759f2d"
down_revision: Union[str, None] = "dc6fb3eee9e3"
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

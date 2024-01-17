"""create alerts table

Revision ID: dc6fb3eee9e3
Revises: 
Create Date: 2023-10-04 17:24:21.822457

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "dc6fb3eee9e3"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("alerts")
    op.create_table(
        "alerts",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("text", sa.String(500), nullable=False),
        sa.Column("start_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("end_datetime > start_datetime"),
    )


def downgrade() -> None:
    op.drop_table("alerts")

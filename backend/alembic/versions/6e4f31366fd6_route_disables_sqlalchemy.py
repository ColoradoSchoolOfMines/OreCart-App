"""route_disables sqlalchemy

Revision ID: 6e4f31366fd6
Revises: bf87ca24da04
Create Date: 2024-01-16 21:06:40.199921

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6e4f31366fd6"
down_revision: Union[str, None] = "bf87ca24da04"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("route_disables")
    op.create_table(
        "route_disables",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "alert_id",
            sa.Integer,
            sa.ForeignKey("alerts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "route_id",
            sa.Integer,
            sa.ForeignKey("routes.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("route_disables")

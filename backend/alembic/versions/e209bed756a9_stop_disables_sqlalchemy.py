"""stop_disables sqlalchemy

Revision ID: e209bed756a9
Revises: eca3b859c6ae
Create Date: 2024-01-16 21:06:39.857586

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e209bed756a9"
down_revision: Union[str, None] = "eca3b859c6ae"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("stop_disables")
    op.create_table(
        "stop_disables",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "alert_id",
            sa.Integer,
            sa.ForeignKey("alerts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "stop_id",
            sa.Integer,
            sa.ForeignKey("stops.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("stop_disables")

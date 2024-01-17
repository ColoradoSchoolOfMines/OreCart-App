"""create stop_disables table

Revision ID: c3c081cb6ba8
Revises: b8ce06a37505
Create Date: 2023-10-05 13:24:21.692774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "c3c081cb6ba8"
down_revision: Union[str, None] = "b8ce06a37505"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("stop_disables")
    op.create_table(
        "stop_disables",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("alert_id", sa.Integer, sa.ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stop_id", sa.Integer, sa.ForeignKey("stops.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("stop_disables")

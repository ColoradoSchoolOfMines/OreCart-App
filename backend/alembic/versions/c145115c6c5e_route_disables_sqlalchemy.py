"""create route_disables table

Revision ID: e74cdc7a92b6
Revises: 3e3261e602b0
Create Date: 2023-10-04 17:40:30.795226

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = "e74cdc7a92b6"
down_revision: Union[str, None] = "3e3261e602b0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("route_disables")
    op.create_table(
        "route_disables",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("alert_id", sa.Integer, sa.ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id", ondelete="CASCADE"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("route_disables")

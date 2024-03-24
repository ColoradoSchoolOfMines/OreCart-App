"""create van tracker session table

Revision ID: 43451376c0bf
Revises: 8166e12f260c
Create Date: 2024-03-11 14:07:02.375363

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "43451376c0bf"
down_revision: Union[str, None] = "8166e12f260c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "van_tracker_session",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "created_at", sa.DateTime, nullable=False, server_default=sa.func.now() # pylint: disable=all
        ),
        sa.Column(
            "updated_at",
            sa.DateTime,
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.Column("van_guid", sa.String, nullable=False),
        sa.Column("route_id", sa.Integer, nullable=False),
        sa.Column("stop_index", sa.Integer, nullable=False, server_default="-1"),
        sa.Column("dead", sa.Boolean, nullable=False, default=False),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE van_tracker_session CASCADE;
    """
    )

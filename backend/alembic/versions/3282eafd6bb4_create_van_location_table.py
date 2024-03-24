"""create van location table

Revision ID: 3282eafd6bb4
Revises: 43451376c0bf
Create Date: 2024-03-11 14:23:32.098485

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3282eafd6bb4"
down_revision: Union[str, None] = "43451376c0bf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "van_location",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "created_at", sa.DateTime, nullable=False, server_default=sa.func.now() # pylint: disable=all
        ),
        sa.Column("session_id", sa.Integer, nullable=False),
        sa.Column("lat", sa.Float, nullable=False),
        sa.Column("lon", sa.Float, nullable=False),
        sa.ForeignKeyConstraint(["session_id"], ["van_tracker_session.id"]),
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE van_location CASCADE;
    """
    )

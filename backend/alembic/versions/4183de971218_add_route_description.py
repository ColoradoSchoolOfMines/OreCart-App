"""add route description

Revision ID: 4183de971218
Revises: 8166e12f260c
Create Date: 2024-03-24 12:31:02.141874

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "4183de971218"
down_revision: Union[str, None] = "8166e12f260c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "routes",
        sa.Column("description", sa.String(255), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("routes", "description")

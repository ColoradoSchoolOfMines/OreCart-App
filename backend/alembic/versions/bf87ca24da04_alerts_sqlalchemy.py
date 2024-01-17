"""alerts sqlalchemy

Revision ID: bf87ca24da04
Revises: e209bed756a9
Create Date: 2024-01-16 21:06:40.019353

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "bf87ca24da04"
down_revision: Union[str, None] = "e209bed756a9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

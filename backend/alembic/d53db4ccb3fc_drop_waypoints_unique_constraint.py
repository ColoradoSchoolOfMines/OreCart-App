"""drop_waypoints_unique_constraint

Revision ID: d53db4ccb3fc
Revises: 1a8780dd5bbc
Create Date: 2024-02-12 16:40:59.175048

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d53db4ccb3fc"
down_revision: Union[str, None] = "1a8780dd5bbc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("waypoints_lat_lon_key", "waypoints", type_="unique")


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.waypoints;
    """
    )

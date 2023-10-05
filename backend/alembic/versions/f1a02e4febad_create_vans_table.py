"""create vans table

Revision ID: f1a02e4febad
Revises: 174e5a759f2d
Create Date: 2023-10-04 17:31:57.484449

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "f1a02e4febad"
down_revision: Union[str, None] = "174e5a759f2d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.vans (
	        id serial PRIMARY KEY,
	        wheelchair bool NOT NULL
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.vans;
    """
    )

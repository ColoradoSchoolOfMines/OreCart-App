"""create routes table

Revision ID: 311f80f8b8dd
Revises: 174e5a759f2d
Create Date: 2023-10-04 17:32:02.895752

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "311f80f8b8dd"
down_revision: Union[str, None] = "174e5a759f2d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.routes (
	        id serial PRIMARY KEY,
	        name varchar(255) NOT NULL,
	        UNIQUE (name)
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.routes;
    """
    )

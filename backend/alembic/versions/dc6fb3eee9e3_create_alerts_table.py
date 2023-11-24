"""create alerts table

Revision ID: dc6fb3eee9e3
Revises: 
Create Date: 2023-10-04 17:24:21.822457

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "dc6fb3eee9e3"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.alerts (
	        id serial PRIMARY KEY,
	        text VARCHAR(500) NOT NULL,
	        start_datetime timestamptz NOT NULL,
	        end_datetime timestamptz NOT NULL CHECK (end_datetime > start_datetime)
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.alerts;
    """
    )

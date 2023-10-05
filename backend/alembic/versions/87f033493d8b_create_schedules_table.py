"""create schedules table

Revision ID: 87f033493d8b
Revises: 311f80f8b8dd
Create Date: 2023-10-04 17:35:29.449383

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "87f033493d8b"
down_revision: Union[str, None] = "311f80f8b8dd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.schedules (
	        id serial PRIMARY KEY,
	        route_id int NOT NULL,
	        dow int NOT NULL CHECK (dow >= 0 AND dow <= 6), -- Sunday is 0 (https://www.postgresql.org/docs/8.1/functions-datetime.html)
	        start_time time NOT NULL,
	        end_time time NOT NULL CHECK (end_time > start_time),
	        UNIQUE (route_id, dow),
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE CASCADE
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.schedules;
    """
    )

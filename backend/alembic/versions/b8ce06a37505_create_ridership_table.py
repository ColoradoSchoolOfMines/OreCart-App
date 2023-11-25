"""create ridership table

Revision ID: b8ce06a37505
Revises: e74cdc7a92b6
Create Date: 2023-10-04 17:40:44.364879

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b8ce06a37505"
down_revision: Union[str, None] = "e74cdc7a92b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.ridership (
	        id serial PRIMARY KEY,
	        van_id int NOT NULL,
	        route_id int NOT NULL,
	        entered int NOT NULL,
	        exited int NOT NULL,
	        lat float8 NOT NULL,
	        lon float8 NOT NULL,
	        datetime timestamptz NOT NULL,
	        UNIQUE (van_id, datetime),
	        FOREIGN KEY (van_id)
		        REFERENCES vans (id)
		        ON DELETE CASCADE,
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE CASCADE
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.ridership;
    """
    )

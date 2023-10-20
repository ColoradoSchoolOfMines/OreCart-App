"""create route_stops table

Revision ID: 3e3261e602b0
Revises: 233206860d70
Create Date: 2023-10-04 17:40:15.926603

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3e3261e602b0"
down_revision: Union[str, None] = "233206860d70"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.route_stops (
	        id serial PRIMARY KEY,
	        route_id int NOT NULL,
	        stop_id int NOT NULL,
	        UNIQUE (route_id, stop_id),
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE CASCADE,
	        FOREIGN KEY (stop_id)
		        REFERENCES stops (id)
		        ON DELETE CASCADE
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.route_stops;
    """
    )

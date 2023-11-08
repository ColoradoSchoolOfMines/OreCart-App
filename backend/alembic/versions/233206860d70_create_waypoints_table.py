"""create waypoints table

Revision ID: 233206860d70
Revises: 87f033493d8b
Create Date: 2023-10-04 17:35:37.020567

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "233206860d70"
down_revision: Union[str, None] = "87f033493d8b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.waypoints (
	        id serial PRIMARY KEY,
	        route_id int NOT NULL,
	        lat float8 NOT NULL,
	        lon float8 NOT NULL,
	        UNIQUE (route_id, lat, lon),
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.waypoints;
    """
    )

"""create analytics table

Revision ID: 2bdc34922dc8
Revises: c3c081cb6ba8
Create Date: 2023-11-07 17:52:12.971360

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '2bdc34922dc8'
down_revision: Union[str, None] = 'c3c081cb6ba8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.route_analytics (
	        id serial PRIMARY KEY,
	        route_id int NOT NULL,
	        time_stamp timestamp NOT NULL,
	        UNIQUE (route_id),
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE CASCADE
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.route_analytics;
    """
    )

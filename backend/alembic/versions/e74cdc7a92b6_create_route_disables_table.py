"""create route_disables table

Revision ID: e74cdc7a92b6
Revises: 3e3261e602b0
Create Date: 2023-10-04 17:40:30.795226

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e74cdc7a92b6"
down_revision: Union[str, None] = "3e3261e602b0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.route_disables (
	        id serial PRIMARY KEY,
	        alert_id int NOT NULL,
	        route_id int NOT NULL,
	        FOREIGN KEY (alert_id)
		        REFERENCES alerts (id)
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
        DROP TABLE IF EXISTS public.route_disables;
    """
    )

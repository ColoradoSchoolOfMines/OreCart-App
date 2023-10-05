"""create stop_disables table

Revision ID: c3c081cb6ba8
Revises: b8ce06a37505
Create Date: 2023-10-05 13:24:21.692774

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'c3c081cb6ba8'
down_revision: Union[str, None] = 'b8ce06a37505'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.stop_disables (
	        id serial PRIMARY KEY,
	        alert_id int NOT NULL,
	        stop_id int NOT NULL,
	        FOREIGN KEY (alert_id)
		        REFERENCES alerts (id)
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
        DROP TABLE IF EXISTS public.stop_disables;
    """
    )

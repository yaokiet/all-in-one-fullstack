"""Add Team table

Revision ID: 8cd231779c26
Revises: 1e2bf9c81bc5
Create Date: 2024-09-23 14:30:48.589096

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8cd231779c26'
down_revision = '1e2bf9c81bc5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Team_Size', sa.Integer(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.drop_column('Team_Size')

    # ### end Alembic commands ###

"""Apply changes

Revision ID: 6b17e5cde7ce
Revises: cfdefae8dbff
Create Date: 2024-10-13 02:45:53.223123

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b17e5cde7ce'
down_revision = 'cfdefae8dbff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Reason', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.drop_column('Reason')

    # ### end Alembic commands ###
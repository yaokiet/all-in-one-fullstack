"""Allow NULL for Approval_Date in work_arrangements

Revision ID: ae57f3036e13
Revises: 0e43bca70a54
Create Date: 2024-09-21 22:14:56.383760

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'ae57f3036e13'
down_revision = '0e43bca70a54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.alter_column('Approval_Date',
               existing_type=mysql.DATETIME(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.alter_column('Approval_Date',
               existing_type=mysql.DATETIME(),
               nullable=False)

    # ### end Alembic commands ###

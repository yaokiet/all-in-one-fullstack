"""Add Team table

Revision ID: cae584d7a219
Revises: 2940022f1ec0
Create Date: 2024-09-23 14:14:42.951442

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'cae584d7a219'
down_revision = '2940022f1ec0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('Team_Name',
               existing_type=mysql.VARCHAR(length=20),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('Team_Name',
               existing_type=mysql.VARCHAR(length=20),
               nullable=False)

    # ### end Alembic commands ###

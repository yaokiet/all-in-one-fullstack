"""repopulating server

Revision ID: e7f3f367e45c
Revises: bed56282f21c
Create Date: 2024-11-04 22:19:36.042442

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7f3f367e45c'
down_revision = 'bed56282f21c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employees',
    sa.Column('Staff_ID', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('Reporting_Manager', sa.Integer(), nullable=True),
    sa.Column('Staff_FName', sa.String(length=50), nullable=False),
    sa.Column('Staff_LName', sa.String(length=50), nullable=False),
    sa.Column('Dept', sa.String(length=50), nullable=False),
    sa.Column('Position', sa.String(length=50), nullable=False),
    sa.Column('Country', sa.String(length=50), nullable=False),
    sa.Column('Email', sa.String(length=50), nullable=False),
    sa.Column('Role', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['Reporting_Manager'], ['employees.Staff_ID'], ),
    sa.PrimaryKeyConstraint('Staff_ID')
    )
    op.create_table('work_arrangements',
    sa.Column('Arrangement_ID', sa.Integer(), nullable=False),
    sa.Column('Staff_ID', sa.Integer(), nullable=False),
    sa.Column('Approving_ID', sa.Integer(), nullable=False),
    sa.Column('Arrangement_Type', sa.String(length=20), nullable=False),
    sa.Column('Arrangement_Date', sa.Date(), nullable=False),
    sa.Column('Status', sa.String(length=20), nullable=False),
    sa.Column('Application_Date', sa.DateTime(), nullable=False),
    sa.Column('Approval_Date', sa.DateTime(), nullable=True),
    sa.Column('Reason', sa.String(length=255), nullable=True),
    sa.Column('Manager_Reason', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['Approving_ID'], ['employees.Staff_ID'], ),
    sa.ForeignKeyConstraint(['Staff_ID'], ['employees.Staff_ID'], ),
    sa.PrimaryKeyConstraint('Arrangement_ID')
    )
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_work_arrangements_Approving_ID'), ['Approving_ID'], unique=False)
        batch_op.create_index(batch_op.f('ix_work_arrangements_Staff_ID'), ['Staff_ID'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_arrangements', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_work_arrangements_Staff_ID'))
        batch_op.drop_index(batch_op.f('ix_work_arrangements_Approving_ID'))

    op.drop_table('work_arrangements')
    op.drop_table('employees')
    # ### end Alembic commands ###
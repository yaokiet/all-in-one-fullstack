import pytest
from app import create_app
from extensions import db
from models.arrangement import Arrangement
from models.employee import Employee
from datetime import date, datetime, timedelta
from config import TestingConfig
from flask import session

# To ensure pytest can find the app, run 
# export PYTHONPATH=/Users/joelsng/Documents/GitHub/all-in-one-fullstack/server:$PYTHONPATH
# ensure that the file path fits your directory
# 

@pytest.fixture
def client():
    # Set up Flask test client and application context
    app = create_app(TestingConfig)

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the test tables
            yield client
            db.session.remove()  # Clean up the database session
            db.drop_all()  # Drop the test tables after tests are done

def create_dummy_employee(client, email, staff_fname="John", staff_lname="Doe", manager_id=None):
    with client.application.app_context():  # Ensure operations happen within app context
        employee = Employee(
            Staff_FName=staff_fname,
            Staff_LName=staff_lname,
            Dept="Engineering",
            Position="Software Engineer",
            Country="USA",
            Email=email,
            Role=1,
            Reporting_Manager=manager_id
        )
        db.session.add(employee)
        db.session.commit()
        return employee.Staff_ID  # Return the Staff_ID for use in tests

def create_work_arrangement(client, staff_id, arrangement_type, arrangement_date, status='Pending'):
    with client.application.app_context():  # Ensure operations happen within app context
        arrangement = Arrangement(
            Staff_ID=staff_id,
            Approving_ID=staff_id,
            Arrangement_Type=arrangement_type,
            Arrangement_Date=arrangement_date,
            Status=status,
            Application_Date=datetime.now(),
            Approval_Date=datetime.now() if status == 'Approved' else None
        )
        db.session.add(arrangement)
        db.session.commit()
        
def login_user(client, email="john.doe@example.com"):
    """Helper function to log a user in."""
    response = client.post('/login', json={
        'email': email,
        'password': 'tieguanyin'
    })
    assert response.status_code == 200  # Ensure login was successful
    return response.get_json()['employee_id']

        
def test_team_members(client):
    pass


def test_team_arrangements_with_count(client):
    pass
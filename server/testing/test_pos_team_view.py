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
        
def login_user(client, email="john.doe@example.com", password="password123"):
    """Helper function to log a user in."""
    response = client.post('/login', json={
        'email': email,
        'password': 'tieguanyin'
    })
    assert response.status_code == 200  # Ensure login was successful
    return response.get_json()['employee_id']

        
def test_team_members(client):
    # Step 1: Create manager and team members
    manager_id = create_dummy_employee(client, staff_fname="Manager", staff_lname="Test", email="manager@example.com")
    team_member1_id = create_dummy_employee(client, staff_fname="Team", staff_lname="Member1", email = "team_member1@example.com", manager_id=manager_id)
    team_member2_id = create_dummy_employee(client, staff_fname="Team", staff_lname="Member2", email="team_member2@example.com", manager_id=manager_id)

    # Step 2: Log in as the manager
    logged_in_employee_id = login_user(client, email="manager@example.com", password="password123")
    assert logged_in_employee_id == manager_id

    # Step 3: Make a GET request to retrieve the team members
    response = client.get('/team_members')
    assert response.status_code == 200  # Ensure request is successful

    response_json = response.get_json()
    assert "team_members" in response_json
    assert len(response_json['team_members']) == 2  # Manager should have 2 team members
    assert response_json['team_size'] == 2


def test_team_arrangements_with_count(client):
    pass
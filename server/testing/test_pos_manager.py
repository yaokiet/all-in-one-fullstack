import pytest
from app import create_app
from extensions import db
from models.arrangement import Arrangement
from models.employee import Employee
from datetime import date, datetime, timedelta
from config import TestingConfig
from flask import session
from unittest.mock import patch
import json


@pytest.fixture
def client():
    app = create_app(TestingConfig)
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()  # Drop all tables to ensure no data persistence
            db.create_all()  # Recreate tables fresh
        yield client
        with app.app_context():
            db.drop_all()  # Clean up after each test


def create_dummy_employee(client, email, staff_fname="John", staff_lname="Doe", manager_id=None):
    with client.application.app_context():  # Ensure operations happen within app context
        employee = Employee(
            Staff_FName=staff_fname,
            Staff_LName=staff_lname,
            Dept="Engineering",
            Position="Engineer",
            Country="USA",
            Email=email,
            Role=1,
            Reporting_Manager=manager_id
        )
        db.session.add(employee)
        db.session.commit()
        return employee.Staff_ID  # Return the Staff_ID for use in tests

def create_work_arrangement(client, staff_id, arrangement_type, arrangement_date, AM_PM, status='Pending'):
    with client.application.app_context():  # Ensure operations happen within app context
        arrangement = Arrangement(
            Staff_ID=staff_id,
            Approving_ID=staff_id,
            Arrangement_Type=arrangement_type,
            Arrangement_Date=arrangement_date,
            Status=status,
            Application_Date=datetime.now(),
            AM_PM=AM_PM,
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
    
    # Check if login was successful
    assert response.status_code == 200
    response_data = response.get_json()
    print("Login response:", response_data)  # Debugging: Check the login response structure

    # Extract employee_id from session in response data
    return response_data['session']['employee_id']

def test_manager_team_members(client):
    # Setup: Create a big manager and a manager reporting to the big manager
    big_manager_email = "bigmanager@example.com"
    big_manager_id = create_dummy_employee(client, big_manager_email, staff_fname="Big", staff_lname="Manager", manager_id=None)
    
    # Create a manager reporting to the big manager
    manager_email = "manager@example.com"
    manager_id = create_dummy_employee(
        client, 
        manager_email, 
        staff_fname="Manager", 
        staff_lname="Doe", 
        manager_id=big_manager_id, 
    )

    # Create employees reporting to the manager
    staff_id_1 = create_dummy_employee(
        client, 
        "employee1@example.com", 
        staff_fname="Employee1", 
        staff_lname="One", 
        manager_id=manager_id, 
    )
    staff_id_2 = create_dummy_employee(
        client, 
        "employee2@example.com", 
        staff_fname="Employee2", 
        staff_lname="Two", 
        manager_id=manager_id, 
    )
    staff_id_3 = create_dummy_employee(
        client, 
        "employee3@example.com", 
        staff_fname="Employee3", 
        staff_lname="Three", 
        manager_id=manager_id, 
    )
    
    # Log in as the manager
    login_user(client, email=manager_email)

    # Make the GET request to /manager_team_members with position filter
    response = client.get('/manager_team_members?position=Engineer')
    data = response.get_json()

    # Assertions
    assert response.status_code == 200
    assert "team_members" in data
    assert len(data["team_members"]) == 5 
    assert data["team_size"] == 5

# def test_manager_arrangements_with_count(client):
#     # Setup: Create a big manager and a manager reporting to the big manager
#     big_manager_email = "bigmanager@example.com"
#     big_manager_id = create_dummy_employee(client, big_manager_email, staff_fname="Big", staff_lname="Manager", manager_id=None)
    
#     # Create a manager reporting to the big manager
#     manager_email = "manager@example.com"
#     manager_id = create_dummy_employee(
#         client, 
#         manager_email, 
#         staff_fname="Manager", 
#         staff_lname="Doe", 
#         manager_id=big_manager_id, 
#     )

#     start_date = date.today()
#     end_date = start_date + timedelta(days=6)
    

#     team_members_mock_response = {
#     "team_members": [
#         {"staff_id": 1, "country": "USA", "dept": "Engineering", "email": "employee1@example.com", "position": "Software Engineer", "reporting_manager": 1, "role": 1, "staff_fname": "Employee1", "staff_lname": "One"},
#         {"staff_id": 2, "country": "USA", "dept": "Engineering", "email": "employee2@example.com", "position": "Software Engineer", "reporting_manager": 1, "role": 1, "staff_fname": "Employee2", "staff_lname": "Two"},
#         # Add other team members as needed
#         ]
#     }

#     arrangements_mock_response = [
#         {"staff_id": 1, "arrangement_date": start_date.strftime('%Y-%m-%d'), "arrangement_type": "WFH", "status": "Approved", "am_pm": "AM"},
#         # Add other arrangements for test data
#     ]

#     # Mock the requests.get calls
#     with patch('requests.get') as mock_get:
#         # Set up the mock to return the team members data
#         mock_get.side_effect = lambda url, headers=None: \
#             unittest.mock.Mock(status_code=200, json=lambda: team_members_mock_response) if "/team_members" in url \
#             else unittest.mock.Mock(status_code=200, json=lambda: arrangements_mock_response)

#         # Log in as the manager and make the request to fetch team arrangements
#         login_user(client, email=manager_email)
#         response = client.get(f'manager_arrangements_with_count/?start_date={start_date}&end_date={end_date}&position=Engineer')
#         data = response.get_json()

#         # Print for debugging
#         print("Team Arrangements Response:", json.dumps(data, indent=4))

#         # Assertions for the daily_data structure
#         assert response.status_code == 200
#         assert "daily_data" in data
#         assert len(data["daily_data"]) == 7  # Check for 7 days of data

#         # Example validation on the first day's in-office and WFH counts
#         start_date_str = start_date.strftime('%Y-%m-%d')
#         assert data["daily_data"][start_date_str]["in_office_count_am"] == 0  # Expecting 0 due to both WFH
#         assert data["daily_data"][start_date_str]["wfh_count_am"] == 2  # Expecting 2 due to both WFH

#         # Further assertions for `team_members` and `team_arrangements` in `data`
#         assert len(data["team_members"]) == len(team_members_mock_response["team_members"])



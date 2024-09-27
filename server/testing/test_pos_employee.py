import pytest
from app import create_app
from extensions import db
from models.employee import Employee
from models.arrangement import Arrangement
from config import TestingConfig
from datetime import datetime

# To ensure pytest can find the app, run 
# export PYTHONPATH=/Users/joelsng/Documents/GitHub/all-in-one-fullstack/server:$PYTHONPATH
# ensure that the file path fits your directory

@pytest.fixture
def client():
    # Set up Flask test client and application context
    app = create_app(TestingConfig)
    # app.config['TESTING'] = True
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database for testing

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the test tables
        yield client

        with app.app_context():
            db.drop_all()  # Drop the test tables after tests are done


def test_get_all_employees(client):
    response = client.get(f'/employees')
    assert response.status_code == 200
    
def test_create_employee(client):
    # 0. Declare created_employee_id as global to use in future tests
    global created_employee_id
    # 1. Prepare dummy employee data
    staff_fname = "Mr. Test"
    employee_data = {
        "staff_fname": staff_fname,
        "staff_lname": "Test",
        "dept": "Engineering",
        "position": "Software Engineer",
        "country": "USA",
        "email": "john.doe@example.com",
        "role": 1,
        "reporting_manager": None
    }
    # 2. Make Post request
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee_json = response.get_json()
    
    assert employee_json['employee']['staff_fname'] == staff_fname
    created_employee_id = employee_json['employee']['staff_id']

    # Step 3: Verify that the employee was created
    response = client.get(f'/employees/{created_employee_id}')
    assert response.status_code == 200

def test_create_and_delete_employee(client):
    # Step 1: Create a new dummy employee
    employee_data = {
        "staff_fname": "John",
        "staff_lname": "Doe",
        "dept": "Engineering",
        "position": "Software Engineer",
        "country": "USA",
        "email": "john.doe@example.com",
        "role": 1,
        "reporting_manager": None  # No manager for this test case
    }

    # Step 2: Create the employee by making a POST request
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee_json = response.get_json()
    
    assert employee_json['employee']['staff_fname'] == "John"
    created_employee_id = employee_json['employee']['staff_id']

    # Step 3: Verify that the employee was created
    response = client.get(f'/employees/{created_employee_id}')
    assert response.status_code == 200
    employee_json = response.get_json()
    assert employee_json['staff_fname'] == "John"

    # Step 4: Delete the employee
    delete_response = client.delete(f'/employees/{created_employee_id}')
    assert delete_response.status_code == 200
    delete_json = delete_response.get_json()
    assert delete_json['message'] == f'Employee with staff_id {created_employee_id} deleted successfully'

    # Step 5: Verify that the employee was deleted
    response = client.get(f'/employees/{created_employee_id}')
    assert response.status_code == 404

def test_login(client):
    # Step 1: Create a new dummy employee
    employee_data = {
        "staff_fname": "John",
        "staff_lname": "Doe",
        "dept": "Engineering",
        "position": "Software Engineer",
        "country": "USA",
        "email": "john.doe@example.com",
        "role": 1,
        "reporting_manager": None  # No manager for this test case
    }

    # Step 2: Create the employee by making a POST request
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee_json = response.get_json()
    
    assert employee_json['employee']['staff_fname'] == "John"
    created_employee_id = employee_json['employee']['staff_id']
    
    # Step 3: Make login post request and validate
    login_package = {
        "email":"john.doe@example.com",
        "password":"Abcdefgh1"
    }
    response = client.post('/login',json=login_package)
    assert response.status_code == 200
    
def test_team_arrangements(client):
    # Step 1: Create a manager using the POST /employees route
    manager_data = {
        "staff_fname": "Manager",
        "staff_lname": "Test",
        "dept": "Engineering",
        "position": "Manager",
        "country": "USA",
        "email": "manager@example.com",
        "role": 1
    }
    response = client.post('/employees', json=manager_data)
    assert response.status_code == 201
    manager = response.get_json()['employee']

    # Step 2: Create an employee who reports to the manager using the POST /employees route
    employee_data = {
        "staff_fname": "Employee",
        "staff_lname": "Test",
        "dept": "Engineering",
        "position": "Software Engineer",
        "country": "USA",
        "email": "employee@example.com",
        "role": 1,
        "reporting_manager": manager['staff_id']
    }
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee = response.get_json()['employee']

    # Step 3: Create a WFH arrangement for the employee using the POST /arrangements route
    arrangement_data = {
        "staff_id": employee['staff_id'],
        "approving_id": manager['staff_id'],
        "arrangement_type": "WFH",
        "arrangement_date": "2024-09-21"
    }
    response = client.post('/arrangements', json=arrangement_data)
    assert response.status_code == 201
    arrangement = response.get_json()['arrangement']

    # Step 4: Update the arrangement status to 'Approved' using the PATCH /arrangements/<arrangement_id> route
    update_data = {
        "status": "Approved"
    }
    arrangement_id = arrangement['arrangement_id']  # Use correct 'arrangement_id'
    response = client.patch(f'/arrangements/{arrangement_id}', json=update_data)
    assert response.status_code == 200
    updated_arrangement = response.get_json()['arrangement']
    print(updated_arrangement)


    # Step 5: Send a GET request to the /team_arrangements route to verify the approved arrangement is counted
    response = client.get('/team_arrangements', query_string={
        'staff_id': employee['staff_id'],
        'start_date': '2024-09-20',
        'end_date': '2024-09-22'
    })

    # Step 6: Check the response status code and message
    assert response.status_code == 200
    response_json = response.get_json()

    # Step 7: Validate the response content
    assert response_json['reporting_manager_id'] == manager['staff_id']
    assert response_json['date_range']['start_date'] == '2024-09-20'
    assert response_json['date_range']['end_date'] == '2024-09-22'
    assert response_json['team_arrangements']['2024-09-21']['wfh_count'] == 1
    assert response_json['team_arrangements']['2024-09-21']['in_office_count'] == 0

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

def test_login_and_logout(client):
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
    
    # Step 3: Successful login
    login_package = {
        "email": "john.doe@example.com",
        "password": "tieguanyin"  # Correct password
    }
    response = client.post('/login', json=login_package)
    assert response.status_code == 200
    login_json = response.get_json()
    assert login_json['message'] == 'Login successful'
    
    # Step 6: Logout
    response = client.post('/logout')
    assert response.status_code == 200
    assert 'Logged out successfully' in response.get_json()['message']
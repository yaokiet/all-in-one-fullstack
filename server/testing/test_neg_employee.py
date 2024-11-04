from flask.testing import FlaskClient
import pytest
from app import create_app
from extensions import db
from models.employee import Employee
from config import TestingConfig

@pytest.fixture
def client():
    # Set up Flask test client and application context
    app = create_app(TestingConfig)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the test tables if they don't exist
            yield client
            db.session.rollback()  # Rollback any changes made during tests to avoid unintended data persistence


def test_neg_fetch_nonexistent_employee(client: FlaskClient):
    # Attempt to fetch an employee with a non-existent staff_id
    non_existent_staff_id = 99999  # Assuming this ID does not exist in the database
    
    response = client.get(f'/employees/{non_existent_staff_id}')
    
    assert response.status_code == 404


def test_neg_login_invalid_email(client: FlaskClient):
    pass
    # Step 1: Create a new dummy employee with a valid email
    employee_data = {
        "staff_fname": "Valid",
        "staff_lname": "User",
        "dept": "Engineering",
        "position": "Engineer",
        "country": "USA",
        "email": "valid.user@example.com",
        "role": 1
    }

    # Step 2: Create the employee by making a POST request
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee_json = response.get_json()
    assert employee_json['employee']['email'] == "valid.user@example.com"

    # Step 3: Attempt login with an invalid email
    login_package = {
        "email": "invalid@example.com",  # Invalid email
        "password": "tieguanyin"
    }
    response = client.post('/login', json=login_package)
    assert response.status_code == 400  # Expecting a 400 response for employee not found


def test_neg_login_missing_credentials(client: FlaskClient):
    # Step 1: Create a new dummy employee with valid credentials
    employee_data = {
        "staff_fname": "Missing",
        "staff_lname": "Credentials",
        "dept": "Engineering",
        "position": "Engineer",
        "country": "USA",
        "email": "missing.credentials@example.com",
        "role": 1
    }

    # Step 2: Create the employee by making a POST request
    response = client.post('/employees', json=employee_data)
    assert response.status_code == 201
    employee_json = response.get_json()
    assert employee_json['employee']['email'] == "missing.credentials@example.com"

    # Step 3: Attempt login with missing email
    login_package = {
        "password": "tieguanyin"  # Missing email
    }
    response = client.post('/login', json=login_package)
    assert response.status_code == 400  # Expecting a 400 response for missing credentials
    assert "Email and password are required" in response.get_json()['message']
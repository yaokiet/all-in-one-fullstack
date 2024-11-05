import pytest
from app import create_app
from extensions import db
from models.arrangement import Arrangement
from models.employee import Employee
from datetime import date, datetime, timedelta
from config import TestingConfig

# To ensure pytest can find the app, run 
# export PYTHONPATH=/Users/joelsng/Documents/GitHub/all-in-one-fullstack/server:$PYTHONPATH
# ensure that the file path fits your directory

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

# Adjust `create_dummy_employee` to use `client` for context
def create_dummy_employee(client):
    with client.application.app_context():  # Use the context from the client
        # Create a dummy employee
        employee = Employee(
            Staff_FName="John",
            Staff_LName="Doe",
            Dept="Engineering",
            Position="Software Engineer",
            Country="USA",
            Email="john.doe@example.com",
            Role=1
        )
        db.session.add(employee)
        db.session.commit()
        return employee.Staff_ID  # Return the Staff_ID for foreign key use

def test_invalid_date_range(client):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee(client)

    # Step 2: Set an invalid date range (start date is after end date)
    start_date = (date.today() + timedelta(days=5)).strftime('%Y-%m-%d')  # 5 days in the future
    end_date = date.today().strftime('%Y-%m-%d')  # Today

    # Step 3: Make GET request with invalid date range
    response = client.get(f'/arrangements?staff_id={staff_id}&start_date={start_date}&end_date={end_date}')
    
    # Step 4: Assert that the response status code is 400 (Bad Request)
    assert response.status_code == 400

    # Step 5: Assert that the error message returned matches the expected result
    response_json = response.get_json()
    assert response_json['message'] == 'Invalid date range. Start Date cannot be after End Date.'
    assert response_json['code'] == 400
    
@pytest.mark.parametrize("am_pm", ["AM", "PM"])
def test_create_work_arrangement_missing_fields(client, am_pm):
    # Omit the 'arrangement_date' field
    arrangement_data = {
        "staff_id": create_dummy_employee(client),
        "approving_id": create_dummy_employee(client),
        "arrangement_type": "WFH",
        "AM_PM": am_pm
        # Missing 'arrangement_date'
    }
    response = client.post('/arrangements', json=arrangement_data)
    assert response.status_code == 400
    assert "arrangement_date is required" in response.get_json()['message']

def test_invalid_date_format(client):
    # Create a dummy employee
    staff_id = create_dummy_employee(client)

    # Use an invalid date format
    start_date = '10-01-2024'
    end_date = '10-31-2024'

    response = client.get(f'/arrangements?staff_id={staff_id}&start_date={start_date}&end_date={end_date}')
    assert response.status_code == 400
    assert "Invalid date format" in response.get_json()['message']

def test_update_arrangement_invalid_status(client):
    # Step 1: Create a dummy employee and work arrangement
    staff_id = create_dummy_employee(client)
    arrangement_data = {
        "staff_id": staff_id,
        "approving_id": staff_id,
        "arrangement_type": "WFH",
        "arrangement_date": date.today().strftime('%Y-%m-%d'),
        "AM_PM": "AM"  # Fixed assignment of AM_PM
    }
    response = client.post('/arrangements', json=arrangement_data)
    arrangement = response.get_json()['arrangement']

    # Step 2: Attempt to update status with an invalid value
    update_data = {
        "status": "InvalidStatus"
    }
    response = client.put(f'/arrangements/{arrangement["arrangement_id"]}', json=update_data)
    assert response.status_code == 400  # Adjusted to 400 based on your error code
    assert "Invalid status" in response.get_json()['message']

def test_update_arrangement_missing_status(client):
    # Step 1: Create a dummy employee and work arrangement
    staff_id = create_dummy_employee(client)
    arrangement_data = {
        "staff_id": staff_id,
        "approving_id": staff_id,
        "arrangement_type": "WFH",
        "arrangement_date": date.today().strftime('%Y-%m-%d'),
        "AM_PM": "AM"  # Fixed assignment of AM_PM
    }
    response = client.post('/arrangements', json=arrangement_data)
    arrangement = response.get_json()['arrangement']

    # Step 2: Attempt to update arrangement without providing a status
    response = client.put(f'/arrangements/{arrangement["arrangement_id"]}', json={})
    assert response.status_code == 400  # Adjusted to 400 based on your error code
    assert "Status is required" in response.get_json()['message']

def test_create_work_arrangement_missing_am_pm(client):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee(client)

    # Step 2: Prepare the work arrangement data without the AM_PM field
    arrangement_data = {
        "staff_id": staff_id,
        "approving_id": staff_id,  # Self-approving for test purposes
        "arrangement_type": "WFH",
        "arrangement_date": date.today().strftime('%Y-%m-%d')
    }
    
    # Step 3: Attempt to create the work arrangement without AM_PM
    response = client.post('/arrangements', json=arrangement_data)
    
    # Step 4: Validate the response
    assert response.status_code == 400  # Expecting a 400 Bad Request
    assert "AM_PM is required" in response.get_json()['message']  # Check for specific error message
    
@pytest.mark.parametrize("invalid_am_pm", ["A", "Morning", "Evening", "", None])
def test_create_work_arrangement_invalid_am_pm(client, invalid_am_pm):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee(client)

    # Step 2: Prepare the work arrangement data with an invalid AM_PM value
    arrangement_data = {
        "staff_id": staff_id,
        "approving_id": staff_id,  # Self-approving for test purposes
        "arrangement_type": "WFH",
        "arrangement_date": date.today().strftime('%Y-%m-%d'),
        "AM_PM": invalid_am_pm
    }

    # Step 3: Attempt to create the work arrangement with an invalid AM_PM value
    response = client.post('/arrangements', json=arrangement_data)

    # Step 4: Validate the response
    assert response.status_code == 400  # Expecting a 400 Bad Request
    assert "Invalid value for AM_PM. Please use \"AM\" or \"PM\"" in response.get_json()['message']  # Check for specific error message
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

@pytest.mark.parametrize("am_pm", ["AM", "PM"])
def test_view_own_arrangements_in_date_range(client, am_pm):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee(client)

    # Step 2: Create some work arrangements with specific dates
    today = date.today()
    arrangement1 = Arrangement(
        Staff_ID=staff_id,
        Approving_ID=staff_id,
        Arrangement_Type="WFH",
        Arrangement_Date=today - timedelta(days=3),  # 3 days ago
        AM_PM=am_pm,
        Status="Approved",
        Application_Date=datetime.now(),
        Approval_Date=datetime.now()
    )
    
    arrangement2 = Arrangement(
        Staff_ID=staff_id,
        Approving_ID=staff_id,
        Arrangement_Type="In-Office",
        Arrangement_Date=today + timedelta(days=1),  # Tomorrow
        AM_PM=am_pm,
        Status="Pending",
        Application_Date=datetime.now(),
        Approval_Date=datetime.now()
    )

    arrangement3 = Arrangement(
        Staff_ID=staff_id,
        Approving_ID=staff_id,
        Arrangement_Type="WFH",
        Arrangement_Date=today,  # Today
        AM_PM=am_pm,
        Status="Approved",
        Application_Date=datetime.now(),
        Approval_Date=datetime.now()
    )

    # Use client.application.app_context() to ensure application context
    with client.application.app_context():
        db.session.add_all([arrangement1, arrangement2, arrangement3])
        db.session.commit()

    # Step 3: Make a GET request with a specific date range
    start_date = (today - timedelta(days=5)).strftime('%Y-%m-%d')  # 5 days ago
    end_date = today.strftime('%Y-%m-%d')  # Today

    response = client.get(f'/arrangements?staff_id={staff_id}&start_date={start_date}&end_date={end_date}')
    assert response.status_code == 200  # Check for successful response

    arrangements_json = response.get_json()

    # Step 4: Verify that only the arrangements within the date range are returned
    assert len(arrangements_json) == 2  # arrangement1 and arrangement3 fall within this range
    assert arrangements_json[0]['arrangement_type'] == "WFH"  # arrangement1
    assert arrangements_json[1]['arrangement_type'] == "WFH"  # arrangement3


@pytest.mark.parametrize("am_pm", ["AM", "PM"])
def test_create_work_arrangement(client, am_pm):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee(client)
    
    # Step 2: Prepare the work arrangement data
    arrangement_data = {
        "staff_id": staff_id,
        "approving_id": staff_id,  # Self-approving for test purposes
        "arrangement_type": "WFH",
        "arrangement_date": (date.today() + timedelta(days=1)).strftime('%Y-%m-%d'),  # Tomorrow's date
        "AM_PM": am_pm
    }
    
    # Step 3: Make a POST request to create a work arrangement
    response = client.post('/arrangements', json=arrangement_data)
    assert response.status_code == 201  # Ensure successful creation
    
    arrangement_json = response.get_json()
    
    # Step 4: Verify the returned arrangement details
    assert arrangement_json['arrangement']['staff_id'] == staff_id
    assert arrangement_json['arrangement']['arrangement_type'] == "WFH"
    assert arrangement_json['arrangement']['status'] == "Pending"  # Status should default to "Pending"
    assert arrangement_json['arrangement']['am_pm'] == am_pm
    
    # Step 5: Check if the arrangement was successfully created by querying the GET endpoint
    start_date = date.today().strftime('%Y-%m-%d')
    end_date = (date.today() + timedelta(days=2)).strftime('%Y-%m-%d')  # Check the next two days

    response = client.get(f'/arrangements?staff_id={staff_id}&start_date={start_date}&end_date={end_date}')
    assert response.status_code == 200
    arrangements_json = response.get_json()

    # Verify that the created arrangement is in the response
    assert len(arrangements_json) == 1
    assert arrangements_json[0]['arrangement_type'] == "WFH"
    assert arrangements_json[0]['am_pm'] == am_pm

@pytest.mark.parametrize("am_pm", ["AM", "PM"])
def test_update_work_arrangement_status(client, am_pm):
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
    print(response.get_json())  # Print the error details
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

    # Step 3: Create a work arrangement for the employee using the POST /arrangements route
    arrangement_data = {
        "staff_id": employee['staff_id'],
        "approving_id": manager['staff_id'],  # The approving manager is the staff's manager
        "arrangement_type": "WFH",
        "arrangement_date": "2024-09-21",
        "AM_PM": am_pm
    }
    response = client.post('/arrangements', json=arrangement_data)
    assert response.status_code == 201
    arrangement = response.get_json()['arrangement']

    # Step 4: Update the work arrangement status to 'Approved' using the PATCH /arrangements/<arrangement_id> route
    update_data = {
        "status": "Approved"
    }
    response = client.put(f'/arrangements/{arrangement["arrangement_id"]}', json=update_data)  # Use PUT instead of PATCH
    assert response.status_code == 200
    updated_arrangement = response.get_json()['arrangement']

    # Step 5: Validate that the arrangement status is now 'Approved'
    assert updated_arrangement['status'] == 'Approved'
    assert updated_arrangement['approval_date'] is not None  # Ensure that the approval date is set
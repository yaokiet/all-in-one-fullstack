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
    # Set up Flask test client and application context
    app = create_app(TestingConfig)
    # app.config['TESTING'] = True
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database for testing

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the test tables
            yield client
            db.session.remove()  # Clean up the database session
            db.drop_all()  # Drop the test tables after tests are done

def create_dummy_employee():
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
    staff_id = create_dummy_employee()

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
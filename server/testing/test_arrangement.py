import pytest
from app import create_app
from extensions import db
from models.arrangement import Arrangement
from models.employee import Employee
from datetime import date, datetime

@pytest.fixture
def client():
    # Set up Flask test client and application context
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database for testing

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

def test_view_all_arrangements(client):
    # Step 1: Create a dummy employee to satisfy foreign key constraints
    staff_id = create_dummy_employee()

    # Step 2: Create a few arrangements for testing
    arrangement1 = Arrangement(
        Staff_ID=staff_id,
        Approving_ID=staff_id,
        Arrangement_Type="WFH",
        Arrangement_Date=date.today(),
        Status="Approved",
        Application_Date=datetime.now(),
        Approval_Date=datetime.now()
    )
    
    arrangement2 = Arrangement(
        Staff_ID=staff_id,
        Approving_ID=staff_id,
        Arrangement_Type="In-Office",
        Arrangement_Date=date.today(),
        Status="Pending",
        Application_Date=datetime.now(),
        Approval_Date=datetime.now()
    )

    db.session.add(arrangement1)
    db.session.add(arrangement2)
    db.session.commit()

    # Step 3: Make GET request to retrieve all arrangements
    response = client.get('/arrangements_all')
    assert response.status_code == 200  # Check for successful response

    arrangements_json = response.get_json()

    # Step 4: Verify that the response contains both arrangements
    assert len(arrangements_json) == 2  # Two arrangements were created
    assert arrangements_json[0]['arrangement_type'] == "WFH"
    assert arrangements_json[1]['arrangement_type'] == "In-Office"

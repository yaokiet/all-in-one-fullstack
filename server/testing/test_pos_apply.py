import pytest
from app import create_app
from extensions import db
from models.arrangement import Arrangement
from models.employee import Employee
from datetime import date, datetime, timedelta
from config import TestingConfig
from flask import session
from datetime import datetime
import unittest
from unittest.mock import patch


@pytest.fixture
def client():
    app = create_app(TestingConfig)
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def create_dummy_employee(client, email="john.doe@example.com", staff_fname="John", staff_lname="Doe", dept="Engineering", 
                          position="Software Engineer", country="USA", role=1, manager_id=None):
    with client.application.app_context():
        employee = Employee(
            Staff_FName=staff_fname,
            Staff_LName=staff_lname,
            Dept=dept,
            Position=position,
            Country=country,
            Email=email,
            Role=role,
            Reporting_Manager=manager_id
        )
        db.session.add(employee)
        db.session.commit()
        return employee.Staff_ID

def create_dummy_manager(client, email="john.doeboss@example.com", staff_fname="Boss", staff_lname="Doe", dept="Engineering", 
                          position="Software Engineer", country="USA", role=1, staff_id = 122, manager_id=None):
    with client.application.app_context():
        employee = Employee(
            Staff_FName=staff_fname,
            Staff_LName=staff_lname,
            Dept=dept,
            Position=position,
            Country=country,
            Email=email,
            Role=role,
            Reporting_Manager=manager_id,
        )
        db.session.add(employee)
        db.session.commit()
        return employee.Staff_ID

def create_work_arrangement(client, staff_id, arrangement_type="WFH", arrangement_date=datetime.now().date(), am_pm="AM", status='Pending'):
    arrangement_date = arrangement_date or date.today()
    with client.application.app_context():
        arrangement = Arrangement(
            Staff_ID=staff_id,
            Approving_ID=staff_id,
            Arrangement_Type=arrangement_type,
            Arrangement_Date=arrangement_date,
            Status=status,
            Application_Date=datetime.now(),
            AM_PM=am_pm,
            Approval_Date=datetime.now() if status == 'Approved' else None
        )
        db.session.add(arrangement)
        db.session.commit()
        return arrangement.Arrangement_ID

def test_get_arrangements_without_login(client):
    response = client.get('/apply?filter=upcoming')
    assert response.status_code == 403
    assert response.get_json()['message'] == 'You must be logged in.'

def test_get_upcoming_arrangements_invalid(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id

    response = client.get('/apply?filter=upcoming')
    assert response.status_code == 404
    assert "Manager" in response.get_json()['message']

# def test_get_upcoming_arrangements_valid(client):
#     staff_id = create_dummy_employee(client)
#     with client.session_transaction() as session:
#         session['employee_id'] = staff_id

#     response = client.get('/apply?filter=upcoming')
#     assert response.status_code == 200

    # assert 'arrangements' in response.get_json()
    # assert isinstance(response.get_json()['arrangements'], list)

def test_apply_arrangement_missing_data(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id

    response = client.post('/apply', json={})
    assert response.status_code == 400
    assert "Arrangement dates and reason are required" in response.get_json()['message']

def test_apply_arrangement_conflict(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id
        session['reporting_manager'] = staff_id

    arrangement_date = date.today().strftime('%Y-%m-%d')
    arrangement_data = {
        "arrangement_dates": [arrangement_date],
        "reason": "Doctor appointment",
        "arrangement_type": "WFH",
        "am_pm": "AM"
    }
    client.post('/apply', json=arrangement_data)
    response = client.post('/apply', json=arrangement_data)
    assert response.status_code == 409
    assert "An arrangement for" in response.get_json()['message']

def test_delete_arrangement_not_found(client):
    response = client.delete('/apply/999')
    assert response.status_code == 404
    assert "Arrangement not found" in response.get_json()['message']

def test_delete_arrangement_success(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id
        session['reporting_manager'] = staff_id

    arrangement_id = create_work_arrangement(client, staff_id, arrangement_date=date.today())
    delete_response = client.delete(f'/apply/{arrangement_id}')
    assert delete_response.status_code == 200
    assert "Arrangement deleted successfully" in delete_response.get_json()['message']

def test_manager_view_arrangements_invalid_filter(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id

    response = client.get('/apply/manager?filter=invalid')
    assert response.status_code == 400
    assert "Invalid filter type" in response.get_json()['message']

def test_manager_approve_arrangement_valid_status(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id
        session['reporting_manager'] = staff_id

    arrangement_id = create_work_arrangement(client, staff_id, arrangement_date=date.today())
    update_data = {
        "arrangement_id": arrangement_id,
        "status": "Approved",
        "manager_reason": "nice"
    }
    response = client.put('/apply/manager', json=update_data)
    assert response.status_code == 200
    assert "Arrangement status updated successfully" in response.get_json()['message']

def test_manager_approve_arrangement_success(client):
    staff_id = create_dummy_employee(client)
    with client.session_transaction() as session:
        session['employee_id'] = staff_id
        session['reporting_manager'] = staff_id

    arrangement_id = create_work_arrangement(client, staff_id, arrangement_date=date.today())
    update_data = {
        "arrangement_id": arrangement_id,
        "status": "Approved",
        "manager_reason": "Approved for client meeting"
    }
    response = client.put('/apply/manager', json=update_data)
    assert response.status_code == 200
    assert "Arrangement status updated successfully" in response.get_json()['message']
    assert response.get_json()['arrangement']['status'] == "Approved"

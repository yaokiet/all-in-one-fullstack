import pytest
from app import create_app
from extensions import db
from models.employee import Employee
from config import TestingConfig

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

def test_neg_login_invalid_email(client):
    pass

def test_neg_login_missing_credentials(client):
    pass
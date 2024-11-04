
import os
from dotenv import load_dotenv

load_dotenv()

# class Config:
#     SECRET_KEY = os.getenv('SECRET_KEY', 'defaultsecretkey')
#     SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
class Config:
    """Base config."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = 1800
    DEBUG = False


class DevelopmentConfig(Config):
    """Development config."""
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    DEBUG = True

class TestingConfig(Config):
    """Testing config."""
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory database for testing
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///test_database.db'  # In-memory database for testing
    TESTING = True
    DEBUG = True
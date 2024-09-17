from extensions import db
from datetime import timedelta


class User(db.Model):
    __tablename__ = 'users'

    # Define your columns
    Staff_ID = db.Column(db.Integer, primary_key=True)
    Staff_FName = db.Column(db.String(50), unique=True, nullable=False)  # Consider renaming to staff_fname for consistency
    Email = db.Column(db.String(120), unique=True, nullable=False)
    Role = db.Column(db.Integer, nullable=False)  # Role should likely reference a foreign key or enum for roles

    # Human-readable representation of the object
    def __repr__(self):
        return f'<User {self.Staff_FName}>'

    # Serialize method to convert the object to a dictionary for JSON or API output
    def serialize(self):
        return {
            'Staff_ID': self.Staff_ID,
            'Staff_FName': self.Staff_FName,
            'Email': self.Email,
            'Role': self.Role,
        }

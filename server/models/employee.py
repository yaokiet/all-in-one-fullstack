from extensions import db


class Employee(db.Model):
    __tablename__ = 'employees'

    # Define your columns
    Staff_ID = db.Column(db.Integer, primary_key=True)
    Reporting_Manager = db.Column(db.Integer, db.ForeignKey('employees.Staff_ID'))
    Staff_FName = db.Column(db.String(50), nullable=False) 
    Staff_LName = db.Column(db.String(50), nullable=False) 
    Dept = db.Column(db.String(50), nullable = False)
    Position = db.Column(db.String(50), nullable = False)
    Country = db.Column(db.String(50), nullable = False)
    Email = db.Column(db.String(50), nullable = False)
    Role = db.Column(db.Integer, nullable=False)

    # Self-referential relationship for Reporting_Manager
    manager = db.relationship('Employee', remote_side=[Staff_ID])

    # Serialize method to convert the object to a dictionary for JSON or API output
    def serialize(self):
        return {
            'staff_id': self.Staff_ID,
            'reporting_manager': self.Reporting_Manager,
            'staff_fname': self.Staff_FName,
            'staff_lname': self.Staff_LName,
            'dept': self.Dept,
            'position': self.Position,
            'country': self.Country,
            'email': self.Email,
            'role': self.Role,
        }

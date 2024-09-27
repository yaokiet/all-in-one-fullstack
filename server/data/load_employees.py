import csv
from app import create_app
from extensions import db
from models.employee import Employee

app = create_app()

def load_csv_data(file_path):
    staged_rows = []

    # Open the CSV file
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)

        # Phase 1: Insert all employees without Reporting_Manager
        for row in reader:
            # Fetch the values from the CSV, handle missing/nullable fields
            staff_id = int(row['Staff_ID']) if row['Staff_ID'] else None
            reporting_manager = int(row['Reporting_Manager']) if row['Reporting_Manager'] else None
            staff_fname = row['Staff_FName']
            staff_lname = row['Staff_LName']
            dept = row['Dept']
            position = row['Position']
            country = row['Country']
            email = row['Email']
            role = int(row['Role'])

            # Create a new Employee object without setting Reporting_Manager
            employee = Employee(
                Staff_ID=staff_id,
                Staff_FName=staff_fname,
                Staff_LName=staff_lname,
                Dept=dept,
                Position=position,
                Country=country,
                Email=email,
                Role=role,
                Reporting_Manager=None  # Initially set Reporting_Manager to None
            )
            
            # Add to the session
            db.session.add(employee)

            # Store the row for later update of Reporting_Manager
            staged_rows.append((staff_id, reporting_manager))

        # Commit Phase 1: Insert all employees without Reporting_Manager
        db.session.commit()

        # Phase 2: Update Reporting_Manager for each employee
        for staff_id, reporting_manager in staged_rows:
            if reporting_manager:
                employee = Employee.query.get(staff_id)
                employee.Reporting_Manager = reporting_manager
                db.session.add(employee)

        # Commit Phase 2: Update Reporting_Manager
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        # Load data from the CSV file
        load_csv_data('employeenew.csv')

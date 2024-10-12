from extensions import db
from datetime import datetime, timedelta
from models.arrangement import Arrangement
from app import create_app  

# This file will load test arrangements for a user. this user has been created for testing purposes only
# staff_id = 210045 with reporting_manager 130002
# Mon - WFH Approved
# Tue - WFH Rejected
# Wed - WFH Pending
# Thu - 
# Fri - 

# Constants for staff and approving manager
STAFF_ID = 210045
APPROVING_ID = 130002

def populate_work_arrangements():
    try:
        # Get the current date and calculate the dates for the current week's Monday, Tuesday, and Wednesday
        today = datetime.now()
        monday = today - timedelta(days=today.weekday())  # Get the most recent Monday
        tuesday = monday + timedelta(days=1)
        wednesday = monday + timedelta(days=2)

        # Calculate application and approval dates for each arrangement
        monday_application = monday - timedelta(days=7)
        monday_approval = monday - timedelta(days=5)

        tuesday_application = tuesday - timedelta(days=3)
        tuesday_approval = tuesday - timedelta(days=2)

        wednesday_application = wednesday - timedelta(days=6)

        # Create work arrangements for Monday, Tuesday, and Wednesday
        work_arrangements = [
            Arrangement(
                Staff_ID=STAFF_ID,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=monday,
                Status='Approved',
                Application_Date=monday_application,
                Approval_Date=monday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=tuesday,
                Status='Rejected',
                Application_Date=tuesday_application,
                Approval_Date=tuesday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=wednesday,
                Status='Pending',
                Application_Date=wednesday_application,
                Approval_Date=None  # No approval date since it's pending
            )
        ]

        # Add work arrangements to the session
        db.session.bulk_save_objects(work_arrangements)

        # Commit the changes to the database
        db.session.commit()
        print(f"Work arrangements for staff ID {STAFF_ID} have been inserted for Monday, Tuesday, and Wednesday of the current week.")

    except Exception as e:
        # Rollback in case of any errors
        db.session.rollback()
        print(f"Error while populating work arrangements: {str(e)}")

if __name__ == "__main__":
    # Create the app instance using the factory pattern
    app = create_app()

    # Wrap the code in the Flask app context
    with app.app_context():
        populate_work_arrangements()
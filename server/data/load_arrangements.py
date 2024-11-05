from extensions import db
from datetime import datetime, timedelta
from models.arrangement import Arrangement
# from app import app  # Directly import app from app.py
from app import create_app

# Constants for staff and approving manager
STAFF_ID_1 = 210074
STAFF_ID_2 = 160008
STAFF_ID_3 = 140001
APPROVING_ID = 130002

def populate_work_arrangements():
    try:
        # Get the current date and calculate the dates for the current week's Monday to Friday
        today = datetime.now()
        monday = today - timedelta(days=today.weekday())
        tuesday = monday + timedelta(days=1)
        wednesday = monday + timedelta(days=2)
        thursday = monday + timedelta(days=3)
        friday = monday + timedelta(days=4)

        # Calculate application and approval dates for each arrangement
        monday_application = monday - timedelta(days=7)
        monday_approval = monday - timedelta(days=5)

        tuesday_application = tuesday - timedelta(days=3)
        tuesday_approval = tuesday - timedelta(days=2)

        wednesday_application = wednesday - timedelta(days=6)
        wednesday_approval = wednesday - timedelta(days=3)

        thursday_application = thursday - timedelta(days=3)

        # Create work arrangements for STAFF_ID_1
        work_arrangements_staff_1 = [
            Arrangement(
                Staff_ID=STAFF_ID_1,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=monday,
                AM_PM="AM",
                Status='Approved',
                Application_Date=monday_application,
                Approval_Date=monday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID_1,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=tuesday,
                AM_PM="PM",
                Status='Rejected',
                Application_Date=tuesday_application,
                Approval_Date=tuesday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID_1,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=wednesday,
                AM_PM="AM",
                Status='Pending',
                Application_Date=wednesday_application,
                Approval_Date=None
            )
        ]

        # Create work arrangements for STAFF_ID_2
        work_arrangements_staff_2 = [
            Arrangement(
                Staff_ID=STAFF_ID_2,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=tuesday,
                AM_PM="PM",
                Status='Approved',
                Application_Date=tuesday_application,
                Approval_Date=tuesday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID_2,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=wednesday,
                AM_PM="AM",
                Status='Rejected',
                Application_Date=wednesday_application,
                Approval_Date=wednesday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID_2,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=thursday,
                AM_PM="AM",
                Status='Pending',
                Application_Date=thursday_application,
                Approval_Date=None
            )
        ]

        # Create work arrangements for STAFF_ID_3
        work_arrangements_staff_3 = [
            Arrangement(
                Staff_ID=STAFF_ID_3,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=wednesday,
                AM_PM="PM",
                Status='Approved',
                Application_Date=wednesday_application,
                Approval_Date=wednesday_approval
            ),
            Arrangement(
                Staff_ID=STAFF_ID_3,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=thursday,
                AM_PM="PM",
                Status='Rejected',
                Application_Date=thursday_application,
                Approval_Date=None
            ),
            Arrangement(
                Staff_ID=STAFF_ID_3,
                Approving_ID=APPROVING_ID,
                Arrangement_Type='WFH',
                Arrangement_Date=friday,
                AM_PM="PM",
                Status='Pending',
                Application_Date=thursday_application,
                Approval_Date=None
            )
        ]

        # Combine all work arrangements
        work_arrangements = work_arrangements_staff_1 + work_arrangements_staff_2 + work_arrangements_staff_3

        # Add work arrangements to the session
        db.session.bulk_save_objects(work_arrangements)

        # Commit the changes to the database
        db.session.commit()
        print(f"Work arrangements for staff IDs {STAFF_ID_1}, {STAFF_ID_2}, and {STAFF_ID_3} have been inserted.")

    except Exception as e:
        # Rollback in case of any errors
        db.session.rollback()
        print(f"Error while populating work arrangements: {str(e)}")

if __name__ == "__main__":
    # Initialize the app using the factory function
    app = create_app()

    # Use the app context directly
    with app.app_context():
        populate_work_arrangements()
from models import Arrangement, Employee
from sqlalchemy import func
from extensions import db

def num_approved(approving_id, day, am_pm):
    try:
        # Count the total employees reporting to the given approving_id
        total_employees = db.session.query(func.count(Employee.Staff_ID)).filter(
            Employee.Reporting_Manager == approving_id
        ).scalar()

        # Count the approved arrangements for the given approving_id, day, and AM_PM
        approved_arrangements = db.session.query(func.count(Arrangement.Arrangement_ID)).filter(
            Arrangement.Approving_ID == approving_id,
            Arrangement.Arrangement_Date == day,
            Arrangement.AM_PM == am_pm,
            Arrangement.Status == 'Approved'
        ).scalar()
        
        # Return results or comparison if needed
        return approved_arrangements >= total_employees // 2

    except Exception as e:
        print(f"Error retrieving data for approving_id {approving_id} on {day}: {e}")
        return {"total_employees": 0, "approved_arrangements": 0}

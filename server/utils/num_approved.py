from models import Arrangement
from sqlalchemy import func

def num_approved(approving_id, day):
    
    try:
        # Count the total arrangements for the given approving_id and day
        total_arrangements = db.session.query(func.count(Arrangement.id)).filter(
            Arrangement.Approving_ID == approving_id,
            Arrangement.Arrangement_Date == day  # Assuming `date` is the column storing the day
        ).scalar()
        
        # Count the approved arrangements for the given approving_id and day
        approved_arrangements = db.session.query(func.count(Arrangement.id)).filter(
            Arrangement.Approving_ID == approving_id,
            Arrangement.Arrangement_Date == day,
            Arrangement.Status == 'Approved'
        ).scalar()
        
        # Compare counts
        return approved_arrangements >= total_arrangements
    
    except Exception as e:
        print(f"Error checking approved arrangements for {day}: {e}")
        return False

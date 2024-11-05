from app import create_app
from extensions import db
from models.arrangement import Arrangement
from datetime import datetime, timedelta

# Initialize the Flask app with application context
app = create_app()
with app.app_context():
    # Calculate the cutoff date (two months ago)
    two_months_ago = datetime.now().date() - timedelta(days=60)
    
    # Query and delete records older than two months
    db.session.query(Arrangement).filter(Arrangement.Arrangement_Date < two_months_ago).delete()
    db.session.commit()
    print("Old records deleted successfully")
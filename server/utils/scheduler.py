# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import datetime, timedelta
# from models.arrangement import Arrangement  # Assuming Arrangement model is in models.py
# from extensions import db

# def update_expired_arrangements():
#     # Calculate the threshold date (2 months ago from today)
#     threshold_date = datetime.now().date() - timedelta(days=60)
    
#     # Query arrangements where the date is past the threshold and status isn't already 'Rejected'
#     expired_arrangements = Arrangement.query.filter(
#         Arrangement.Arrangement_Date <= threshold_date,
#         Arrangement.Status != 'Rejected'
#     ).all()
    
#     # Update the status of each expired arrangement
#     for arrangement in expired_arrangements:
#         arrangement.Status = 'Rejected'
    
#     # Commit changes to the database
#     db.session.commit()

# # Initialize the scheduler and add the job
# def start_scheduler():
#     scheduler = BackgroundScheduler()
#     # Schedule the job to run every day at midnight
#     scheduler.add_job(update_expired_arrangements, 'interval', days=1)
#     scheduler.start()

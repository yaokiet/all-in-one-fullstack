from extensions import db
from models.team import Team
from models.employee import Employee
from app import create_app  # Import the create_app function

def populate_teams():
    try:
        # Query all departments
        departments = db.session.query(Employee.Dept).distinct().all()

        for dept in departments:
            dept_name = dept[0]
            
            # Find the manager for the department
            team_lead = Employee.query.filter_by(Dept=dept_name, Role=3).first()

            if team_lead:
                team_lead_id = team_lead.Staff_ID
            else:
                # If no manager is found, use None or choose another staff member
                team_lead_id = None

            # Create a new team for the department
            new_team = Team(
                Team_Name=f'{dept_name} Team',
                Team_Lead_ID=team_lead_id,
                Dept=dept_name
            )

            # Add the new team to the session
            db.session.add(new_team)

        # Commit all new teams to the database
        db.session.commit()
        print("Teams successfully populated!")

    except Exception as e:
        db.session.rollback()
        print(f"Error while populating teams: {str(e)}")

if __name__ == "__main__":
    # Create the app instance using the factory pattern
    app = create_app()

    # Wrap the code in the Flask app context
    with app.app_context():
        populate_teams()

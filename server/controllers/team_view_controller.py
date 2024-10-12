from flask import Blueprint, request, jsonify, session
from models.employee import Employee
from models.arrangement import Arrangement
from datetime import datetime, timedelta
import requests

# Create a new Blueprint for team view-related routes
team_view_bp = Blueprint('team_view', __name__)

@team_view_bp.route('/team_inoffice_count', methods=['GET'])
def team_inoffice_count():
    staff_id = request.args.get('staff_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # Ensure all required parameters are provided
    if not staff_id or not start_date or not end_date:
        return jsonify({
            'message': 'Staff ID, Start Date, and End Date are required',
            'code': 400
        }), 400

    # Validate the date format
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({
            'message': 'Invalid date format. Please use YYYY-MM-DD',
            'code': 400
        }), 400

    # Ensure start_date is not after end_date
    if start_date > end_date:
        return jsonify({
            'message': 'Invalid date range. Start Date cannot be after End Date.',
            'code': 400
        }), 400

    # Step 1: Query for the employee with the given staff_id
    employee = Employee.query.filter_by(Staff_ID=staff_id).first()

    # Step 2: If the employee exists, retrieve their Reporting_Manager
    if employee:
        manager_id = employee.Reporting_Manager  # Get the manager's Staff_ID
    else:
        return jsonify({"message": "Employee not found"}, 404)

    # Query all employees in the team (those who report to the same Reporting_Manager as the given staff_id)
    team_employees = Employee.query.filter_by(Reporting_Manager=manager_id).all()

    # If no employees are found under the manager
    if not team_employees:
        return jsonify({
            'message': 'No employees found for the given manager',
            'code': 404
        }), 404

    # Create a date range
    date_range = [(start_date + timedelta(days=i)) for i in range((end_date - start_date).days + 1)]

    # Initialize a dictionary to hold the WFH and In-office count for each date
    date_counts = {}

    # Iterate through each date in the range
    for single_date in date_range:
        # Initialize counters for each date
        wfh_count = 0
        in_office_count = 0

        # Iterate through each employee and check their WFH status for the current date
        for employee in team_employees:
            # Check if the employee has an accepted WFH arrangement on the current date
            wfh_arrangement = Arrangement.query.filter_by(Staff_ID=employee.Staff_ID, Arrangement_Type="WFH", Status="Approved") \
                .filter(Arrangement.Arrangement_Date == single_date).first()

            if wfh_arrangement:
                # If WFH arrangement exists on this date, increase WFH count
                wfh_count += 1
            else:
                # Otherwise, count as in-office
                in_office_count += 1

        # Store the counts for this date
        date_counts[single_date.strftime('%Y-%m-%d')] = {
            'wfh_count': wfh_count,
            'in_office_count': in_office_count
        }

    # Return the result with manager_id, date range, and per-date WFH/In-office counts
    return jsonify({
        'reporting_manager_id': manager_id,
        'date_range': {
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        },
        'team_inoffice_count': date_counts
    }), 200

# Given a staff_id of an employee, return all employees who have the same reporting manager
@team_view_bp.route('/team_members', methods=['GET'])
def team_members():
    staff_id = session.get('employee_id')
    print(f"Retrieved staff_id from session: {staff_id}")
    if not staff_id:
        return jsonify({
            "error":"staff_id is required"
        }), 400
    
    # fetch employee with the provided staff id
    employee = Employee.query.filter_by(Staff_ID = staff_id).first()
    
    if not employee:
        return jsonify({
            "error":"Employee not found"
        }),404
        
    reporting_manager_id = employee.Reporting_Manager
    
    if not reporting_manager_id:
        return jsonify({
            "error":"This employee does not have a reporting manager"
        }), 404
    
    team_members = Employee.query.filter_by(Reporting_Manager = reporting_manager_id).all()
    
    if not team_members:
        return jsonify({
            "message":"No team members found for this manager"
        }), 200
    
    result = [member.serialize() for member in team_members]
    
    return jsonify({
        "team_members": result,
        "team_size":len(result)
    }),200
    
@team_view_bp.route('/view_team_arrangements_in_date_range', methods=['GET'])
def view_team_arrangements_in_date_range():
    staff_id = session.get('employee_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Step 1: Validate inputs
    if not staff_id or not start_date or not end_date:
        return jsonify({
            'message': 'Staff ID, Start Date, and End Date are required',
            'code': 400
        }), 400

    try: 
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    except ValueError:
        return jsonify({
            'message': 'Invalid date format. Please use YYYY-MM-DD',
            'code': 400
        }), 400

    if start_date > end_date:
        return jsonify({
            'message': 'Invalid date range. Start Date cannot be after End Date.',
            'code': 400
        }), 400

    # Step 2: Call /team_members API to get the team members
    team_members_url = f'http://localhost:5000/team_members'
    session_cookie = request.cookies.get('session')  # Get the session cookie from the original request
    headers = {'Cookie': f'session={session_cookie}'}  # Set the session cookie in the header
    team_members_response = requests.get(team_members_url, headers=headers)

    
    if team_members_response.status_code != 200:
        return jsonify({
            'message': 'Failed to retrieve team members',
            'code': team_members_response.status_code
        }), team_members_response.status_code

    # Step 3: Parse the response and check structure
    team_members_data = team_members_response.json()
    
    if 'team_members' not in team_members_data or not isinstance(team_members_data['team_members'], list):
        return jsonify({
            'message': 'Invalid response structure from team_members API',
            'code': 500
        }), 500

    # Step 4: Ensure there are team members
    team_members = team_members_data['team_members']
    
    if not team_members:
        return jsonify({
            'message': 'No team members found',
            'code': 404
        }), 404
    # return jsonify(team_members),200
    
    # Step 5: Collect work arrangements for each team member and include their info
    collated_arrangements = []
    for member in team_members:
        member_id = member['staff_id']
        
        # Fetch the arrangements for each team member
        arrangements_url = f'http://localhost:5000/arrangements?staff_id={member_id}&start_date={start_date.strftime("%Y-%m-%d")}&end_date={end_date.strftime("%Y-%m-%d")}'
        arrangements_response = requests.get(arrangements_url)

        if arrangements_response.status_code == 200:
            arrangements = arrangements_response.json()
            # Include both employee info and their arrangements in a single dictionary
            collated_arrangements.append({
                "employee": member,
                "arrangements": arrangements
            })

    # Step 6: Return the collated arrangements
    return jsonify(collated_arrangements), 200


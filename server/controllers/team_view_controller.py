from flask import Blueprint, request, jsonify, session
from models.employee import Employee
from models.arrangement import Arrangement
from datetime import datetime, timedelta
from sqlalchemy import and_
from dotenv import load_dotenv
import os

import requests

# Load environment variables
load_dotenv()

# Get the production URL from the environment variable
PRODUCTION_URL = os.getenv('PRODUCTION_URL')
print(f"Loaded PRODUCTION_URL: {PRODUCTION_URL}")  # Add this line to verify

# Create a new Blueprint for team view-related routes
team_view_bp = Blueprint('team_view', __name__)

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
    position = employee.Position
    
    if not reporting_manager_id:
        return jsonify({
            "error":"This employee does not have a reporting manager"
        }), 404
    
    team_members = Employee.query.filter(
        and_(
            Employee.Reporting_Manager == reporting_manager_id,
            Employee.Position == position
        )
    ).all()    
    if not team_members:
        return jsonify({
            "message":"No team members found for this manager"
        }), 200
    
    result = [member.serialize() for member in team_members]
    
    return jsonify({
        "team_members": result,
        "team_size":len(result)
    }),200

# references a user's reporting manager
@team_view_bp.route('/team_arrangements_with_count', methods=['GET'])
def team_arrangements_with_count():
    staff_id = session.get('employee_id')
    print("staff_id is", staff_id)
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
    team_members_url = f'{PRODUCTION_URL}/team_members'
    session_cookie = request.cookies.get('session')  # Get the session cookie from the original request
    headers = {'Cookie': f'session={session_cookie}'}  # Set the session cookie in the header
    # print(team_members_url)
    print(team_members_url)
    team_members_response = requests.get(team_members_url, headers=headers)
    
    if team_members_response.status_code != 200:
        return jsonify({
            'message': 'Failed to retrieve team members',
            'code': team_members_response.status_code
        }), team_members_response.status_code

    team_members_data = team_members_response.json()
    
    if 'team_members' not in team_members_data or not isinstance(team_members_data['team_members'], list):
        return jsonify({
            'message': 'Invalid response structure from team_members API',
            'code': 500
        }), 500

    team_members = team_members_data['team_members']
    
    if not team_members:
        return jsonify({
            'message': 'No team members found',
            'code': 404
        }), 404

    # Create date range for the output
    date_range = [(start_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range((end_date - start_date).days + 1)]

    # Prepare response data for each date
    daily_data = {
        day: {
            'in_office_count_am': len(team_members),
            'in_office_count_pm': len(team_members),
            'wfh_count_am': 0,
            'wfh_count_pm': 0,
            'total_members': len(team_members), 
            'schedules': []
            } 
            for day in date_range
        }

    # Collect the arrangements for each team member and update the counts
    collated_arrangements = []
    for member in team_members:
        member_id = member['staff_id']
        
        # Fetch the arrangements for each team member
        arrangements_url = f'{PRODUCTION_URL}/arrangements?staff_id={member_id}&start_date={start_date.strftime("%Y-%m-%d")}&end_date={end_date.strftime("%Y-%m-%d")}'
        arrangements_response = requests.get(arrangements_url, headers=headers)

        if arrangements_response.status_code == 200:
            arrangements = arrangements_response.json()

            for arrangement in arrangements:
                arrangement_date = arrangement['arrangement_date']
                arrangement_type = arrangement['arrangement_type']
                arrangement_status = arrangement['status']
                am_pm = arrangement.get('am_pm', 'AM')  # Default to 'AM' if not provided

                if arrangement_date in daily_data:
                    # If WFH, adjust the counts and arrangements accordingly
                    if (arrangement_type == 'WFH' and arrangement_status == 'Approved'):
                        if am_pm == 'AM':
                            daily_data[arrangement_date]['wfh_count_am'] += 1
                            daily_data[arrangement_date]['in_office_count_am'] -= 1
                        else:
                            daily_data[arrangement_date]['wfh_count_pm'] += 1
                            daily_data[arrangement_date]['in_office_count_pm'] -= 1


                    # Add the member's arrangement to the daily schedule
                    daily_data[arrangement_date]['schedules'].append({
                        'member_id': member['staff_id'],
                        'arrangement': arrangement_type,
                        'arrangement_status': arrangement_status,
                        'am_pm': am_pm
                    })

            # Collate the member's arrangement for the full range
            collated_arrangements.append({
                "employee": member,
                "arrangements": arrangements
            })
    # Return the combined response containing both in-office counts and detailed arrangements
    response = {
        'daily_data': daily_data,  # Daily WFH/In-office counts with schedules
        'team_arrangements': collated_arrangements,  # Detailed team arrangements by member
        'team_members': team_members
    }

    return jsonify(response), 200


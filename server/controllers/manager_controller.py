from flask import Blueprint, request, jsonify, session
from models.employee import Employee
from models.arrangement import Arrangement
from datetime import datetime, timedelta
from sqlalchemy import and_
import requests

# Create a new Blueprint for team view-related routes
manager_bp = Blueprint('manager', __name__)

@manager_bp.route('/manager_team_members', methods=['GET'])
def manager_team():
    # Retrieve the optional reporting manager (staff_id) and required position filter
    role = session.get('role')
    staff_id = session.get('employee_id')

    position_filter = request.args.get('position')

    if not position_filter:
        return jsonify({
            "error": "Position parameter is required"
        }), 400

    # Build query based on presence of reporting manager
    query = Employee.query.filter(Employee.Position == position_filter)
    
    if role == 3: 
        query = query.filter(Employee.Reporting_Manager == staff_id)
    
    # Fetch team members based on the built query
    team_members = query.all()
    
    if not team_members:
        return jsonify({
            "message": "No team members found for the specified criteria"
        }), 200

    # Serialize team members to match the desired output format
    serialized_team_members = [member.serialize() for member in team_members]

    # Create the result structure with a flat list of team members
    result = {
        "team_members": serialized_team_members,
        "team_size": len(serialized_team_members)
    }
    
    return jsonify(result), 200

@manager_bp.route('/manager_arrangements_with_count', methods=['GET'])
def manager_arrangements_with_count():
    # Step 1: Validate inputs
    staff_id = session.get('employee_id')
    role = session.get('role')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    position = request.args.get('position')

    if not staff_id or not start_date or not end_date or not position:
        return jsonify({
            'message': 'Staff ID, Start Date, End Date, and Position are required',
            'code': 400
        }), 400

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        if start_date > end_date:
            raise ValueError("Start date is after end date")
    except ValueError as e:
        return jsonify({
            'message': f'Invalid date format or range: {str(e)}',
            'code': 400
        }), 400

    # Step 2: Determine the team members URL and filtering based on role
    
    team_members_url = f'http://localhost:5000/manager_team_members?position={position}'
    

    session_cookie = request.cookies.get('session')
    headers = {'Cookie': f'session={session_cookie}'}
    team_members_response = requests.get(team_members_url, headers=headers)

    if team_members_response.status_code != 200:
        return jsonify({
            'message': 'Failed to retrieve team members',
            'code': team_members_response.status_code
        }), team_members_response.status_code

    team_members_data = team_members_response.json()
    team_members = team_members_data.get('team_members', [])

    if not team_members:
        return jsonify({
            'message': 'No team members found for the specified position',
            'code': 404
        }), 404

    # Step 3: Create date range and initialize daily data
    date_range = [(start_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range((end_date - start_date).days + 1)]
    daily_data = {day: {'in_office_count': len(team_members), 'wfh_count': 0, 'total_members': len(team_members), 'schedules': []} for day in date_range}

    # Step 4: Fetch and process arrangements for each team member
    collated_arrangements = []
    for member in team_members:
        member_id = member['staff_id']
        arrangements_url = f'http://localhost:5000/arrangements?staff_id={member_id}&start_date={start_date.strftime("%Y-%m-%d")}&end_date={end_date.strftime("%Y-%m-%d")}'
        arrangements_response = requests.get(arrangements_url)

        if arrangements_response.status_code == 200:
            arrangements = arrangements_response.json()
            for arrangement in arrangements:
                arrangement_date = arrangement['arrangement_date']
                arrangement_type = arrangement['arrangement_type']
                arrangement_status = arrangement['status']

                # Update daily data if arrangement date falls in date range
                if arrangement_date in daily_data:
                    if arrangement_type == 'WFH' and arrangement_status == 'Approved':
                        daily_data[arrangement_date]['wfh_count'] += 1
                        daily_data[arrangement_date]['in_office_count'] -= 1

                    daily_data[arrangement_date]['schedules'].append({
                        'member_id': member_id,
                        'arrangement': arrangement_type,
                        'arrangement_status': arrangement_status
                    })

            collated_arrangements.append({
                "employee": member,
                "arrangements": arrangements
            })

    # Step 5: Prepare and return response
    response = {
        'daily_data': daily_data,
        'team_arrangements': collated_arrangements,
        'team_members': team_members
    }

    return jsonify(response), 200

@manager_bp.route('/manager_subordinate_groups', methods=['GET'])
def manager_subordinate_groups():
    # Retrieve the staff_id and role from session
    staff_id = session.get('employee_id')
    role = session.get('role')

    if not staff_id:
        return jsonify({"error": "Staff ID is required"}), 400

    # Optional department filter for HR managers
    department_filter = request.args.get('department')

    # Retrieve team members based on the role
    if role == 1:  # HR Manager: Access to all employees, filtered by department if provided
        query = Employee.query
        if department_filter:
            query = query.filter_by(Dept=department_filter)
        team_members = query.all()

    elif role == 3:  # Manager: Access only to direct reports
        team_members = Employee.query.filter_by(Reporting_Manager=staff_id).all()

    else:
        return jsonify({"error": "Access denied"}), 403

    if not team_members:
        return jsonify({"message": "No subordinates found for this manager"}), 200

    # Today's date for filtering arrangements
    today = datetime.today().date()

    # Group team members by position
    grouped_subordinates = {}
    for member in team_members:
        position = member.Position

        if position not in grouped_subordinates:
            grouped_subordinates[position] = {
                'total_count': 0,
                'in_office_count': 0
            }
        
        # Increment total count for the position
        grouped_subordinates[position]['total_count'] += 1

        # Count approved WFH arrangements for the member on today's date
        wfh_arrangements_today = Arrangement.query.filter_by(
            Staff_ID=member.Staff_ID,
            Status="Approved",
            Arrangement_Date=today,
            Arrangement_Type="WFH"
        ).count()

        # Calculate in-office count based on WFH arrangements
        if wfh_arrangements_today == 0:  # If no WFH, the member is in-office
            grouped_subordinates[position]['in_office_count'] += 1

    # Prepare the final result structure
    result = {
        "subordinate_groups": [
            {
                "position": position,
                "total_count": group['total_count'],
                "in_office_count": group['in_office_count']
            }
            for position, group in grouped_subordinates.items()
        ]
    }

    return jsonify(result), 200

@manager_bp.route('/manager_all_departments', methods=['GET'])
def manager_all_departments():

    # Fetch all employees
    all_employees = Employee.query.all()

    if not all_employees:
        return jsonify({"message": "No employees found"}), 200

    # Get today's date
    today = datetime.today()

    # Group employees by department
    grouped_departments = {}
    for member in all_employees:
        department = member.Dept
        if department not in grouped_departments:
            grouped_departments[department] = {
                'total_count': 0,
                'in_office_count': 0
            }
        
        # Increment total count
        grouped_departments[department]['total_count'] += 1
        
        # Check how many approved arrangements exist for today
        approved_arrangements_today = Arrangement.query.filter(
            Arrangement.Approving_ID == member.Staff_ID,
            Arrangement.Status == "Approved",
            Arrangement.Arrangement_Date == today
        ).count()

        # Deduct the approved arrangements from the total to determine the in-office count
        in_office_count = grouped_departments[department]['total_count'] - approved_arrangements_today
        grouped_departments[department]['in_office_count'] = max(0, in_office_count)

    # Prepare the final result structure
    result = {
        "department_groups": [
            {
                "department": department,
                "total_count": group['total_count'],
                "in_office_count": group['in_office_count']
            }
            for department, group in grouped_departments.items()
        ]
    }

    return jsonify(result), 200
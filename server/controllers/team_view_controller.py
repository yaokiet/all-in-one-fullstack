from flask import Blueprint, request, jsonify
from models.employee import Employee
from models.arrangement import Arrangement
from datetime import datetime, timedelta

# Create a new Blueprint for team view-related routes
team_view_bp = Blueprint('team_view', __name__)

@team_view_bp.route('/team_arrangements', methods=['GET'])
def team_arrangements():
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
        'team_arrangements': date_counts
    }), 200

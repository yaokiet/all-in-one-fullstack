from models.employee import Employee  # Import the Employee model if needed
from flask import Blueprint, request, jsonify, session
from models.arrangement import Arrangement
from datetime import datetime
from extensions import db

arrangements_bp = Blueprint('arrangement', __name__)

# This route is to view one's own working arrangements for a given date range
@arrangements_bp.route('/arrangements', methods=['GET'])
def view_own_arrangements_in_date_range():
    # staff_id = session.get('employee_id')
    staff_id = request.args.get('staff_id') or session.get('employee_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # Validate that all required parameters are provided
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

    # Ensure the start_date is not after the end_date
    if start_date > end_date:
        return jsonify({
            'message': 'Invalid date range. Start Date cannot be after End Date.',
            'code': 400
        }), 400

    # Fetch all work arrangements for the employee within the specified date range
    work_arrangements = Arrangement.query.filter_by(Staff_ID=staff_id).filter(
        Arrangement.Arrangement_Date.between(start_date, end_date)
    ).all()
    
    if not work_arrangements:
        return jsonify({
            'message': 'No work arrangements found for this employee in the specified date range',
            'code': 404
        }), 404

    # Return the serialized arrangements
    return jsonify([work_arrangement.serialize() for work_arrangement in work_arrangements])


# This route is to create a new work arrangement
@arrangements_bp.route('/arrangements', methods=['POST'])
def create_work_arrangement():
    data = request.get_json()

    # Validate that all required parameters are provided
    required_fields = ['staff_id', 'approving_id', 'arrangement_type', 'arrangement_date', 'AM_PM']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'message': f'{field} is required',
                'code': 400
            }), 400

    try:
        arrangement_date = datetime.strptime(data['arrangement_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({
            'message': 'Invalid date format. Please use YYYY-MM-DD',
            'code': 400
        }), 400
        
    # Validate the AM_PM field
    if data['AM_PM'] not in ["AM", "PM"]:
        return jsonify({
            'message': 'Invalid value for AM_PM. Please use "AM" or "PM"',
            'code': 400
        }), 400

    # Create the new work arrangement, defaulting status to 'Pending'
    new_arrangement = Arrangement(
        Staff_ID=data['staff_id'],
        Approving_ID=data['approving_id'],
        Arrangement_Type=data['arrangement_type'],
        Arrangement_Date=arrangement_date,
        AM_PM = data['AM_PM'],
        Status='Pending',  # Default to 'Pending'
        Application_Date=datetime.now(),  # Automatically set application date to now
    )

    # Save the new arrangement to the database
    db.session.add(new_arrangement)
    db.session.commit()

    return jsonify({
        'message': 'Work arrangement created successfully',
        'arrangement': new_arrangement.serialize()
    }), 201
    
# This route is to update the status of a work arrangement (from Pending to Approved or Rejected)
@arrangements_bp.route('/arrangements/<int:arrangement_id>', methods=['PUT'])
def update_work_arrangement_status(arrangement_id):
    data = request.get_json()

    # Validate that 'status' is provided in the request body
    if 'status' not in data:
        return jsonify({
            'message': 'Status is required',
            'code': 400
        }), 400

    # Ensure the status is either 'Approved' or 'Rejected'
    if data['status'] not in ['Approved', 'Rejected']:
        return jsonify({
            'message': 'Invalid status. Status must be either "Approved" or "Rejected".',
            'code': 400
        }), 400

    # Find the arrangement by its ID
    arrangement = db.session.get(Arrangement, arrangement_id)

    if not arrangement:
        return jsonify({
            'message': 'Arrangement not found',
            'code': 404
        }), 404

    # Ensure the arrangement is currently 'Pending'
    if arrangement.Status != 'Pending':
        return jsonify({
            'message': f'Cannot update arrangement with status "{arrangement.Status}". Only "Pending" arrangements can be updated.',
            'code': 400
        }), 400

    # Update the arrangement status
    arrangement.Status = data['status']
    arrangement.Approval_Date = datetime.now() if data['status'] == 'Approved' else None  # Set Approval_Date for approved status

    # Save the updated arrangement to the database
    db.session.commit()

    return jsonify({
        'message': f'Work arrangement status updated to {arrangement.Status}',
        'arrangement': arrangement.serialize()
    }), 200

from models.employee import Employee  
from flask import Blueprint, request, jsonify, session
from models.arrangement import Arrangement
from datetime import datetime
from extensions import db

apply_bp = Blueprint('apply', __name__)

# GET all applications of the staff (user can toggle between upcoming and past applications relative to current date time)
@apply_bp.route('/apply', methods=['GET'])
def get_arrangements():
    try:
        staff_id = session.get('employee_id')
        if not staff_id:
            return jsonify({'code': 403, 'message': 'You must be logged in.'}), 403

        filter_type = request.args.get('filter')
        current_date = datetime.now().date()

        # Filter arrangements based on 'upcoming' or 'past'
        if filter_type == 'upcoming':
            arrangements = Arrangement.query.filter(
                Arrangement.Staff_ID == staff_id,
                Arrangement.Arrangement_Date >= current_date
            ).all()
        elif filter_type == 'past':
            arrangements = Arrangement.query.filter(
                Arrangement.Staff_ID == staff_id,
                Arrangement.Arrangement_Date < current_date
            ).all()
        else:
            return jsonify({'code': 400, 'message': 'Invalid filter type. Use "upcoming" or "past".'}), 400

        # Get the employee's first and last name
        manager = Employee.query.get(session.get('reporting_manager'))
        if not manager:
            return jsonify({'code': 404, 'message': 'Manager not found'}), 404

        # Return arrangements with employee name included
        return jsonify({
            'code': 200,
            'manager_name': f"{manager.Staff_FName} {manager.Staff_LName}",
            'arrangements': [arr.serialize() for arr in arrangements]
        }), 200

    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)}), 500



# Apply for multiple dates 
@apply_bp.route('/apply', methods=['POST'])
def apply_arrangement():
    try: 
        data = request.get_json()

        if not data or not data.get('arrangement_dates') or not data.get('reason'):
            return jsonify({
                'code': 400, 
                'message': "Arrangement dates and reason are required"
            }), 400
        
        arrangement_dates = data['arrangement_dates']
        reason = data['reason']
        arrangement_type = data['arrangement_type']
        staff_id = session.get('employee_id')
        approving_id = session.get('reporting_manager')

        if not staff_id or not approving_id:
            return jsonify({
                'code': 403,
                'message': 'You must be logged in and have a reporting manager assigned.'
            }), 403

        application_date = datetime.now()

        arrangements = []
        for date_str in arrangement_dates:
            try:
                arrangement_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'code': 400, 
                    'message': f'Invalid date format for {date_str}. Use YYYY-MM-DD.'
                }), 400

            # Check if arrangement already exists for this staff_id and arrangement_date
            existing_arrangement = Arrangement.query.filter_by(
                Staff_ID=staff_id,
                Arrangement_Date=arrangement_date
            ).first()

            if existing_arrangement:
                return jsonify({
                    'code': 409,  # Conflict HTTP status code
                    'message': f'An arrangement for {arrangement_date} already exists for this employee.'
                }), 409

            # If no existing arrangement, create a new one
            new_arrangement = Arrangement(
                Staff_ID=staff_id,
                Approving_ID=approving_id,
                Arrangement_Type=arrangement_type,
                Arrangement_Date=arrangement_date,
                Status='Pending',  # Default status
                Application_Date=application_date,
                Reason=reason
            )
            arrangements.append(new_arrangement)
            db.session.add(new_arrangement)

        # Commit all new arrangements
        db.session.commit()

        return jsonify({
            'code': 201,
            'message': 'Arrangements applied successfully',
            'arrangements': [arr.serialize() for arr in arrangements]
        }), 201

    except Exception as e:
        return jsonify({
            'code': 500, 
            'message': str(e)
        }), 500


# Withdraw a single application (cannot be with status approved, only pending)
@apply_bp.route('/apply/<int:arrangement_id>', methods=['DELETE'])
def delete_arrangement(arrangement_id):
    try:
        arrangement = Arrangement.query.get(arrangement_id)
        if not arrangement:
            return jsonify({'code': 404, 'message': 'Arrangement not found'}), 404

        if arrangement.Status == 'Approved':
            return jsonify({'code': 403, 'message': 'Cannot delete an approved arrangement'}), 403

        db.session.delete(arrangement)
        db.session.commit()

        return jsonify({'code': 200, 'message': 'Arrangement deleted successfully'}), 200

    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)}), 500



def get_employee_name(staff_id):
    employee = Employee.query.get(staff_id)
    if employee:
        return f"{employee.Staff_FName} {employee.Staff_LName}"
    return None




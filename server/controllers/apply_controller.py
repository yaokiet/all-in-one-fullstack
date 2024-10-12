from models.employee import Employee  
from flask import Blueprint, request, jsonify, session
from models.arrangement import Arrangement
from datetime import datetime
from extensions import db

apply_bp = Blueprint('apply', __name__)

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

            new_arrangement = Arrangement(
                Staff_ID=staff_id,
                Approving_ID=approving_id,
                Arrangement_Type=reason,  # Assuming reason is the type of arrangement (Remote/Office, etc.)
                Arrangement_Date=arrangement_date,
                Status='Pending',  # Default status
                Application_Date=application_date
            )
            arrangements.append(new_arrangement)
            db.session.add(new_arrangement)

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

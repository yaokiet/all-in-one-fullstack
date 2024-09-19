from flask import Blueprint, request, jsonify
from models.arrangement import WorkArrangement
from datetime import datetime

work_arrangements_bp = Blueprint('arrangement', __name__)

# This route is to view one's own working arrangements
@work_arrangements_bp.route('/arrangements', methods=['GET'])
def view_own_arrangement():
    staff_id = request.args.get('staff_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # This line will ensure all parameters passed in are valid
    # There must be a staff id, start_date, and end_date
    if not staff_id or not start_date or not end_date:
        return jsonify({
            'message' : 'Staff ID, Start Date, and End Date are required',
            'code': 400
        }), 400
    
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date,'%Y-%m-%d')
    except ValueError:
        return jsonify({
            'message': 'Invalid date format. Please use YYYY-MM-DD',
            'code': 400
        }),400

    # This line will fetch all work arrangements for a logged-in user
    # It will be filtered to a specific date range
    work_arrangements = WorkArrangement.query.filter_by(staff_id=staff_id).filter(
        WorkArrangement.Arrangement_Date.between(start_date,end_date)
    ).all()

    if not work_arrangements:
        return jsonify({
            'message': 'No work arrangements found for this user',
            'code': 404
        }), 404

    # Corrected list comprehension
    return jsonify([work_arrangement.serialize() for work_arrangement in work_arrangements])

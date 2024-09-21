from flask import Blueprint, request, jsonify
from models.arrangement import Arrangement
from datetime import datetime

arrangements_bp = Blueprint('arrangement', __name__)

# This route views all arrangements for debugging purposes
@arrangements_bp.route('/arrangements_all',methods=['GET'])
def view_all_arrangements():
    # It will be filtered to a specific date range
    work_arrangements = Arrangement.query.all()
    if not work_arrangements:
        return jsonify({
            'message': 'No work arrangements found for this employee',
            'code': 404
        }), 404
    # Corrected list comprehension
    return jsonify([work_arrangement.serialize() for work_arrangement in work_arrangements])

# This route is to view one's own working arrangements for a given date range
@arrangements_bp.route('/arrangements', methods=['GET'])
def view_own_arrangements_in_date_range():
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

    # This line will fetch all work arrangements for a logged-in employee
    # It will be filtered to a specific date range
    work_arrangements = Arrangement.query.filter_by(Staff_ID=staff_id).filter(
        Arrangement.Arrangement_Date.between(start_date,end_date)
    ).all()
    
    if not work_arrangements:
        return jsonify({
            'message': 'No work arrangements found for this employee',
            'code': 404
        }), 404

    # Corrected list comprehension
    return jsonify([work_arrangement.serialize() for work_arrangement in work_arrangements])
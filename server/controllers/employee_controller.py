from flask import Blueprint, jsonify, request, abort
from extensions import db
from models.employee import Employee

employee_bp = Blueprint('employee', __name__)

# Route to get all employees
@employee_bp.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([employee.serialize() for employee in employees])

# Route to fetch an employee by their Staff_Id
@employee_bp.route('/employees/<int:staff_id>', methods=['GET'])
def get_employee_by_staff_id(staff_id):
    # Query the Employee model using staff_id
    employee = Employee.query.filter_by(staff_id=staff_id).first()
    
    if not employee:
        return abort(404, description="User not found")
    
    # Assuming User model has a serialize() method to convert object to JSON
    return jsonify(employee.serialize())


@employee_bp.route('/login', methods=['POST'])
def login():
    # Get JSON data from the request
    try: 
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'code': 400, 
                'message':"Email and password are required"
                })
        
        email = data['email']
        password = data['password']
        
        # Query the database for the user by email
        employee = Employee.query.filter_by(Email=email).first()
        
        if not employee:
            return jsonify({
                'code': 400, 
                'message':"Employee not found"
                })

        return jsonify({
            'message': 'Login successful',
            'code' : 201,
            'employee': employee.serialize()  
        })

    except Exception as e:
        return jsonify({
            'code': 500, 
           'message': str(e)
            })

    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400



from flask import Blueprint, jsonify, request, abort
from extensions import db
from models.employee import Employee

employee_bp = Blueprint('employee', __name__)

# Route to get all employees
@employee_bp.route('/employees', methods=['GET'])
def get_all_employees():
    employees = Employee.query.all()
    return jsonify([employee.serialize() for employee in employees])

# Route to fetch an employee by their Staff_Id
@employee_bp.route('/employees/<int:staff_id>', methods=['GET'])
def get_employee_by_staff_id(staff_id):
    # Query the Employee model using staff_id
    employee = Employee.query.filter_by(Staff_ID=staff_id).first()
    
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
            'code' : 200,
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


# Create a new employee. This is for automated testing
@employee_bp.route('/employees', methods=['POST'])
def create_employee():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Validate the required fields
        required_fields = ['staff_fname', 'staff_lname', 'dept', 'position', 'country', 'email', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({
                'code': 400,
                'message': 'Missing required fields: staff_fname, staff_lname, dept, position, country, email, role'
            }), 400

        # Extract values from the request
        staff_fname = data['staff_fname']
        staff_lname = data['staff_lname']
        dept = data['dept']
        position = data['position']
        country = data['country']
        email = data['email']
        role = data['role']
        reporting_manager = data.get('reporting_manager', None)  # This can be optional

        # Check if the employee with the same email already exists
        if Employee.query.filter_by(Email=email).first():
            return jsonify({
                'code': 400,
                'message': 'Employee with this email already exists'
            }), 400

        # Create a new Employee object
        new_employee = Employee(
            Staff_FName=staff_fname,
            Staff_LName=staff_lname,
            Dept=dept,
            Position=position,
            Country=country,
            Email=email,
            Role=role,
            Reporting_Manager=reporting_manager  # Optional field for manager
        )

        # Add and commit the new employee to the database
        db.session.add(new_employee)
        db.session.commit()

        # Return the newly created employee data
        return jsonify({
            'message': 'Employee created successfully',
            'code': 201,
            'employee': new_employee.serialize()
        }), 201

    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e)
        }), 500

@employee_bp.route('/employees/<int:staff_id>', methods=['DELETE'])
def delete_employee(staff_id):
    try:
        # Query the database for the employee by staff_id
        employee = Employee.query.filter_by(Staff_ID=staff_id).first()

        if not employee:
            return jsonify({
                'code': 404,
                'message': 'Employee not found'
            }), 404

        # Delete the employee from the database
        db.session.delete(employee)
        db.session.commit()

        return jsonify({
            'message': f'Employee with staff_id {staff_id} deleted successfully',
            'code': 200
        }), 200

    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e)
        }), 500

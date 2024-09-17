from flask import Blueprint, jsonify, request, abort
from extensions import db
from models.user import User

user_bp = Blueprint('user', __name__)

# Route to get all users
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

# Route to fetch a user by their Staff_Id
@user_bp.route('/users/<int:staff_id>', methods=['GET'])
def get_user_by_staff_id(staff_id):
    # Query the User model using Staff_Id
    user = User.query.filter_by(Staff_ID=staff_id).first()
    
    if not user:
        return abort(404, description="User not found")
    
    # Assuming User model has a serialize() method to convert object to JSON
    return jsonify(user.serialize())

    # hello!

@user_bp.route('/login', methods=['POST'])
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
        user = User.query.filter_by(Email=email).first()
        
        if not user:
            return jsonify({
                'code': 400, 
                'message':"User not found"
                })

        return jsonify({
            'message': 'Login successful',
            'code' : 201,
            'user': user.serialize()  # Assuming the User model has a serialize() method
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



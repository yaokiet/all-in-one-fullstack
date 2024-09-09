from flask import Blueprint, jsonify, request, abort
from extensions import db
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

# Fetch user by their ID
@user_bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return abort(404, description="User not found")
    return jsonify(user.serialize())

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if 'username' not in data or 'email' not in data:
        return jsonify({'error': 'Invalid input, username and email are required'}), 400
    new_user = User(username=data['username'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

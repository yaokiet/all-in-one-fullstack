from flask import Blueprint, jsonify, request, abort
from extensions import db
from models.team import Team

team_bp = Blueprint('team', __name__)

# Route to get all teams
@team_bp.route('/teams', methods=['GET'])
def get_all_teams():
    teams = Team.query.all()
    return jsonify([team.serialize() for team in teams])

# Route to fetch a team by Team_ID
@team_bp.route('/teams/<int:team_id>', methods=['GET'])
def get_team_by_id(team_id):
    team = Team.query.filter_by(Team_ID=team_id).first()
    if not team:
        return jsonify({
            'code': 404,
            'message': 'Team not found'
        }), 404
    return jsonify(team.serialize())

# Route to create a new team
@team_bp.route('/teams', methods=['POST'])
def create_team():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Validate the required fields
        required_fields = ['team_name', 'dept']
        if not all(field in data for field in required_fields):
            return jsonify({
                'code': 400,
                'message': 'Missing required fields: team_name, dept'
            }), 400

        # Extract values from the request
        team_name = data['team_name']
        dept = data['dept']
        team_lead_id = data.get('team_lead_id', None)  # Optional

        # Create a new Team object
        new_team = Team(
            Team_Name=team_name,
            Team_Lead_ID=team_lead_id,
            Dept=dept
        )

        # Add and commit the new team to the database
        db.session.add(new_team)
        db.session.commit()

        # Return the newly created team data
        return jsonify({
            'message': 'Team created successfully',
            'code': 201,
            'team': new_team.serialize()
        }), 201

    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e)
        }), 500

# Route to update an existing team
@team_bp.route('/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Query the database for the team
        team = Team.query.filter_by(Team_ID=team_id).first()

        if not team:
            return jsonify({
                'code': 404,
                'message': 'Team not found'
            }), 404

        # Update the team's attributes
        team.Team_Name = data.get('team_name', team.Team_Name)
        team.Team_Lead_ID = data.get('team_lead_id', team.Team_Lead_ID)
        team.Dept = data.get('dept', team.Dept)

        # Commit the updated team to the database
        db.session.commit()

        return jsonify({
            'message': 'Team updated successfully',
            'code': 200,
            'team': team.serialize()
        }), 200

    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e)
        }), 500

# Route to delete a team by Team_ID
@team_bp.route('/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    try:
        # Query the database for the team
        team = Team.query.filter_by(Team_ID=team_id).first()

        if not team:
            return jsonify({
                'code': 404,
                'message': 'Team not found'
            }), 404

        # Delete the team from the database
        db.session.delete(team)
        db.session.commit()

        return jsonify({
            'message': f'Team with team_id {team_id} deleted successfully',
            'code': 200
        }), 200

    except Exception as e:
        return jsonify({
            'code': 500,
            'message': str(e)
        }), 500

# Route to get all members of a team that a certain staff ID belongs to
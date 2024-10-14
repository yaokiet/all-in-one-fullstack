from flask import Flask
from flask_cors import CORS
from extensions import db
from flask_migrate import Migrate
from config import DevelopmentConfig, TestingConfig
# from controllers.user_controller import user_bp
from controllers.arrangement_controller import arrangements_bp
from controllers.employee_controller import employee_bp
from controllers.team_controller import team_bp
from controllers.team_view_controller import team_view_bp
from controllers.apply_controller import apply_bp



def create_app(config_class = DevelopmentConfig):
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])


    # Set configurations
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)

    # Register Blueprints
    # app.register_blueprint(user_bp)
    app.register_blueprint(arrangements_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(team_view_bp)
    app.register_blueprint(apply_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

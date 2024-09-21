
from flask import Flask
from flask_cors import CORS
from extensions import db
from flask_migrate import Migrate
from controllers.user_controller import user_bp
from controllers.arrangement_controller import arrangements_bp
from controllers.employee_controller import employee_bp
from config import DevelopmentConfig, TestingConfig



def create_app(config_class = DevelopmentConfig):
    app = Flask(__name__)
    CORS(app)


    # Set configurations
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)

    # Register Blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(arrangements_bp)
    app.register_blueprint(employee_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

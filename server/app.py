from flask import Flask, request
from flask_cors import CORS
from extensions import db
from flask_migrate import Migrate
from config import DevelopmentConfig, TestingConfig
from controllers.arrangement_controller import arrangements_bp
from controllers.employee_controller import employee_bp
from controllers.team_view_controller import team_view_bp
from controllers.apply_controller import apply_bp
from controllers.manager_controller import manager_bp
from flask_session import Session
import git
import hmac
import hashlib
import os
from datetime import timedelta

# migrate = Migrate()
sess = Session()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    
    # Add your additional origin here
    allowed_origins = [
        "http://localhost:3000",
        "https://frontend-git-master-yew-kiys-projects.vercel.app",
        "https://frontend-yew-kiys-projects.vercel.app",
        "https://all-in-one-fullstack-4uz8.vercel.app"
    ]
    # CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    CORS(app, supports_credentials=True, origins=allowed_origins)

    # Set configurations
    app.config.from_object(config_class)

    # Set configurations
    app.config['SESSION_TYPE'] = 'filesystem'  # Switch to filesystem-based sessions
    # app.config['SESSION_FILE_DIR'] = '/tmp/flask_session/'  # Set directory for session files
    # app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    # app.secret_key = 'your_secret_key'  # Ensure this is set for session security
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Adjust as necessary

    
    # app.config['SESSION_TYPE'] = 'filesystem'  # Change to 'null' or 'filesystem' if you want to use server-side sessions, but not recommended in serverless
    # app.config['SESSION_USE_SIGNER'] = True  # Sign cookies for security
    # app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allows cross-origin cookies
    # app.config['SESSION_COOKIE_SECURE'] = True  # Ensure this is True when using HTTPS in production




    # Initialize extensions
    db.init_app(app)
    sess.init_app(app)  # Link session management with the app
    migrate = Migrate(app, db)  # Add this line to initialize Flask-Migrate

    # Register Blueprints
    # app.register_blueprint(user_bp)
    app.register_blueprint(arrangements_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(team_view_bp)
    app.register_blueprint(apply_bp)
    app.register_blueprint(manager_bp)

    # # Ensure Access-Control-Allow-Credentials is set
    # @app.after_request
    # def apply_cors(response):
    #     # response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    #     response.headers["Access-Control-Allow-Origin"] = ",".join(allowed_origins)
    #     response.headers["Access-Control-Allow-Credentials"] = "true"
    #     response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    #     response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    #     return response

    # Webhook route
    @app.route('/update_server', methods=['POST'])
    def update_server():
        x_hub_signature = request.headers.get('X-Hub-Signature-256')
        w_secret = os.getenv("WEBHOOK_SECRET", "tieguanyin")

        # Verify the signature
        if not is_valid_signature(request.data, w_secret, x_hub_signature):
            return 'Invalid signature', 403

        # Pull the latest changes from the repo
        repo = git.Repo('/home/jszw00/all-in-one-fullstack')
        origin = repo.remotes.origin
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200

    def is_valid_signature(payload_body, secret_token, signature_header):
        if not signature_header:
            return False
        hash_object = hmac.new(secret_token.encode('utf-8'), msg=payload_body, digestmod=hashlib.sha256)
        expected_signature = "sha256=" + hash_object.hexdigest()
        return hmac.compare_digest(expected_signature, signature_header)



    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

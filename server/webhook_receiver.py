from flask import Flask, request
import git
import hmac
import hashlib
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()
w_secret = os.getenv("WEBHOOK_SECRET")  # Retrieve the secret from the environment variable

@app.route('/update_server', methods=['POST'])
def webhook():
    if request.method == 'POST':
        x_hub_signature = request.headers.get('X-Hub-Signature')
        
        # Verify the signature
        if not is_valid_signature(x_hub_signature, request.data, w_secret):
            return 'Invalid signature', 403
        
        # Pull the latest changes from the repo
        repo = git.Repo('/home/jszw00/all-in-one-fullstack')
        origin = repo.remotes.origin
        origin.pull()
        return 'Updated PythonAnywhere successfully', 200
    else:
        return 'Wrong event type', 400

def is_valid_signature(x_hub_signature, data, private_key):
    # x_hub_signature and data are from the webhook payload
    # private_key is your webhook secret
    if not x_hub_signature:
        return False
    hash_algorithm, github_signature = x_hub_signature.split('=', 1)
    algorithm = hashlib.__dict__.get(hash_algorithm)
    if algorithm is None:
        return False
    encoded_key = bytes(private_key, 'latin-1')
    mac = hmac.new(encoded_key, msg=data, digestmod=algorithm)
    return hmac.compare_digest(mac.hexdigest(), github_signature)

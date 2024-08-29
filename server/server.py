from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({"message": "Welcome to the Home Page"})

if __name__ == "__main__":
    app.run(debug=True)
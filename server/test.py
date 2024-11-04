from flask import Flask

# Initialize the Flask application
app = Flask(__name__)

# Define the route for the '/test' endpoint
@app.route('/test')
def test():
    # Print 'hello world' in the server console
    print('A test, final one')
    # Return a simple response to the client
    return 'Hello, World!'

if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(debug=True)
# djisnafjdsanjkfdns
# sdk;jangkjadkjnfdsa
# ads;kjnkfjdsan
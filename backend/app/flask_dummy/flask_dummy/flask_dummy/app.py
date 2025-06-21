from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message="Hello, World!")

@app.route('/add/<int:x>/<int:y>')
def add(x, y):
    return jsonify(result=x + y)

if __name__ == '__main__':
    app.run()
from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/trigger-sound', methods=['POST', 'GET'])
def trigger_sound():
    print("Sound trigger received!")
    socketio.emit('playSound')
    return '', 204

@socketio.on('connect')
def handle_connect():
    print("Client connected!")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected!")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
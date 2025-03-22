from flask import Flask, request, redirect
from flask_socketio import SocketIO
from model.predict_module import predict
import requests

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/sensor_data', methods=['POST'])
def sensor_data():
    data = request.get_json()
    #print("Received sensor data:", data)
    prediction = predict("model/rf_model.pkl", data['normalized'])

    print(prediction)
    
    if(prediction != 0):
        user_data={"user_id": "c91f5d39-8ea5-486f-a2cf-98f847b6f92d"}
        response = requests.post("http://localhost:5000/incidents/add", json=user_data) 
        socketio.emit('playSound')
    
    return []


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
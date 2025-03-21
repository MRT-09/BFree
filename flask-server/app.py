from flask import Flask, request, render_template
import requests

app = Flask(__name__)
ESP32_IP = "192.168.185.1"  # Replace with your ESP32's IP

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-sensor-data')
def get_sensor_data():
    try:
        response = requests.get(f"http://{ESP32_IP}/sensor")
        return {
            'success': True,
            'data': response.json(),
            'status': response.status_code
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': str(e)
        }, 500

@app.route('/send-command', methods=['POST'])
def send_command():
    command = request.form.get('command')
    if not command:
        return {'success': False, 'error': 'No command provided'}, 400
    
    try:
        response = requests.post(
            f"http://{ESP32_IP}/control",
            data={'command': command}
        )
        return {
            'success': True,
            'response': response.text,
            'status': response.status_code
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': str(e)
        }, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
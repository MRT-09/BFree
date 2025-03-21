#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;
const char* ssid = "Victor";
const char* password = "victoronthegoht11";
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("MPU6050 not found!");
    while(1);
  }

  // Web server routes
  server.on("/sensor", HTTP_GET, [](AsyncWebServerRequest *request){
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    
    String json = String("{") +
      "\"acceleration_x\":" + String(a.acceleration.x) + "," +
      "\"acceleration_y\":" + String(a.acceleration.y) + "," +
      "\"acceleration_z\":" + String(a.acceleration.z) + "," +
      "\"temperature\":" + String(temp.temperature) + "}";
    
    request->send(200, "application/json", json);
  });

  // Command endpoint
  server.on("/control", HTTP_POST, [](AsyncWebServerRequest *request){
    if(request->hasParam("command", true)) {
      String command = request->getParam("command", true)->value();
      Serial.println("Received command: " + command);
      request->send(200, "text/plain", "Command received: " + command);
    } else {
      request->send(400, "text/plain", "Missing command");
    }
  });

  server.begin();
}

void loop() {
  // Read and print sensor data
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  Serial.print("Accel X:");
  Serial.print(a.acceleration.x);
  Serial.print(" Y:");
  Serial.print(a.acceleration.y);
  Serial.print(" Z:");
  Serial.print(a.acceleration.z);
  Serial.print(" Temp:");
  Serial.println(temp.temperature);

  delay(1000);
}
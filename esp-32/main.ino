#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <deque>
#include <math.h>

using namespace std;

const char* ssid = "****";
const char* password = "****";

const char* serverName = "http://<your_ip>:5001/sensor_data";

Adafruit_MPU6050 mpu;

struct DataBlock {
  sensors_event_t a;
  sensors_event_t g;
};

deque<DataBlock> dq;

String computeStats() {
  if (dq.empty()) {
    return "";
  }
  
  int n = dq.size();
  
  DataBlock first = dq.front();
  float sum_ax = 0, sum_ay = 0, sum_az = 0;
  float sum_gx = 0, sum_gy = 0, sum_gz = 0;
  
  float min_ax = first.a.acceleration.x, max_ax = first.a.acceleration.x;
  float min_ay = first.a.acceleration.y, max_ay = first.a.acceleration.y;
  float min_az = first.a.acceleration.z, max_az = first.a.acceleration.z;
  
  float min_gx = first.g.gyro.x, max_gx = first.g.gyro.x;
  float min_gy = first.g.gyro.y, max_gy = first.g.gyro.y;
  float min_gz = first.g.gyro.z, max_gz = first.g.gyro.z;
  
  for (const DataBlock &db : dq) {
    float ax = db.a.acceleration.x;
    float ay = db.a.acceleration.y;
    float az = db.a.acceleration.z;
    float gx = db.g.gyro.x;
    float gy = db.g.gyro.y;
    float gz = db.g.gyro.z;
    
    sum_ax += ax;
    sum_ay += ay;
    sum_az += az;
    
    sum_gx += gx;
    sum_gy += gy;
    sum_gz += gz;
    
    if (ax < min_ax) min_ax = ax;
    if (ax > max_ax) max_ax = ax;
    
    if (ay < min_ay) min_ay = ay;
    if (ay > max_ay) max_ay = ay;
    
    if (az < min_az) min_az = az;
    if (az > max_az) max_az = az;
    
    if (gx < min_gx) min_gx = gx;
    if (gx > max_gx) max_gx = gx;
    
    if (gy < min_gy) min_gy = gy;
    if (gy > max_gy) max_gy = gy;
    
    if (gz < min_gz) min_gz = gz;
    if (gz > max_gz) max_gz = gz;
  }
  
  float mean_ax = sum_ax / n;
  float mean_ay = sum_ay / n;
  float mean_az = sum_az / n;
  
  float mean_gx = sum_gx / n;
  float mean_gy = sum_gy / n;
  float mean_gz = sum_gz / n;
  
  float var_ax = 0, var_ay = 0, var_az = 0;
  float var_gx = 0, var_gy = 0, var_gz = 0;
  
  for (const DataBlock &db : dq) {
    var_ax += pow(db.a.acceleration.x - mean_ax, 2);
    var_ay += pow(db.a.acceleration.y - mean_ay, 2);
    var_az += pow(db.a.acceleration.z - mean_az, 2);
    
    var_gx += pow(db.g.gyro.x - mean_gx, 2);
    var_gy += pow(db.g.gyro.y - mean_gy, 2);
    var_gz += pow(db.g.gyro.z - mean_gz, 2);
  }
  
  float std_ax = sqrt(var_ax / n);
  float std_ay = sqrt(var_ay / n);
  float std_az = sqrt(var_az / n);
  
  float std_gx = sqrt(var_gx / n);
  float std_gy = sqrt(var_gy / n);
  float std_gz = sqrt(var_gz / n);
  
  String result = "";
  result += String(mean_ax, 6) + "," + String(std_ax, 6) + "," + String(min_ax, 6) + "," + String(max_ax, 6) + ",";
  result += String(mean_ay, 6) + "," + String(std_ay, 6) + "," + String(min_ay, 6) + "," + String(max_ay, 6) + ",";
  result += String(mean_az, 6) + "," + String(std_az, 6) + "," + String(min_az, 6) + "," + String(max_az, 6) + ",";
  result += String(mean_gx, 6) + "," + String(std_gx, 6) + "," + String(min_gx, 6) + "," + String(max_gx, 6) + ",";
  result += String(mean_gy, 6) + "," + String(std_gy, 6) + "," + String(min_gy, 6) + "," + String(max_gy, 6) + ",";
  result += String(mean_gz, 6) + "," + String(std_gz, 6) + "," + String(min_gz, 6) + "," + String(max_gz, 6);
  
  return result;
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  if (!mpu.begin()){
    Serial.println("MPU6050 not found!");
    while (1);
  }
  Serial.println("MPU6050 initialized.");
}

void loop() { 
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  DataBlock db;
  db.a = a;
  db.g = g;
  
  dq.push_front(db);
  if (dq.size() > 600) {
    dq.pop_back();
  }
  
  Serial.println("New sensor reading:");
  Serial.print("Accel: ");
  Serial.print(a.acceleration.x, 16);
  Serial.print(", ");
  Serial.print(a.acceleration.y, 16);
  Serial.print(", ");
  Serial.println(a.acceleration.z, 16);
  
  Serial.print("Gyro: ");
  Serial.print(g.gyro.x, 16);
  Serial.print(", ");
  Serial.print(g.gyro.y, 16);
  Serial.print(", ");
  Serial.println(g.gyro.z, 16);
  
  String normalized = computeStats();
  
  Serial.println("Normalized stats string:");
  Serial.println(normalized);
  
  String jsonPayload = "{\"normalized\":\"" + normalized + "\"}";
  Serial.println("JSON Payload:");
  Serial.println(jsonPayload);
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(http.errorToString(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  Serial.print("Deque size: ");
  Serial.println(dq.size());
  Serial.println("-----");
  
  delay(100);
}

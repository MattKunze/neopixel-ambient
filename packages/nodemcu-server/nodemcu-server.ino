#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <PubSubClient.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "BOING_NET";
const char* password = "01123581321345589144233377";
const char* mqtt_server = "mqtt.boing.net";
const char* mqtt_client = "ESP8266-sprite-server";

WiFiClient espClient;
PubSubClient client(espClient);

#define NUM_PIXELS 64
#define PIN D5

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRBW + NEO_KHZ800);

void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Received message: ");
  Serial.print(topic);
  Serial.print(" - length: ");
  Serial.println(length);

  String body;
  for (int i = 0; i < length; i++) {
    body += (char)message[i];
  }

  int pos = topic.indexOf('/');
  String command = topic.substring(pos + 1);
  if(command.equalsIgnoreCase("off")) {
    pixels.clear();
    pixels.show();
  }
  else if(command.equalsIgnoreCase("fill")) {
    uint32_t color = parseColor(body);
    Serial.print("fill: ");
    Serial.println(color);
    fill(color);
  }
  else if(command.equalsIgnoreCase("sprite")) {
    pixels.clear();
    body += ",";
    int pixel = 0;
    int offset = 0;
    int pos = body.indexOf(',');
    while(pos >= 0 && pixel < NUM_PIXELS) {
      if(pos > offset) {
        String temp = body.substring(offset, pos);
        uint32_t color = parseColor(temp);
        pixels.setPixelColor(pixel, color);
      }

      pixel++;
      offset = pos + 1;
      pos = body.indexOf(',', offset);
    }
    pixels.show();
  }
  else {
    Serial.print("Unknown command: ");
    Serial.println(command);
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(mqtt_client)) {
      Serial.println("connected");
      client.subscribe("sprite/#");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

uint32_t parseColor(String str) {
  if(str.charAt(0) == '#') {
    str = str.substring(1);
  }

  String red;
  String green;
  String blue;
  String white;
  int length = str.length();
  if(length == 3 || length == 4) {
    red = str.substring(0, 1) + str.substring(0, 1);
    green = str.substring(1, 2) + str.substring(1, 2);
    blue = str.substring(2, 3) + str.substring(2, 3);
    if(length == 4) {
      white = str.substring(3, 4) + str.substring(3, 4);
    }
  }
  else if(length == 6 || length == 8) {
    red = str.substring(0, 2);
    green = str.substring(2, 4);
    blue = str.substring(4, 6);
    if(length == 8) {
      white = str.substring(6, 8);
    }
  }
  int r = strtol(red.c_str(), 0, 16);
  int g = strtol(green.c_str(), 0, 16);
  int b = strtol(blue.c_str(), 0, 16);
  int w = strtol(white.c_str(), 0, 16);

  return pixels.Color(r, g, b, w);
}

void fill(uint32_t color) {
  pixels.fill(color);
  pixels.show();
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  delay(3000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  client.setBufferSize(2048);
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pixels.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  if(!client.loop())
    client.connect(mqtt_client);
}

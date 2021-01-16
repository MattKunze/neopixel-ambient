import board
import neopixel
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from matplotlib import colors

NUM_PIXELS = 64
pixels = neopixel.NeoPixel(
  board.D18, NUM_PIXELS,
  pixel_order=neopixel.RGBW,
  auto_write=False
)

app = Flask(__name__)
CORS(app)

@app.route('/parse/<string:str>')
def parse(str):
  data = parse_pixel(str)
  return jsonify(data)

@app.route('/off', methods=['GET', 'POST'])
def off():
  pixels.fill((0, 0, 0, 0))
  pixels.show()
  return "ok"

@app.route('/fill/<string:rgbw>', methods=['GET', 'POST'])
def fill(rgbw):
  data = parse_pixel(rgbw)
  pixels.fill(data)
  pixels.show()
  return "ok"

@app.route('/sprite', methods=['POST'])
def sprite():
  if not request.json:
    abort(400)

  for x in range(0, min(len(request.json), NUM_PIXELS)):
    pixels[x] = parse_pixel(request.json[x])
  pixels.show()

  return "ok"

def brightness(num):
  return int(num * 255)

def parse_pixel(str):
  if not str:
    return (0, 0, 0, 0)

  str = str.strip('#')
  (red, green, blue, alpha) = colors.to_rgba('#' + str)
  if len(str) == 4 or len(str) == 8:
    white = alpha
  else:
    white = 0

  return (brightness(green), brightness(red), brightness(blue), brightness(white))

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)

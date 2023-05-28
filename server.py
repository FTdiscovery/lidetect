# Python script
from datetime import datetime, timedelta
from flask import Flask, render_template
from flask import jsonify
import json
from flask_ngrok import run_with_ngrok
from utils import *

app = Flask(__name__,static_url_path='', 
            static_folder='web/static',
            template_folder='web/templates')


@app.route('/')
def home():
   return render_template('index.html')

# The personalities are designed so that index i should have a matching personality and style. However, we should find presets that are good
personalities = [x.replace("\n", "") for x in open('prompts/personalities.prompt').readlines()]
styles = [x.replace("\\n", "\n") for x in open('prompts/styles.prompt').readlines()]
names = [x.replace("\n", "") for x in open('prompts/names.prompt').readlines()]

@app.route('/ai_response/<string:input_string>/<string:history>')
def ai_response(input_string, history):
    if len(input_string) == 0:
        return
    print(history)
    ai = PseudoHuman("Jasper", personalities[0], styles[0])
    response = ai.answer(history)
    # Invoke the Python function and get the result
    return jsonify((response))

if __name__ == '__main__':
    app.run(debug=True,port=8080)

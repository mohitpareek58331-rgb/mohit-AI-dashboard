from flask import Flask, render_template, request, jsonify
from google import genai

# Flask automatically checks the 'templates' and 'static' folders by default
app = Flask(__name__)

# Initialize the Gemini Client
import os
from flask import Flask, render_template, request, jsonify
from google import genai

app = Flask(__name__)

# This securely grabs the key you just saved on Render's servers!
api_key_secret = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key_secret)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"reply": "I didn't receive a message."}), 400

    try:
        prompt = f"Answer this query concisely in 1 or 2 simple sentences: {user_message}"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return jsonify({"reply": response.text.strip()})
    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"reply": "I ran into an issue connecting to my brain."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
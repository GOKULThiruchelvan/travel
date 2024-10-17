import os
from flask import Flask, send_file
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

app = Flask(__name__)

# Set your Google API key as an environment variable
os.environ["GOOGLE_API_KEY"] = "YOUR_GOOGLE_API_KEY"

# Route to serve the main webpage
@app.route('/')
def home():
    return send_file('templates/index.html')

# Starting point for your Flask app
if __name__ == '__main__':
    app.run(debug=True)

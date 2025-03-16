from flask import Flask, request, jsonify
from flask_cors import CORS

import base64
from dotenv import load_dotenv
import io
from openai import OpenAI
import os
from PIL import Image
import time


# Load the environment variables
load_dotenv()


# Create the Flask app
app = Flask(__name__)
CORS(app)


# Set up the OpenAI API and load the instructions
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)
with open("instructions.txt") as f:
    instructions = f.read()


@app.route("/")
def hello_world():
    return "Huzzicide API is online"


@app.route("/get_response", methods=["POST"])
def generate_response():
    # Ensure an image is provided
    if request.files.get("image") is None:
        return jsonify({"error": "No image provided"}), 400

    # Load the image bytes from the request
    image_file = request.files["image"]
    try:
        image = Image.open(image_file)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        image_bytes = buffered.getvalue()
        image_text = base64.b64encode(image_bytes).decode("utf-8")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Send the image to OpenAI
    start = time.time()
    response = client.responses.create(
        model="gpt-4-turbo",
        instructions=instructions,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{image_text}",
                    },
                ],
            }
        ],
        temperature=0.75,
    )
    delta = time.time() - start

    return (
        jsonify(
            {
                "response": response.output_text,
                "time": delta,
            }
        ),
        200,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("BACKEND_PORT"))

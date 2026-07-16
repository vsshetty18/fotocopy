# ====================================================
# Face Recognition Microservice
# Flask + InsightFace — detects faces in an image and
# returns embeddings + bounding boxes as JSON.
#
# This is called SERVER-TO-SERVER by the Node/Express
# backend only (never directly by the frontend browser),
# which is why CORS only needs to allow the backend's
# Render URL, not the Vercel frontend URL.
# ====================================================

import os
import io
import numpy as np
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import insightface
from insightface.app import FaceAnalysis

app = Flask(__name__)

# ----------------------------------------------------
# CORS — only allow the Node backend's URL to call this
# service. Set BACKEND_URL as an env var on Render.
# ----------------------------------------------------
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000")
CORS(app, origins=[BACKEND_URL])

# ----------------------------------------------------
# Load the InsightFace model ONCE at startup, not per
# request — loading the model is slow (several seconds),
# so doing it per-request would make every call painfully
# slow and waste CPU repeatedly.
# ----------------------------------------------------
print("🔄 Loading InsightFace model...")
face_app = FaceAnalysis(name="buffalo_sc", providers=["CPUExecutionProvider"])
face_app.prepare(ctx_id=0, det_size=(640, 640))
print("✅ InsightFace model loaded")


@app.route("/health", methods=["GET"])
def health():
    """Simple health check for Render."""
    return jsonify({"success": True, "message": "Face service is healthy"}), 200


@app.route("/detect-faces", methods=["POST"])
def detect_faces():
    """
    Accepts: { "imageUrl": "https://..." }
    Returns: { "faces": [ { "embedding": [...], "box": {...} }, ... ] }
    """
    data = request.get_json(silent=True)

    if not data or "imageUrl" not in data:
        return jsonify({"success": False, "message": "imageUrl is required"}), 400

    image_url = data["imageUrl"]

    try:
        # Download the image from Cloudinary
        response = requests.get(image_url, timeout=15)
        response.raise_for_status()

        # Convert to a format InsightFace/OpenCV can read
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        image_np = np.array(image)
        # InsightFace expects BGR (OpenCV convention)
        image_bgr = image_np[:, :, ::-1]

        # Run face detection + embedding extraction
        detected_faces = face_app.get(image_bgr)

        faces_result = []
        for face in detected_faces:
            box = face.bbox.astype(int)  # [x1, y1, x2, y2]
            faces_result.append({
                "embedding": face.embedding.tolist(),
                "box": {
                    "x": int(box[0]),
                    "y": int(box[1]),
                    "width": int(box[2] - box[0]),
                    "height": int(box[3] - box[1]),
                }
            })

        return jsonify({"success": True, "faces": faces_result}), 200

    except requests.RequestException as e:
        return jsonify({"success": False, "message": f"Failed to download image: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Face detection failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)

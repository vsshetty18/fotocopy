// ====================================================
// Face Recognition Service
// Calls an external Python microservice (InsightFace)
// to detect faces and generate embeddings.
//
// WHY A SEPARATE SERVICE:
// InsightFace is a Python library — it cannot run inside
// this Node/Express backend directly. Since Docker is off
// the table, we run it as a SECOND, independent Render Web
// Service (Python + Flask), and this file just calls it
// over HTTP. This is the same pattern already working for
// your other face-recognition project, so we're reusing it.
// ====================================================

import axios from "axios";
import { env } from "../config/env";

// Response shape returned by the Python InsightFace service
export interface DetectedFace {
  embedding: number[];      // 512-d (or similar) face embedding vector
  box: {                    // bounding box in pixel coordinates
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface FaceServiceResponse {
  faces: DetectedFace[];
}

/**
 * Send an image URL to the Python face-recognition service
 * and get back all detected faces + their embeddings.
 *
 * @param imageUrl Cloudinary URL of the uploaded image
 * @returns Array of detected faces (empty array if no faces found)
 */
export async function detectFaces(imageUrl: string): Promise<DetectedFace[]> {
  try {
    const response = await axios.post<FaceServiceResponse>(
      `${env.FACE_SERVICE_URL}/detect-faces`,
      { imageUrl },
      { timeout: 30000 } // 30s — face detection can be slow on Render free tier
    );

    return response.data.faces || [];
  } catch (error) {
    // Face service being down shouldn't crash the whole upload —
    // the image still gets saved, just without face grouping.
    console.error("⚠️ Face detection service error:", error);
    return [];
  }
}

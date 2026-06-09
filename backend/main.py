import os
import uuid
import json
import boto3
import pdfplumber

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient

load_dotenv()

app = FastAPI()

# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# CONFIG
# ==========================

S3_BUCKET = "rezum.analyzer"

hf_client = InferenceClient(
    api_key=os.getenv("API_KEY")
)

# ==========================
# HOME API
# ==========================

@app.get("/")
def home():
    return {
        "message": "AI Resume Analyzer Backend Running"
    }

# ==========================
# RESUME ANALYZER API
# ==========================

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name="ap-south-1"
    )

    s3_key = None
    temp_file = None

    try:

        # ==========================
        # Upload PDF to S3
        # ==========================

        file_content = await file.read()

        s3_key = f"resumes/{uuid.uuid4().hex}.pdf"

        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=file_content,
            ContentType="application/pdf"
        )

        # ==========================
        # Download PDF from S3
        # ==========================

        temp_file = f"temp_{uuid.uuid4().hex}.pdf"

        s3_client.download_file(
            S3_BUCKET,
            s3_key,
            temp_file
        )

        # ==========================
        # Extract Text
        # ==========================

        extracted_text = ""

        with pdfplumber.open(temp_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()

                if text:
                    extracted_text += text + "\n"

        # Remove temp file
        os.remove(temp_file)

        # ==========================
        # AI Prompt
        # ==========================

        prompt = f"""
Analyze this resume and return ONLY valid JSON.

{{
    "score": 0,
    "strengths": [],
    "missing_skills": [],
    "suggestions": [],
    "career_recommendations": []
}}

Resume:

{extracted_text[:2000]}
"""

        # ==========================
        # Hugging Face
        # ==========================

        response = hf_client.chat_completion(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        ai_feedback = response.choices[0].message.content

        print("\n========== AI RESPONSE ==========")
        print(ai_feedback)
        print("=================================\n")

        # ==========================
        # Parse JSON
        # ==========================

        try:

            start = ai_feedback.find("{")
            end = ai_feedback.rfind("}") + 1

            json_text = ai_feedback[start:end]

            parsed_data = json.loads(json_text)

        except Exception:

            parsed_data = {
                "score": 0,
                "strengths": [],
                "missing_skills": [],
                "suggestions": [],
                "career_recommendations": []
            }

        # ==========================
        # Delete Resume From S3
        # ==========================

        s3_client.delete_object(
            Bucket=S3_BUCKET,
            Key=s3_key
        )

        # ==========================
        # Return JSON
        # ==========================

        return JSONResponse(
            content={
                "filename": file.filename,
                "score": parsed_data.get("score", 0),
                "strengths": parsed_data.get("strengths", []),
                "missing_skills": parsed_data.get("missing_skills", []),
                "suggestions": parsed_data.get("suggestions", []),
                "career_recommendations": parsed_data.get(
                    "career_recommendations",
                    []
                )
            }
        )

    except Exception as e:

        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
        except:
            pass

        try:
            if s3_key:
                s3_client.delete_object(
                    Bucket=S3_BUCKET,
                    Key=s3_key
                )
        except:
            pass

        return JSONResponse(
            content={
                "error": str(e)
            },
            status_code=500
        )
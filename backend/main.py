import os
import uuid
import pdfplumber
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = InferenceClient(api_key="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")

@app.options("/upload-resume/")
async def options_handler():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Backend Running"}

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    try:
        temp_file = f"temp_{uuid.uuid4().hex}.pdf"
        with open(temp_file, "wb") as f:
            f.write(await file.read())

        extracted_text = ""
        with pdfplumber.open(temp_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        prompt = f"""
Analyze this resume and provide:
1. Resume Score (0-100)
2. Top Strengths
3. Missing Skills
4. Improvement Suggestions
5. Career Recommendations

Resume:
{extracted_text[:1500]}
"""
        response = client.chat_completion(
            model="meta-llama/Llama-3.1-8B-Instruct",
            messages=[{"role": "user", "content": prompt}]
        )

        ai_feedback = response.choices[0].message.content

        if os.path.exists(temp_file):
            os.remove(temp_file)

        return JSONResponse(
            content={
                "filename": file.filename,
                "resume_text": extracted_text[:1000],
                "ai_feedback": ai_feedback
            },
            headers={"Access-Control-Allow-Origin": "*"}
        )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            headers={"Access-Control-Allow-Origin": "*"}
        )
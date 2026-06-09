# AI Resume Analyzer 🚀

## Overview

AI Resume Analyzer is a cloud-based application that helps users analyze and improve their resumes using Artificial Intelligence.

The application allows users to upload a resume, stores it temporarily in Amazon S3, analyzes it using a Hugging Face Large Language Model (LLM), and provides detailed feedback including resume score, strengths, missing skills, improvement suggestions, and career recommendations.

Uploaded resumes are automatically deleted from S3 after analysis for better security and storage management.

---

## Architecture

User → AWS Amplify (React Frontend) → Amazon S3 → Amazon ECS Express Mode (FastAPI Backend) → Hugging Face AI → Analysis Results → User

CloudWatch is used for monitoring and logging.

---

## Features

* Upload PDF resumes
* AI-powered resume analysis
* Resume score generation
* Strength identification
* Missing skills detection
* Improvement recommendations
* Career recommendations
* Temporary S3 storage
* Automatic resume deletion after analysis
* CloudWatch monitoring
* Fully deployed on AWS

---

## Technologies Used

### Frontend

* React.js
* Vite
* Axios
* AWS Amplify

### Backend

* Python
* FastAPI
* Uvicorn
* pdfplumber

### AI

* Hugging Face Inference API
* Llama Model

### AWS Services

* AWS Amplify
* Amazon ECS Express Mode
* Amazon ECR
* Amazon S3
* Amazon CloudWatch
* AWS IAM

### DevOps

* Docker
* Git
* GitHub

---

## Project Workflow

1. User opens the application.
2. User uploads a resume.
3. Resume is stored temporarily in Amazon S3.
4. User clicks Analyze Resume.
5. FastAPI backend running on ECS retrieves the resume.
6. Resume text is extracted using pdfplumber.
7. Hugging Face AI analyzes the resume.
8. Analysis results are returned to the frontend.
9. Resume is automatically deleted from S3.
10. CloudWatch monitors application performance and logs.

---

## Cloud Architecture

* Frontend Hosting: AWS Amplify
* Backend Hosting: Amazon ECS Express Mode
* Container Registry: Amazon ECR
* Storage: Amazon S3
* Monitoring: Amazon CloudWatch
* AI Processing: Hugging Face API

---

## Future Improvements

* ATS Compatibility Score
* Job Role Matching
* DynamoDB Analysis History
* User Authentication with AWS Cognito
* Resume Analysis Dashboard
* Downloadable PDF Reports

---

## Author

**Mittapelly Akhileshwar**

B.Tech – Artificial Intelligence & Machine Learning

LinkedIn: https://www.linkedin.com/in/akhileshwar-mittapelly-b6315924b

GitHub: https://github.com/Akhil4556

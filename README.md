## 🚀 AI Resume Analyzer

📖 Overview

AI Resume Analyzer is a cloud-based application that helps users evaluate and improve their resumes using Artificial Intelligence. Users can upload a resume, receive AI-generated feedback, and get recommendations for improving their profile and career opportunities.

---

## 🏗️ Architecture

User
  ↓
AWS Amplify (React Frontend)
  ↓
Amazon S3 (Temporary Storage)
  ↓
Amazon ECS Express Mode (FastAPI Backend)
  ↓
Hugging Face AI
  ↓
Analysis Results
  ↓
User

Uploaded resumes are temporarily stored in Amazon S3 and automatically deleted after analysis.

---

## ✨ Features

- 📄 Upload resumes in PDF format
- 🤖 AI-powered resume analysis
- 📊 Resume score generation
- 💪 Strength identification
- ⚠️ Missing skill detection
- 🚀 Improvement suggestions
- 🎯 Career recommendations
- 🗑️ Automatic file deletion from S3
- 📈 CloudWatch monitoring and logging

---

## 🛠️ Technologies Used

🎨 Frontend

- React.js
- Vite
- Axios
- AWS Amplify

## ⚙️ Backend

- Python
- FastAPI
- Uvicorn
- pdfplumber

## ☁️ AWS Services

- Amazon ECS Express Mode
- Amazon ECR
- Amazon S3
- AWS Amplify
- Amazon CloudWatch
- AWS IAM

## 🧠 AI Integration

- Hugging Face Inference API
- Llama Model

## 🔧 DevOps & Tools

- Docker
- Git
- GitHub

---

## 🔄 Project Workflow

1️⃣ User Uploads Resume

User opens the application and uploads a PDF resume.

2️⃣ Resume Stored in S3

The uploaded resume is temporarily stored in Amazon S3.

3️⃣ Resume Analysis

FastAPI backend running on Amazon ECS retrieves and processes the resume.

4️⃣ AI Processing

Resume text is extracted using pdfplumber and analyzed by Hugging Face AI.

5️⃣ AI Generates Insights

- 📊 Resume Score
- 💪 Top Strengths
- ⚠️ Missing Skills
- 🚀 Improvement Suggestions
- 🎯 Career Recommendations

6️⃣ Results Displayed

Analysis results are displayed on the React frontend.

7️⃣ Automatic Cleanup

The uploaded resume is automatically deleted from Amazon S3.

---

## ☁️ AWS Architecture

Service| Purpose

🌐 AWS Amplify| Frontend Hosting

📦 Amazon S3| Temporary Resume Storage

🐳 Amazon ECS Express Mode| Backend Hosting

📁 Amazon ECR| Docker Image Repository

📈 Amazon CloudWatch| Monitoring & Logging

🔐 AWS IAM| Access Management

---

## 🎯 Skills Demonstrated

- Full Stack Development
- Cloud Computing (AWS)
- Docker Containerization
- REST API Development
- Artificial Intelligence Integration
- ECS Deployment
- Monitoring & Logging
- Object Storage Management
- DevOps Fundamentals

---

## 🚀 Future Improvements

- 📊 ATS Compatibility Score
- 🗄️ DynamoDB Resume History
- 🔑 AWS Cognito Authentication
- 📥 Downloadable PDF Reports
- 🎯 Career Match Percentage
- 📈 Analytics Dashboard
- 📱 Mobile Responsive Enhancements

---

## 👨‍💻 Author

Akhileshwar Mittapelly

📧 Email: akkhil074@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/akhileshwar-mittapelly-b6315924b

🐙 GitHub: https://github.com/Akhil4556

---

⭐ If you like this project, consider giving it a star on GitHub!

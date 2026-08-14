import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const apiDocContent = `# 📡 CareerCoach AI — API Reference Documentation

**Base URL:** \`http://localhost:5000/api\`  
**Authentication Standard:** HTTP Authorization Header using Bearer token (\`Authorization: Bearer <jwt_token>\`)

---

## 1. System Health

### \`GET /health\`
Verifies server initialization, Express middleware health, and database availability.

* **Headers:** None
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "status": "ok",
  "message": "Backend is initialized in app.js"
}
\`\`\`

---

## 2. Authentication Module

### \`POST /auth/register\`
Creates a new user profile with password encryption (bcrypt salt: 10) and issues an authentication JWT.

* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
\`\`\`
* **Success Response (\`201 Created\`):**
\`\`\`json
{
  "user": {
    "_id": "6a7eacae7bd5544f5e5308c4",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

### \`POST /auth/login\`
Validates user credentials against stored bcrypt hashes and returns an authorized session token.

* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
\`\`\`
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "user": {
    "_id": "6a7eacae7bd5544f5e5308c4",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

## 3. Resume Ingestion & CRUD Module

### \`POST /resume/upload\`
Uploads a binary resume (\`.pdf\` or \`.docx\`), parses text in-memory via \`pdf-parse\`/\`mammoth\` streams, and returns raw extracted text without persisting disk clutter.

* **Security:** \`Bearer <JWT>\`
* **Request Headers:** \`Content-Type: multipart/form-data\`
* **Form Field:** \`resume\` (Binary file)
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "success": true,
  "fileName": "resume.pdf",
  "parsedText": "Jane Doe\\nFull Stack Developer\\nExperience: React, Node.js, Express, MongoDB..."
}
\`\`\`

---

### \`GET /resumes/my-resumes\`
Retrieves all historical resumes associated with the authenticated user.

* **Security:** \`Bearer <JWT>\`
* **Success Response (\`200 OK\`):**
\`\`\`json
[
  {
    "_id": "66bc0f29c2980e1234567890",
    "fileName": "resume.pdf",
    "createdAt": "2026-08-14T06:00:00.000Z"
  }
]
\`\`\`

---

## 4. AI ATS Optimization Module

### \`POST /analysis/match\`
Sends candidate resume text and target Job Description text through LLMs with structured Zod extraction schemas to calculate the ATS match percentage and skill gap.

* **Security:** \`Bearer <JWT>\`
* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "resumeText": "Full Stack Developer skilled in React, Node.js, MongoDB.",
  "jobDescriptionText": "Looking for a MERN developer with React, Node.js, MongoDB, Docker, and Redis experience."
}
\`\`\`
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "matchScore": 60,
  "resumeData": {
    "hardSkills": ["React", "Node.js", "MongoDB"],
    "softSkills": ["Problem Solving"],
    "seniority": "mid"
  },
  "jdData": {
    "mustHaveSkills": ["React", "Node.js", "MongoDB", "Docker", "Redis"],
    "niceToHaveSkills": ["TypeScript", "AWS"],
    "seniorityLevel": "mid"
  },
  "keywordGap": {
    "matchedSkills": ["React", "Node.js", "MongoDB"],
    "missingKeywords": ["Docker", "Redis"],
    "matchedCount": 3,
    "totalRequired": 5
  },
  "feedback": [
    "Add production Docker containerization experience.",
    "Highlight caching strategies using Redis."
  ]
}
\`\`\`

---

## 5. Mock Interview Module

### \`POST /interview/start\`
Initializes a new mock interview session and prompts the LLM to dynamically generate tailored interview questions (3 technical + 2 behavioral) based on the candidate's resume and target JD.

* **Security:** \`Bearer <JWT>\`
* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "jobTitle": "Full Stack Engineer",
  "resumeText": "Experienced in React, Node.js, Express, and MongoDB.",
  "jobDescription": "Build scalable backend APIs and reactive UI components.",
  "difficulty": "mid",
  "questionCount": 5
}
\`\`\`
* **Success Response (\`201 Created\`):**
\`\`\`json
{
  "_id": "6a7eb119aef770560c70cf99",
  "jobTitle": "Full Stack Engineer",
  "status": "in_progress",
  "questions": [
    {
      "question": "How do you handle asynchronous flow control and error propagation in Node.js?",
      "type": "technical"
    },
    {
      "question": "Can you explain the difference between controlled and uncontrolled components in React?",
      "type": "technical"
    },
    {
      "question": "Describe a scenario where you resolved a merge conflict or technical disagreement in a team setting.",
      "type": "behavioral"
    }
  ]
}
\`\`\`

---

### \`POST /interview/submit-answer\`
Submits a candidate's voice-transcribed or typed answer for rubric-based AI evaluation and appends scoring metrics to the active session.

* **Security:** \`Bearer <JWT>\`
* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "sessionId": "6a7eb119aef770560c70cf99",
  "questionIndex": 0,
  "question": "How do you handle asynchronous flow control and error propagation in Node.js?",
  "answer": "I use async/await with try-catch blocks and centralize error propagation via Express error handling middlewares."
}
\`\`\`
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "success": true,
  "feedback": {
    "score": 9,
    "clarity": "Clear and structured explanation.",
    "technicalAccuracy": "Accurately covered try-catch and centralized error middleware.",
    "suggestions": "Mention handling unhandled promise rejections."
  },
  "nextQuestion": {
    "question": "Can you explain the difference between controlled and uncontrolled components in React?",
    "type": "technical",
    "questionIndex": 1
  },
  "isComplete": false
}
\`\`\`

---

### \`POST /interview/complete\`
Concludes the interview session, generates end-of-session aggregate performance insights, and marks session status as \`completed\`.

* **Security:** \`Bearer <JWT>\`
* **Request Headers:** \`Content-Type: application/json\`
* **Request Body:**
\`\`\`json
{
  "sessionId": "6a7eb119aef770560c70cf99"
}
\`\`\`
* **Success Response (\`200 OK\`):**
\`\`\`json
{
  "status": "completed",
  "overallScore": 88,
  "strengths": [
    "Strong understanding of Node.js asynchronous architecture.",
    "Structured problem-solving approach."
  ],
  "improvements": [
    "Elaborate more on metric outcomes using the STAR framework."
  ]
}
\`\`\`
`;

const archDocContent = `# 🏛️ CareerCoach AI — System Architecture Documentation

---

## 1. High-Level System Architecture

CareerCoach AI uses a decoupled **MERN (MongoDB, Express, React, Node.js)** architecture, integrated with **xAI Grok / Groq Large Language Models** for structured extraction, real-time rubric evaluation, and mock interview session state management.

\`\`\`
┌──────────────────────────────────────────────────────────────────────────┐
│                         REACT + VITE FRONTEND                            │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────┐  │
│  │ ATS Score & Ingestion │  │ Voice/Text Q&A Studio │  │ Auth Context │  │
│  │ (Dropzone/Gauge UI)   │  │ (Web Speech API + STT)│  │ (JWT Tokens) │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └──────┬───────┘  │
└──────────────┼──────────────────────────┼─────────────────────┼──────────┘
               │ (Axios REST + Multipart) │                     │
               ▼                          ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          NODE.JS / EXPRESS API                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Middlewares: JWT Auth | Multer Memory Buffer | Zod Request Guard   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│       │                      │                      │                    │
│       ▼                      ▼                      ▼                    │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐            │
│  │ File Parsing │      │ Core Routers │      │  AI Service  │            │
│  │ (pdf-parse / │      │ (Auth, Resume│      │  Orchestrator│            │
│  │   mammoth)   │      │  Interview)  │      │(Grok SDK/Zod)│            │
│  └──────────────┘      └──────┬───────┘      └──────┬───────┘            │
└───────────────────────────────┼─────────────────────┼────────────────────┘
                                │                     │
                                ▼                     ▼
                   ┌───────────────────────┐   ┌──────────────────────────┐
                   │  MongoDB Atlas        │   │ xAI Grok / Groq API      │
                   │  (Users, Resumes,     │   │ (Structured Extraction & │
                   │   Interview Sessions) │   │  STAR Rubric Scoring)    │
                   └───────────────────────┘   └──────────────────────────┘
\`\`\`

---

## 2. Core Subsystems

### 1. Client Application (Frontend)
* **Framework:** React SPA powered by Vite.
* **Design & Styling:** Tailwind CSS with reusable design tokens (\`Button\`, \`Card\`, \`Skeleton\`, \`Spinner\`).
* **Speech Integration:** Native Web Speech API integration (\`useSpeechToText.js\`) with dynamic real-time audio visualization (\`useMicVisualizer.js\`).
* **State Management:** \`AuthContext.jsx\` for persistent token storage and automatic authorization header injection across Axios requests.

---

### 2. Application Server (Backend)
* **Runtime & Routing:** Node.js (ES Modules) and Express utilizing a modular **Controller-Service-Repository** pattern.
* **Streaming Ingestion:** \`multer.memoryStorage()\` consumes PDF and DOCX uploads into memory buffers, passing them immediately to \`pdf-parse\` or \`mammoth\` for text extraction without disk I/O bottlenecks.
* **Security & Middleware:**
  * \`auth.middleware.js\`: Verifies signed JWT Bearer tokens.
  * \`validate.middleware.js\`: Enforces strict payload schemas before hitting controllers.
  * \`errorHandler.middleware.js\`: Standardizes centralized error responses and 404 catches.

---

### 3. AI Service Orchestration Layer
* **Model Integration:** \`@ai-sdk\` / xAI SDK initialized with custom temperature and top-p tuning.
* **Structured Output Guarantee:** Employs Zod schemas (\`ResumeExtractionSchema\`, \`JDExtractionSchema\`) to eliminate hallucinations and enforce clean JSON parsing.
* **Deterministic Matching Algorithm:**
  $$\\text{Match Score} = \\left(\\frac{\\text{Matched Required Skills}}{\\text{Total Required Skills}}\\right) \\times 100$$
* **Multi-Turn Interview Engine:**
  * Dynamically splits question generation into 3 Technical and 2 Behavioral prompts based on extracted candidate skills.
  * Evaluates responses per question across three dimensions: **Technical Accuracy**, **Clarity**, and **STAR Method Alignment**.

---

## 3. Database Schema Entity Relationships

\`\`\`
 ┌──────────────────────┐        ┌───────────────────────────────┐
 │     User Model       │        │         Resume Model          │
 ├──────────────────────┤        ├───────────────────────────────┤
 │ _id: ObjectId        │◄──┐    │ _id: ObjectId                 │
 │ name: String         │   │    │ user: ObjectId (Ref: User)    │
 │ email: String (uniq) │   └───┼│ fileName: String              │
 │ password: String     │        │ rawText: String               │
 │ createdAt: Date      │        │ skills: Array<String>         │
 └──────────────────────┘        └───────────────────────────────┘
                                                 │
 ┌────────────────────────────────────────┐      │
 │        InterviewSession Model          │      │
 ├────────────────────────────────────────┤      │
 │ _id: ObjectId                          │      │
 │ user: ObjectId (Ref: User)             │      │
 │ jobTitle: String                       │      │
 │ status: 'in_progress' | 'completed'    │      │
 │ questions: Array<{                     │◄─────┘
 │   question: String,                    │
 │   type: 'technical' | 'behavioral',    │
 │   candidateAnswer: String,             │
 │   score: Number,                       │
 │   feedback: Object                     │
 │ }>                                     │
 │ overallScore: Number                   │
 │ summary: { strengths, improvements }   │
 └────────────────────────────────────────┘
\`\`\`

---

## 4. End-to-End User Data Flows

### A. Resume Upload & ATS Matching Flow
1. User uploads a PDF/DOCX file $\\rightarrow$ \`POST /api/resume/upload\`.
2. Multer reads buffer $\\rightarrow$ \`pdfParser.service.js\` extracts raw text.
3. User supplies Job Description $\\rightarrow$ \`POST /api/analysis/match\`.
4. \`analyzeResumeMatch.js\` invokes Grok prompts (\`atsExtraction.js\` and \`jdSkillCategorization.js\`).
5. Zod parses JSON extraction $\\rightarrow$ Intersection algorithm computes score and keyword gap $\\rightarrow$ UI renders \`MatchScoreGauge.jsx\` and \`MissingKeywordsList.jsx\`.

### B. Mock Interview Flow
1. User configures role $\\rightarrow$ \`POST /api/interview/start\`.
2. Grok generates 5 role-specific questions $\\rightarrow$ saved to MongoDB \`InterviewSession\` (\`in_progress\`).
3. Candidate records answer via speech-to-text $\\rightarrow$ \`POST /api/interview/submit-answer\`.
4. Grok evaluates answer clarity and correctness $\\rightarrow$ feedback recorded per question.
5. Final question complete $\\rightarrow$ \`POST /api/interview/complete\` $\rightarrow$ returns overall summary and score.
`;

const apiDocPath = path.join(projectRoot, 'API_DOCUMENTATION.md');
const archDocPath = path.join(projectRoot, 'ARCHITECTURE.md');

fs.writeFileSync(apiDocPath, apiDocContent, 'utf8');
fs.writeFileSync(archDocPath, archDocContent, 'utf8');

console.log('====================================================');
console.log('📄 DOCUMENTATION FILES GENERATED SUCCESSFULLY');
console.log('====================================================');
console.log(`✅ API Documentation:  ${apiDocPath}`);
console.log(`✅ Architecture Doc:   ${archDocPath}`);
console.log('====================================================\n');
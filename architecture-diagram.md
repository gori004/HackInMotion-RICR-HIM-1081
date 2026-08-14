markdown

# 🏛️ CareerCoach AI — System Architecture Documentation

---

## 1. High-Level System Architecture

CareerCoach AI uses a decoupled _MERN (MongoDB, Express, React, Node.js)_ architecture, integrated with _xAI Grok / Groq Large Language Models_ for structured extraction, real-time rubric evaluation, and mock interview session state management.

┌──────────────────────────────────────────────────────────────────────────┐
│ REACT + VITE FRONTEND │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────┐ │
│ │ ATS Score & Ingestion │ │ Voice/Text Q&A Studio │ │ Auth Context │ │
│ │ (Dropzone/Gauge UI) │ │ (Web Speech API + STT)│ │ (JWT Tokens) │ │
│ └───────────┬───────────┘ └───────────┬───────────┘ └──────┬───────┘ │
└──────────────┼──────────────────────────┼─────────────────────┼──────────┘
│ (Axios REST + Multipart) │ │
▼ ▼ ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ NODE.JS / EXPRESS API │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Middlewares: JWT Auth | Multer Memory Buffer | Zod Request Guard │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ File Parsing │ │ Core Routers │ │ AI Service │ │
│ │ (pdf-parse / │ │ (Auth, Resume│ │ Orchestrator│ │
│ │ mammoth) │ │ Interview) │ │(Grok SDK/Zod)│ │
│ └──────────────┘ └──────┬───────┘ └──────┬───────┘ │
└───────────────────────────────┼─────────────────────┼────────────────────┘
│ │
▼ ▼
┌───────────────────────┐ ┌──────────────────────────┐
│ MongoDB Atlas │ │ xAI Grok / Groq API │
│ (Users, Resumes, │ │ (Structured Extraction & │
│ Interview Sessions) │ │ STAR Rubric Scoring) │
└───────────────────────┘ └──────────────────────────┘

---

## 2. Core Subsystems

### 1. Client Application (Frontend)

- _Framework:_ React SPA powered by Vite.
- _Design & Styling:_ Tailwind CSS with reusable design tokens (Button, Card, Skeleton, Spinner).
- _Speech Integration:_ Native Web Speech API integration (useSpeechToText.js) with dynamic real-time audio visualization (useMicVisualizer.js).
- _State Management:_ AuthContext.jsx for persistent token storage and automatic authorization header injection across Axios requests.

---

### 2. Application Server (Backend)

- _Runtime & Routing:_ Node.js (ES Modules) and Express utilizing a modular _Controller-Service-Repository_ pattern.
- _Streaming Ingestion:_ multer.memoryStorage() consumes PDF and DOCX uploads into memory buffers, passing them immediately to pdf-parse or mammoth for text extraction without disk I/O bottlenecks.
- _Security & Middleware:_
  - auth.middleware.js: Verifies signed JWT Bearer tokens.
  - validate.middleware.js: Enforces strict payload schemas before hitting controllers.
  - errorHandler.middleware.js: Standardizes centralized error responses and 404 catches.

---

### 3. AI Service Orchestration Layer

- _Model Integration:_ @ai-sdk / xAI SDK initialized with custom temperature and top-p tuning.
- _Structured Output Guarantee:_ Employs Zod schemas (ResumeExtractionSchema, JDExtractionSchema) to eliminate hallucinations and enforce clean JSON parsing.
- _Deterministic Matching Algorithm:_
  $$\text{Match Score} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 100$$
- _Multi-Turn Interview Engine:_
  - Dynamically splits question generation into 3 Technical and 2 Behavioral prompts based on extracted candidate skills.
  - Evaluates responses per question across three dimensions: _Technical Accuracy, **Clarity, and **STAR Method Alignment_.

---

## 3. Database Schema Entity Relationships

┌──────────────────────┐ ┌───────────────────────────────┐
│ User Model │ │ Resume Model │
├──────────────────────┤ ├───────────────────────────────┤
│ \_id: ObjectId │◄──┐ │ \_id: ObjectId │
│ name: String │ │ │ user: ObjectId (Ref: User) │
│ email: String (uniq) │ └───┼│ fileName: String │
│ password: String │ │ rawText: String │
│ createdAt: Date │ │ skills: Array │
└──────────────────────┘ └───────────────────────────────┘
│
┌────────────────────────────────────────┐ │
│ InterviewSession Model │ │
├────────────────────────────────────────┤ │
│ \_id: ObjectId │ │
│ user: ObjectId (Ref: User) │ │
│ jobTitle: String │ │
│ status: 'in_progress' | 'completed' │ │
│ questions: Array<{ │◄─────┘
│ question: String, │
│ type: 'technical' | 'behavioral', │
│ candidateAnswer: String, │
│ score: Number, │
│ feedback: Object │
│ }> │
│ overallScore: Number │
│ summary: { strengths, improvements } │
└────────────────────────────────────────┘

---

## 4. End-to-End User Data Flows

### A. Resume Upload & ATS Matching Flow

1. User uploads a PDF/DOCX file $\rightarrow$ POST /api/resume/upload.
2. Multer reads buffer $\rightarrow$ pdfParser.service.js extracts raw text.
3. User supplies Job Description $\rightarrow$ POST /api/analysis/match.
4. analyzeResumeMatch.js invokes Grok prompts (atsExtraction.js and jdSkillCategorization.js).
5. Zod parses JSON extraction $\rightarrow$ Intersection algorithm computes score and keyword gap $\rightarrow$ UI renders MatchScoreGauge.jsx and MissingKeywordsList.jsx.

### B. Mock Interview Flow

1. User configures role $\rightarrow$ POST /api/interview/start.
2. Grok generates 5 role-specific questions $\rightarrow$ saved to MongoDB InterviewSession (in_progress).
3. Candidate records answer via speech-to-text $\rightarrow$ POST /api/interview/submit-answer.
4. Grok evaluates answer clarity and correctness $\rightarrow$ feedback recorded per question.
5. Final question complete $\rightarrow$ POST /api/interview/complete $\rightarrow$ returns overall summary and score.

```

```

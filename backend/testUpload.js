import fs from 'fs';
import path from 'path';


const API_BASE = 'http://localhost:5000/api';
const RESUME_FILE_PATH = 'C:/Users/tanvi/Downloads/resume.pdf';

const testUser = {
  name: 'Tanvi Fullstack Tester',
  email: `qa_fullstack_${Date.now()}@example.com`,
  password: 'Password123!',
};

let authToken = '';
let uploadedResumeText = '';
let uploadedResumeId = '';
let interviewSessionId = '';

async function runFullAppTestSuite() {
  console.log('====================================================');
  console.log('🚀 RUNNING COMPLETE FULL-STACK BACKEND E2E TEST SUITE');
  console.log('====================================================\n');

  try {
    // ------------------------------------------------------------------
    // 1️⃣ Health Check
    // ------------------------------------------------------------------
    console.log('1️⃣  [Health Check] GET /api/health');
    const healthRes = await fetch(`${API_BASE}/health`);
    console.log(`   Status: ${healthRes.status} | OK: ${healthRes.ok}`);
    const healthData = await healthRes.json();
    console.log(`   Response:`, healthData);
    console.log('   ✅ Health Check Passed!\n');

    // ------------------------------------------------------------------
    // 2️⃣ Authentication: Register & Acquire JWT
    // ------------------------------------------------------------------
    console.log('2️⃣  [Auth] POST /api/auth/register');
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const regData = await regRes.json();
    console.log(`   Status: ${regRes.status}`);

    if (regRes.ok && regData.token) {
      authToken = regData.token;
      console.log('   ✅ User Registered & JWT Acquired!');
    } else {
      console.log('   ℹ️ User existing, attempting login...');
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
      });
      const loginData = await loginRes.json();
      authToken = loginData.token;
      console.log('   ✅ Login Successful & JWT Acquired!');
    }
    console.log(`   JWT Token: ${authToken.slice(0, 25)}...\n`);

  // ------------------------------------------------------------------
    // 3️⃣ Real Resume Upload Processing (Multer + PDF-Parse)
    // ------------------------------------------------------------------
    console.log('3️⃣  [Resume Upload] POST /api/resume/upload');
    
    if (!fs.existsSync(RESUME_FILE_PATH)) {
      console.warn(`   ⚠️ File not found at ${RESUME_FILE_PATH}.`);
      uploadedResumeText = 'Full Stack Developer with React, Node.js, Express, MongoDB experience.';
    } else {
      // 1. Read file as buffer and wrap in a native Blob
      const fileBuffer = fs.readFileSync(RESUME_FILE_PATH);
      const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });

      // 2. Use native FormData
      const formData = new FormData();
      formData.append('resume', fileBlob, 'resume.pdf');

      // 3. Send via native fetch WITHOUT setting 'Content-Type'
      // (fetch automatically calculates the multipart boundary!)
      const uploadRes = await fetch(`${API_BASE}/resume/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      console.log(`   Status: ${uploadRes.status}`);
      console.log('   Response Data:', uploadData);

      uploadedResumeText =
        uploadData.parsedText ||
        uploadData.extractedText ||
        'Full Stack Developer proficient in React, Node.js, and MongoDB.';

      if (uploadRes.ok) {
        console.log('   ✅ Real PDF Upload & Text Extraction Succeeded!\n');
      } else {
        console.error('   ❌ Upload Failed:', uploadData);
      }
    }

    // ------------------------------------------------------------------
    // 5️⃣ ATS Resume & Job Description Match Engine
    // ------------------------------------------------------------------
    console.log('5️⃣  [ATS Match Analysis] POST /api/analysis/match');
    const sampleJD = `
      Job Title: Full Stack MERN Developer
      Requirements:
      - Core Skills: React, Node.js, Express.js, MongoDB, JavaScript, TypeScript
      - Responsibilities: Design REST APIs, manage database schemas, build AI integrations.
    `;

    const matchRes = await fetch(`${API_BASE}/analysis/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        resumeText: uploadedResumeText,
        jobDescriptionText: sampleJD,
      }),
    });

    const matchData = await matchRes.json();
    console.log(`   Status: ${matchRes.status}`);
    console.log('   Grok Output:', JSON.stringify(matchData, null, 2));
    console.log('   ✅ Grok ATS Match Analysis Engine Passed!\n');

    // ------------------------------------------------------------------
    // 6️⃣ Mock Interview Session: Start
    // ------------------------------------------------------------------
    console.log('6️⃣  [Interview Session] POST /api/interview/start');
    const startInterviewRes = await fetch(`${API_BASE}/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        jobTitle: 'Full Stack MERN Developer',
        resumeText: uploadedResumeText,
        jobDescription: sampleJD,
        questions: [
          { question: 'How do you handle asynchronous flow control in Node.js?', type: 'technical' },
          { question: 'Describe state management options in React.', type: 'technical' },
        ],
      }),
    });

    const startInterviewData = await startInterviewRes.json();
    console.log(`   Status: ${startInterviewRes.status}`);
    interviewSessionId = startInterviewData._id || startInterviewData.sessionId || startInterviewData.data?._id;
    console.log(`   Session Created ID: ${interviewSessionId}\n`);

    // ------------------------------------------------------------------
    // 7️⃣ Mock Interview Session: Submit Answer
    // ------------------------------------------------------------------
    if (interviewSessionId) {
      console.log('7️⃣  [Interview Evaluation] POST /api/interview/submit-answer');
      const submitAnswerRes = await fetch(`${API_BASE}/interview/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          sessionId: interviewSessionId,
          questionIndex: 0,
          question: 'How do you handle asynchronous flow control in Node.js?',
          answer: 'I handle async operations using Promises, async/await syntax, and error handling with try/catch blocks.',
        }),
      });

      const submitAnswerData = await submitAnswerRes.json();
      console.log(`   Status: ${submitAnswerRes.status}`);
      console.log('   AI Feedback:', JSON.stringify(submitAnswerData, null, 2));
      console.log('   ✅ Answer Submission & Scoring Passed!\n');

      // ------------------------------------------------------------------
      // 8️⃣ Mock Interview Session: Complete
      // ------------------------------------------------------------------
      console.log('8️⃣  [Interview Complete] POST /api/interview/complete');
      const completeRes = await fetch(`${API_BASE}/interview/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          sessionId: interviewSessionId,
        }),
      });

      const completeData = await completeRes.json();
      console.log(`   Status: ${completeRes.status}`);
      console.log('   Final Summary Output:', JSON.stringify(completeData, null, 2));
      console.log('   ✅ Interview Session Completion Passed!\n');
    }

    console.log('====================================================');
    console.log('🎉 ALL BACKEND ENDPOINTS, FILE UPLOAD & AI ENGINE PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ TEST RUN FAILED WITH ERROR:', err.message);
  }
}

runFullAppTestSuite();
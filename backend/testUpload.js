import fs from 'fs';
import path from 'path';

const FILE_PATH = 'C:/Users/tanvi/Downloads/resume.pdf';
const API_BASE = 'http://localhost:5000/api';

const run = async () => {
  try {
    // 1. Log in to fetch a guaranteed valid token
    console.log('1. Authenticating test user...');
    let authRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com', password: 'password123' }),
    });

    let authData = await authRes.json();

    // Register if user doesn't exist in DB
    if (!authRes.ok) {
      console.log('   User not found, registering test user...');
      const regRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'testuser@example.com', password: 'password123' }),
      });
      authData = await regRes.json();
    }

    const token = authData.token;
    if (!token) {
      console.error('Failed to obtain token:', authData);
      return;
    }
    console.log('   Token acquired successfully!');

    // 2. Read resume file
    if (!fs.existsSync(FILE_PATH)) {
      console.error(`File not found at: ${FILE_PATH}`);
      return;
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const formData = new FormData();
    formData.append('resume', new Blob([fileBuffer], { type: 'application/pdf' }), path.basename(FILE_PATH));

    // 3. Upload resume using dynamic Bearer token
    console.log('\n2. Uploading resume...');
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Execution error:', err.message);
  }
};

run();
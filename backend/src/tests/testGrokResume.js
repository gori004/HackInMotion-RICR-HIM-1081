const { analyzeResumeMatch } = require("../services/analyzeResumeMatch");

const sampleResume = `
John Doe
Software Engineer with 3 years of experience in React, Node.js, and MongoDB.
Built REST APIs, led a team of 2 juniors, improved deployment pipeline using Docker.
B.Tech in Computer Science, XYZ University.
`;

const sampleJD = `
We are hiring a Backend Engineer with experience in Node.js, Express, PostgreSQL.
Must have: REST API design, Docker, CI/CD.
Nice to have: AWS, Kubernetes.
`;

(async () => {
  try {
    const result = await analyzeResumeMatch(sampleResume, sampleJD);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Test failed:", err.message);
  }
})();

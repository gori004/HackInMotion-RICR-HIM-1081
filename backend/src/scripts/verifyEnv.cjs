require("dotenv").config();

function verifyGrokEnv() {
  const requiredVars = ["GROK_API_KEY"];
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
    process.exit(1);
  }

  console.log("All required Grok environment variables are present.");
  console.log(`XAI_API_KEY loaded: ${process.env.XAI_API_KEY.slice(0, 4)}****`);
}

verifyGrokEnv();

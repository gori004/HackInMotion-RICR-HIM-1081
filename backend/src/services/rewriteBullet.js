const grokClient = require("../config/grokClient");
const { BULLET_REWRITER_SYSTEM_PROMPT } = require("../prompts/bulletRewriter");

async function rewriteBullet(originalBullet, jdContext) {
  const response = await grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: BULLET_REWRITER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Bullet: ${originalBullet}\nJD Context: ${jdContext}`,
      },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { rewriteBullet };

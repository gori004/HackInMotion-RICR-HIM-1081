async function fastCompletion(
  grokClient,
  { systemPrompt, userContent, maxTokens = 500 },
) {
  return grokClient.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    max_tokens: maxTokens,
    temperature: 0.3,
  });
}

module.exports = { fastCompletion };

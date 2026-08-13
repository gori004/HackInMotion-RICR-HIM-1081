function logAIUsage({
  endpoint,
  model,
  promptTokens,
  completionTokens,
  latencyMs,
}) {
  const totalTokens = (promptTokens || 0) + (completionTokens || 0);
  console.log(
    `[AI LOG] endpoint=${endpoint} model=${model} promptTokens=${promptTokens} ` +
      `completionTokens=${completionTokens} totalTokens=${totalTokens} latencyMs=${latencyMs}`,
  );
}

async function withAILogging(endpoint, model, fn) {
  const start = Date.now();
  const response = await fn();
  const latencyMs = Date.now() - start;
  logAIUsage({
    endpoint,
    model,
    promptTokens: response?.usage?.prompt_tokens,
    completionTokens: response?.usage?.completion_tokens,
    latencyMs,
  });
  return response;
}

module.exports = { logAIUsage, withAILogging };

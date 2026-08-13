async function callGrokWithFallback(fn, retries = 2, delayMs = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit = err?.status === 429;
      const isLast = attempt === retries;
      if (!isRateLimit || isLast) {
        if (isRateLimit) {
          throw new Error(
            "AI service is busy right now. Please try again in a moment.",
          );
        }
        throw err;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }
}

module.exports = { callGrokWithFallback };

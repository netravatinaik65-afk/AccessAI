import app from './app.js';
import config from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`[AccessAI Server] Running in ${config.nodeEnv} mode`);
  console.log(`[AccessAI Server] URL: http://localhost:${PORT}`);
  console.log(`[AccessAI Server] Health Check: http://localhost:${PORT}/api/health`);
  console.log(`[AccessAI Server] Configured Gemini Model: ${config.geminiModel}`);
});

import app from './app';
import { config } from './config/env';
import { connectDB, disconnectDB } from './config/db';

const startServer = async () => {
  // Connect to database if URI configured
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`[Server] VEXTRALOOM API running on http://localhost:${config.port} (${config.nodeEnv})`);
    console.log(`[Server] Health check available at http://localhost:${config.port}/api/v1/health`);
  });

  // Graceful shutdown handlers
  const handleShutdown = async (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDB();
      console.log('[Server] HTTP server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('[Server] Fatal startup error:', error);
  process.exit(1);
});

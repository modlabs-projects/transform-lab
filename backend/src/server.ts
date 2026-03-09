/*
 * Server entry point.
 * Starts the Express application, connects to Prisma,
 * and handles graceful shutdown on SIGTERM/SIGINT.
 *
 * Equivalent to Java SampleWebUiApplication.main():
 *   SpringApplication.run(SampleWebUiApplication.class, args);
 */

import app from './app';
import env from './config/env';
import { getPrismaClient, disconnectPrisma } from './config/database';

const prisma = getPrismaClient();

async function startServer(): Promise<void> {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('[INFO] Database connected successfully');

    // Start the HTTP server
    const server = app.listen(env.PORT, () => {
      console.log(`[INFO] Server is running on port ${env.PORT}`);
      console.log(`[INFO] Environment: ${env.NODE_ENV}`);
      console.log(`[INFO] API docs available at http://localhost:${env.PORT}/api-docs`);
      console.log(`[INFO] Health check at http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n[INFO] Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('[INFO] HTTP server closed');
        await disconnectPrisma();
        console.log('[INFO] Database connection closed');
        process.exit(0);
      });

      // Force exit after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('[ERROR] Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[ERROR] Failed to start server:', error);
    await disconnectPrisma();
    process.exit(1);
  }
}

startServer();

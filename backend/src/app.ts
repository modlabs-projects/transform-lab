/*
 * Express application configuration.
 * Sets up the middleware stack, routes, and error handling.
 *
 * Middleware order:
 * 1. Helmet (security headers)
 * 2. CORS
 * 3. JSON body parser
 * 4. URL-encoded body parser
 * 5. Logging middleware
 * 6. Routes
 * 7. Error handler (must be last)
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

import env from './config/env';
import messageRouter from './controllers/messageController';
import { errorHandler } from './middleware/errorHandler';
import { loggingMiddleware } from './middleware/loggingMiddleware';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(loggingMiddleware);

// API routes
app.use('/api/messages', messageRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Swagger UI documentation
const swaggerPath = path.resolve(process.cwd(), 'swagger.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Global error handler (must be last middleware)
app.use(errorHandler);

export default app;

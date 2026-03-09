/*
 * Request logging middleware for Express.
 * Uses Winston structured logger for configurable log levels and formats.
 * Logs incoming requests with method, URL, status code, and response time.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Logging middleware that logs all incoming HTTP requests.
 * Logs the method, URL, status code, and response time using structured logging.
 */
export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  // Log when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    if (res.statusCode >= 500) {
      logger.error('Request completed with server error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed with client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
}

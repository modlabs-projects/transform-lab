/*
 * Global error handling middleware for Express.
 * Catches all errors, maps AppError subclasses to appropriate HTTP status codes,
 * and returns consistent JSON error responses.
 *
 * Migrated from Spring Boot @ExceptionHandler pattern to Express error middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Global error handler middleware.
 * Must be registered as the last middleware in the Express application.
 *
 * Error response format:
 * {
 *   error: string,      // Error type name
 *   message: string,     // Human-readable error message
 *   statusCode: number,  // HTTP status code
 *   errors?: Array,      // Optional field-level validation errors
 *   stack?: string       // Stack trace (development only)
 * }
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default to 500 Internal Server Error
  let statusCode = 500;
  let errorName = 'Internal Server Error';
  let message = 'An unexpected error occurred';

  // Map AppError subclasses to appropriate status codes
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorName = err.name;
    message = err.message;
  }

  // Build the error response
  const errorResponse: Record<string, unknown> = {
    error: errorName,
    message: message,
    statusCode: statusCode,
  };

  // Include field-level validation errors if present
  if (err instanceof ValidationError && err.errors.length > 0) {
    errorResponse.errors = err.errors;
  }

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Log the error for debugging
  logger.error(`${statusCode} ${errorName}: ${message}`, {
    statusCode,
    error: errorName,
    url: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
  });

  res.status(statusCode).json(errorResponse);
}

/*
 * Custom error classes for consistent error handling across the application.
 * Each error class extends a base AppError with an HTTP status code,
 * enabling the global error handler middleware to map errors to appropriate responses.
 */

/**
 * Base application error class with HTTP status code support.
 * All custom errors should extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Maps to HTTP 404 Not Found.
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Error thrown when request validation fails.
 * Maps to HTTP 400 Bad Request.
 */
export class ValidationError extends AppError {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(
    message = 'Validation failed',
    errors: Array<{ field: string; message: string }> = []
  ) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Error thrown when business logic rules are violated.
 * Maps to HTTP 422 Unprocessable Entity.
 */
export class BusinessLogicError extends AppError {
  constructor(message = 'Business logic error') {
    super(message, 422);
  }
}

/**
 * Error thrown when authentication fails.
 * Maps to HTTP 401 Unauthorized.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Error thrown when a user lacks permission for an action.
 * Maps to HTTP 403 Forbidden.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

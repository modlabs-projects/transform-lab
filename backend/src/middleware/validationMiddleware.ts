/*
 * Validation middleware for express-validator.
 * Checks for validation errors from express-validator chains
 * and returns consistent 400 error responses with field-level error details.
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware that checks for express-validator validation errors.
 * If errors exist, returns a 400 response with the error details.
 * If no errors, passes control to the next middleware.
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      if (err.type === 'field') {
        return {
          field: err.path,
          message: err.msg,
        };
      }
      return {
        field: 'unknown',
        message: err.msg,
      };
    });

    res.status(400).json({
      error: 'Validation Error',
      message: 'Validation failed',
      statusCode: 400,
      errors: formattedErrors,
    });
    return;
  }
  next();
}

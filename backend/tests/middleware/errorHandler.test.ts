/*
 * Unit tests for error handler middleware.
 * Tests that different error types are mapped to correct HTTP status codes
 * and that the error response format is consistent.
 */

import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import {
  AppError,
  NotFoundError,
  ValidationError,
  BusinessLogicError,
  UnauthorizedError,
  ForbiddenError,
} from '../../src/utils/errors';

describe('errorHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {};
    mockRes = {
      status: statusMock,
    };
    mockNext = jest.fn();

    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 404 for NotFoundError', () => {
    const error = new NotFoundError('Message not found');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'NotFoundError',
        message: 'Message not found',
        statusCode: 404,
      })
    );
  });

  it('should return 400 for ValidationError', () => {
    const error = new ValidationError('Validation failed', [
      { field: 'text', message: 'Message is required.' },
    ]);

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ValidationError',
        message: 'Validation failed',
        statusCode: 400,
        errors: [{ field: 'text', message: 'Message is required.' }],
      })
    );
  });

  it('should return 422 for BusinessLogicError', () => {
    const error = new BusinessLogicError('Business rule violated');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(422);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'BusinessLogicError',
        message: 'Business rule violated',
        statusCode: 422,
      })
    );
  });

  it('should return 401 for UnauthorizedError', () => {
    const error = new UnauthorizedError('Invalid credentials');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'UnauthorizedError',
        message: 'Invalid credentials',
        statusCode: 401,
      })
    );
  });

  it('should return 403 for ForbiddenError', () => {
    const error = new ForbiddenError('Access denied');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'ForbiddenError',
        message: 'Access denied',
        statusCode: 403,
      })
    );
  });

  it('should return 500 for generic Error', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        statusCode: 500,
      })
    );
  });

  it('should return consistent error response format', () => {
    const error = new NotFoundError('Test');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    const response = jsonMock.mock.calls[0][0];
    expect(response).toHaveProperty('error');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('statusCode');
    expect(typeof response.error).toBe('string');
    expect(typeof response.message).toBe('string');
    expect(typeof response.statusCode).toBe('number');
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new NotFoundError('Test');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    const response = jsonMock.mock.calls[0][0];
    expect(response).toHaveProperty('stack');

    process.env.NODE_ENV = originalEnv;
  });

  it('should not include stack trace in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new NotFoundError('Test');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    const response = jsonMock.mock.calls[0][0];
    expect(response).not.toHaveProperty('stack');

    process.env.NODE_ENV = originalEnv;
  });

  it('should not include validation errors array for non-validation errors', () => {
    const error = new NotFoundError('Not found');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    const response = jsonMock.mock.calls[0][0];
    expect(response).not.toHaveProperty('errors');
  });

  it('should handle AppError with custom status code', () => {
    const error = new AppError('Custom error', 418);

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(418);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'AppError',
        message: 'Custom error',
        statusCode: 418,
      })
    );
  });
});

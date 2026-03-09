/*
 * Unit tests for authentication middleware.
 * Tests JWT token verification, missing tokens, invalid tokens, and expired tokens.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, optionalAuthMiddleware } from '../../src/middleware/authMiddleware';

// Mock environment configuration
jest.mock('../../src/config/env', () => ({
  __esModule: true,
  default: {
    DATABASE_URL: 'file:./test.db',
    PORT: 3000,
    JWT_SECRET: 'test-secret-key',
    CORS_ORIGINS: ['http://localhost:3000'],
    NODE_ENV: 'test',
  },
  env: {
    DATABASE_URL: 'file:./test.db',
    PORT: 3000,
    JWT_SECRET: 'test-secret-key',
    CORS_ORIGINS: ['http://localhost:3000'],
    NODE_ENV: 'test',
  },
}));

describe('authMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should authenticate with a valid token', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '1h' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.userId).toBe(1);
    expect(mockReq.user?.role).toBe('user');
  });

  it('should reject request with no authorization header', () => {
    mockReq.headers = {};

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'No token provided',
        statusCode: 401,
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format (no Bearer prefix)', () => {
    mockReq.headers = { authorization: 'InvalidFormat token123' };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Token format is invalid. Use: Bearer <token>',
        statusCode: 401,
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', () => {
    mockReq.headers = { authorization: 'Bearer invalid.token.here' };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Invalid token',
        statusCode: 401,
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with expired token', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '-1s' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Token has expired',
        statusCode: 401,
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with token signed with wrong secret', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, 'wrong-secret-key');
    mockReq.headers = { authorization: `Bearer ${token}` };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unauthorized',
        message: 'Invalid token',
        statusCode: 401,
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should reject request with only Bearer keyword (no token)', () => {
    mockReq.headers = { authorization: 'Bearer' };

    authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});

describe('optionalAuthMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next without setting user when no authorization header is present', () => {
    mockReq.headers = {};

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
  });

  it('should attach user when a valid token is provided', () => {
    const payload = { userId: 1, role: 'admin' };
    const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '1h' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.userId).toBe(1);
    expect(mockReq.user?.role).toBe('admin');
  });

  it('should call next without setting user when token format is invalid (no Bearer prefix)', () => {
    mockReq.headers = { authorization: 'InvalidFormat token123' };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should call next without setting user when only Bearer keyword is present (no token)', () => {
    mockReq.headers = { authorization: 'Bearer' };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should call next without setting user when token is invalid', () => {
    mockReq.headers = { authorization: 'Bearer invalid.token.here' };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should call next without setting user when token is expired', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, 'test-secret-key', { expiresIn: '-1s' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should call next without setting user when token is signed with wrong secret', () => {
    const payload = { userId: 1, role: 'user' };
    const token = jwt.sign(payload, 'wrong-secret-key');
    mockReq.headers = { authorization: `Bearer ${token}` };

    optionalAuthMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
    expect(statusMock).not.toHaveBeenCalled();
  });
});

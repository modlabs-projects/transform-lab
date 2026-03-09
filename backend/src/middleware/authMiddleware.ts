/*
 * JWT Authentication Middleware.
 * Skeleton implementation for future use - the original Spring Boot app
 * had no authentication, so this is provided for extensibility.
 *
 * Verifies Bearer tokens from the Authorization header,
 * attaches decoded user info to the request object,
 * and handles missing/invalid/expired tokens.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

/**
 * Decoded JWT payload interface.
 */
export interface JwtPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Extend Express Request to include user property.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware that verifies JWT Bearer tokens.
 * Attaches the decoded user payload to req.user if valid.
 * Returns 401 Unauthorized for missing, invalid, or expired tokens.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided',
      statusCode: 401,
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token format is invalid. Use: Bearer <token>',
      statusCode: 401,
    });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token has expired',
        statusCode: 401,
      });
      return;
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
      statusCode: 401,
    });
    return;
  }
}

/**
 * Optional authentication middleware.
 * Attaches user info if a valid token is present,
 * but does not block the request if no token is provided.
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    next();
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token is invalid but we don't block - just continue without user context
  }

  next();
}

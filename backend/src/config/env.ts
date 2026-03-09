/*
 * Environment configuration module.
 * Loads and validates environment variables using dotenv.
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Application environment configuration.
 * All required environment variables are validated on startup.
 */
export interface EnvConfig {
  DATABASE_URL: string;
  PORT: number;
  JWT_SECRET: string;
  CORS_ORIGINS: string[];
  NODE_ENV: string;
}

/**
 * Validates that all required environment variables are present.
 * Throws an error with details of missing variables if validation fails.
 */
function validateEnv(): EnvConfig {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        'Please check your .env file or environment configuration.'
    );
  }

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: parseInt(process.env.PORT || '3000', 10),
    JWT_SECRET: process.env.JWT_SECRET!,
    CORS_ORIGINS: corsOrigins,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

export const env = validateEnv();

export default env;

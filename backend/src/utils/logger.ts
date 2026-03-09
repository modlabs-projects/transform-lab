/*
 * Structured logging utility using Winston.
 * Provides configurable log levels, JSON formatting for production,
 * and human-readable formatting for development.
 */

import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

/**
 * Custom log format for development: colorized, human-readable output.
 */
const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

/**
 * Production log format: structured JSON for log aggregation tools.
 */
const prodFormat = combine(
  timestamp(),
  json()
);

/**
 * Determine log level from environment variable or default based on NODE_ENV.
 */
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * Winston logger instance.
 * - Development: Colorized console output with timestamps
 * - Production: JSON-formatted output for structured log aggregation
 * - Test: Silent to avoid noisy test output
 */
const logger = winston.createLogger({
  level: logLevel,
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  // Do not exit on unhandled errors
  exitOnError: false,
});

export default logger;

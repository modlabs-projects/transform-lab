/*
 * PrismaClient singleton for database connection management.
 * Ensures a single PrismaClient instance is shared across the application
 * and provides graceful shutdown support.
 */

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

/**
 * Returns the singleton PrismaClient instance.
 * Creates a new instance if one does not exist.
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }
  return prisma;
}

/**
 * Disconnects the PrismaClient gracefully.
 * Should be called during application shutdown.
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export default getPrismaClient;

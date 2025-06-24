import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

// Helper function to execute raw SQL queries
export async function executeQuery(query: string, params: unknown[] = []) {
  try {
    const result = await db.$queryRaw(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

// Helper function to execute raw SQL queries with proper typing
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await db.$queryRawUnsafe(query, ...params) as T[]
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for transactions
export async function executeTransaction<T>(operations: ((prisma: PrismaClient) => Promise<T>)[]): Promise<T[]> {
  try {
    return await db.$transaction(operations.map(op => op(db)))
  } catch (error) {
    console.error("Transaction error:", error)
    throw error
  }
}

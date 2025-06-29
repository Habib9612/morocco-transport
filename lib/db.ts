import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to execute raw SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await prisma.$queryRawUnsafe(query, ...params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to execute transactions
export async function executeTransaction(queries: { query: string; params?: any[] }[]) {
  try {
    return await prisma.$transaction(async (tx) => {
      const results = []
      for (const { query, params = [] } of queries) {
        const result = await tx.$queryRawUnsafe(query, ...params)
        results.push(result)
      }
      return results
    })
  } catch (error) {
    console.error("Database transaction error:", error)
    throw error
  }
}

// Helper function for pagination
export function buildPaginationQuery(baseQuery: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit
  return `${baseQuery} LIMIT ${limit} OFFSET ${offset}`
}

// Helper function for search queries
export function buildSearchQuery(searchTerm: string, searchFields: string[]) {
  if (!searchTerm || searchFields.length === 0) return ""

  const conditions = searchFields.map((field) => `${field} ILIKE '%${searchTerm}%'`)
  return `(${conditions.join(" OR ")})`
}

// Helper function for date range queries
export function buildDateRangeQuery(field: string, startDate?: string, endDate?: string) {
  const conditions: string[] = []

  if (startDate) {
    conditions.push(`${field} >= '${startDate}'`)
  }

  if (endDate) {
    conditions.push(`${field} <= '${endDate}'`)
  }

  return conditions.join(" AND ")
}

// Helper function for sorting
export function buildSortQuery(sortBy?: string, sortOrder: "ASC" | "DESC" = "DESC") {
  if (!sortBy) return "ORDER BY created_at DESC"

  const allowedSortFields = ["created_at", "updated_at", "name", "email", "status", "price"]
  const field = allowedSortFields.includes(sortBy) ? sortBy : "created_at"

  return `ORDER BY ${field} ${sortOrder}`
}

// Helper function for filtering
export function buildFilterQuery(filters: Record<string, any>) {
  const conditions: string[] = []
  const params: any[] = []

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      conditions.push(`${key} = $${params.length + 1}`)
      params.push(value)
    }
  })

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  }
}

// Helper function to get the database connection
export async function getConnection() {
  return prisma
}

import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "file:./dev.db"

export const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma

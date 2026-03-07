import { PrismaClient } from '@/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function buildConnectionString(): string {
  const raw = process.env.DATABASE_URL ?? ''
  const url = new URL(raw)
  url.searchParams.delete('channel_binding')
  return url.toString()
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: buildConnectionString() })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

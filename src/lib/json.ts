import { z } from 'zod'
import { Prisma } from '@/generated/prisma'

const jsonLiteralSchema = z.union([z.string(), z.number(), z.boolean()])

export const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    jsonLiteralSchema,
    z.array(z.union([jsonValueSchema, z.null()])),
    z.record(z.string(), z.union([jsonValueSchema, z.null()])),
  ]),
)

export const jsonObjectSchema = z.record(z.string(), z.union([jsonValueSchema, z.null()]))

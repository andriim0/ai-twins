import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { jsonObjectSchema } from '@/lib/json'
import { cookies } from 'next/headers'
import { getUserIdFromCookies } from '@/lib/user-id'
import { ValidationError } from '@/lib/errors'

const patchSessionSchema = z.object({
  email: z.string().email().optional(),
  quizData: jsonObjectSchema.optional(),
})

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body: unknown = await request.json()
  const parsed = patchSessionSchema.safeParse(body)

  if (!parsed.success) {
    throw new ValidationError(parsed.error.message)
  }

  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore.toString())

  if (!userId) {
    return NextResponse.json({ error: 'No session found' }, { status: 400 })
  }

  await prisma.session.upsert({
    where: { id: userId },
    update: parsed.data,
    create: { id: userId, ...parsed.data },
  })

  return NextResponse.json({ ok: true })
}

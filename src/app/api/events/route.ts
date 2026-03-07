import { NextRequest, NextResponse } from 'next/server'
import { userAgent } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { jsonObjectSchema } from '@/lib/json'
import { cookies } from 'next/headers'
import { getUserIdFromCookies, generateUserId, buildUserIdCookie } from '@/lib/user-id'
import { ValidationError } from '@/lib/errors'

const trackEventSchema = z.object({
  type: z.string().min(1),
  payload: jsonObjectSchema.optional(),
  timeOnStep: z.number().int().nonnegative().optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: unknown = await request.json()
  const parsed = trackEventSchema.safeParse(body)

  if (!parsed.success) {
    throw new ValidationError(parsed.error.message)
  }

  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  let userId = getUserIdFromCookies(cookieHeader)
  let isNewUser = false

  if (!userId) {
    userId = generateUserId()
    isNewUser = true
  }

  const { device } = userAgent(request)
  const platform = device.type === 'mobile' ? 'mobile' : 'desktop'
  const referrer = request.headers.get('referer') ?? null

  await prisma.$transaction(async (tx) => {
    await tx.session.upsert({
      where: { id: userId! },
      update: {},
      create: { id: userId!, platform, referrer },
    })

    await tx.event.create({
      data: {
        userId: userId!,
        type: parsed.data.type,
        payload: parsed.data.payload ?? {},
        timeOnStep: parsed.data.timeOnStep ?? null,
        platform,
        referrer: isNewUser ? referrer : null,
      },
    })
  })

  const response = NextResponse.json({ ok: true })

  if (isNewUser) {
    response.headers.set('Set-Cookie', buildUserIdCookie(userId))
  }

  return response
}


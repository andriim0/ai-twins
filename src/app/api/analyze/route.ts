import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Groq from 'groq-sdk'
import { cookies } from 'next/headers'
import { getUserIdFromCookies } from '@/lib/user-id'
import { ValidationError } from '@/lib/errors'
import { analysisResultSchema } from '@/features/chat/types'

const analyzeSchema = z.object({
  messages: z.array(z.string()).min(1).max(20),
  quizData: z.object({
    name: z.string(),
    personality: z.string(),
    therapyStyle: z.string(),
    goal: z.string(),
    mood: z.string(),
  }),
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore.toString())
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await request.json()
  const parsed = analyzeSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message)
  }

  const { messages, quizData } = parsed.data
  const conversation = messages.join('\n')

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are an empathetic AI therapist analyzing a user's stress reflection.
The user chose: personality="${quizData.personality}", therapy="${quizData.therapyStyle}", goal="${quizData.goal}", mood="${quizData.mood}".
Return ONLY valid JSON matching this exact structure:
{
  "stressors": ["string", ...],
  "emotionalTone": "string",
  "keyThemes": ["string", ...],
  "recommendation": "string (1-2 sentences, warm and actionable)",
  "intensity": "low" | "moderate" | "high"
}`,
      },
      {
        role: 'user',
        content: `Analyze this reflection from ${quizData.name}:\n\n${conversation}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0]?.message?.content ?? '{}'
  const result = analysisResultSchema.parse(JSON.parse(content))

  return NextResponse.json(result)
}

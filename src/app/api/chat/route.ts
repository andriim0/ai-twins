import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Groq from 'groq-sdk'
import { cookies } from 'next/headers'
import { getUserIdFromCookies } from '@/lib/user-id'
import { ValidationError } from '@/lib/errors'

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ).min(1).max(20),
  quizData: z.object({
    name: z.string(),
    personality: z.string(),
    therapyStyle: z.string(),
    goal: z.string(),
    mood: z.string(),
  }),
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const THERAPY_STYLE_PROMPTS: Record<string, string> = {
  cbt: 'You use CBT techniques — help the user notice and gently reframe thought patterns.',
  mindfulness: 'You use mindfulness — encourage present-moment awareness and self-compassion.',
  'solution-focused': 'You use solution-focused therapy — focus on strengths and small actionable steps.',
  somatic: 'You use somatic therapy — occasionally invite the user to notice how emotions feel in the body.',
}

const PERSONALITY_PROMPTS: Record<string, string> = {
  supportive: 'You are warm and encouraging, always validating feelings first.',
  analytical: 'You are clear and logical, helping the user spot patterns in their thinking.',
  motivational: 'You are energetic and action-oriented, turning insights into next steps.',
  empathetic: 'You are a deep listener, making the user feel truly heard and understood.',
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore.toString())
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await request.json()
  const parsed = chatSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message)
  }

  const { messages, quizData } = parsed.data

  const therapyPrompt = THERAPY_STYLE_PROMPTS[quizData.therapyStyle] ?? ''
  const personalityPrompt = PERSONALITY_PROMPTS[quizData.personality] ?? ''

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are ${quizData.name ? `${quizData.name}'s` : "the user's"} personal AI twin — a supportive, judgment-free companion.
${personalityPrompt}
${therapyPrompt}

Important rules:
- If the user says they feel good, happy or positive — celebrate that genuinely. Do NOT reframe it negatively.
- Keep responses short: 1-2 sentences of reflection, then one open question.
- Never project emotions the user hasn't expressed.
- Match the user's energy — positive to positive, gentle to struggling.
- Do not give clinical advice or diagnoses.`,
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 150,
  })

  const content = completion.choices[0]?.message?.content ?? "I'm here with you. Tell me more."

  return NextResponse.json({ content })
}

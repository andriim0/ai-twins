import { analysisResultSchema, type AnalysisResult } from './types'
import type { ChatMessage } from './types'
import type { QuizData } from '@/features/quiz/types'
import { ApiError } from '@/lib/errors'
import { z } from 'zod'

const chatReplySchema = z.object({ content: z.string() })

export async function fetchChatReply(
  messages: ChatMessage[],
  quizData: QuizData,
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
      quizData,
    }),
  })

  if (!response.ok) {
    throw new ApiError('Chat request failed', response.status, '/api/chat')
  }

  const data: unknown = await response.json()
  return chatReplySchema.parse(data).content
}

export async function fetchAnalysis(
  messages: string[],
  quizData: QuizData,
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, quizData }),
  })

  if (!response.ok) {
    throw new ApiError('Analysis request failed', response.status, '/api/analyze')
  }

  const data: unknown = await response.json()
  return analysisResultSchema.parse(data)
}

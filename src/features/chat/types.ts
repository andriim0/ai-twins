import { z } from 'zod'

export type MessageRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  createdAt: number
}

export const analysisResultSchema = z.object({
  stressors: z.array(z.string()),
  emotionalTone: z.string(),
  keyThemes: z.array(z.string()),
  recommendation: z.string(),
  intensity: z.enum(['low', 'moderate', 'high']),
})

export type AnalysisResult = z.infer<typeof analysisResultSchema>

const INTENSITY_COLORS: Record<AnalysisResult['intensity'], string> = {
  low: 'text-emerald-400',
  moderate: 'text-amber-400',
  high: 'text-rose-400',
}

export { INTENSITY_COLORS }

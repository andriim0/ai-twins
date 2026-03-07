import type { QuizData, Personality, TherapyStyle, PrimaryGoal } from './types'

type PersonalFeedback = {
  emoji: string
  headline: string
  description: string
  traits: string[]
}

const PERSONALITY_LABELS: Record<Personality, string> = {
  supportive: 'Supportive',
  analytical: 'Analytical',
  motivational: 'Motivational',
  empathetic: 'Empathetic',
}

const THERAPY_LABELS: Record<TherapyStyle, string> = {
  cbt: 'CBT',
  mindfulness: 'Mindfulness',
  'solution-focused': 'Solution-Focused',
  somatic: 'Somatic',
}

const PERSONALITY_TRAITS: Record<Personality, string[]> = {
  supportive: [
    'Always validates your feelings first',
    'Gently challenges negative self-talk',
    'Celebrates every small win with you',
  ],
  analytical: [
    'Helps you spot recurring thought patterns',
    'Breaks big problems into clear steps',
    'Tracks your progress with data',
  ],
  motivational: [
    'Turns insight into immediate action',
    'Keeps you accountable between sessions',
    'Reignites your sense of purpose',
  ],
  empathetic: [
    'Makes you feel truly heard',
    'Connects emotions to deeper needs',
    'Creates a judgment-free space',
  ],
}

const GOAL_DESCRIPTIONS: Record<PrimaryGoal, string> = {
  'manage-stress': 'reduce stress and find calm in daily life',
  'relationships': 'build deeper, more meaningful connections',
  'confidence': 'unlock your full potential and self-worth',
  'anxiety': 'quiet the anxious mind and feel free again',
}

const PERSONALITY_EMOJIS: Record<Personality, string> = {
  supportive: '🤗',
  analytical: '🧠',
  motivational: '🔥',
  empathetic: '💜',
}

export function generatePersonalFeedback(quizData: QuizData): PersonalFeedback {
  const personality = (quizData.personality ?? 'empathetic') as Personality
  const therapy = (quizData.therapyStyle ?? 'mindfulness') as TherapyStyle
  const goal = (quizData.goal ?? 'manage-stress') as PrimaryGoal
  const name = quizData.name || 'You'

  return {
    emoji: PERSONALITY_EMOJIS[personality],
    headline: `${name}, meet your ${PERSONALITY_LABELS[personality]} twin`,
    description: `Based on your answers, we've created a ${PERSONALITY_LABELS[personality]} AI twin trained in ${THERAPY_LABELS[therapy]} therapy — perfectly matched to help you ${GOAL_DESCRIPTIONS[goal]}. You're in the right place.`,
    traits: PERSONALITY_TRAITS[personality],
  }
}

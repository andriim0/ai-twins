export const AI_TWIN_FUNNEL_SLUG = 'ai-twin'

export const FUNNEL_STEPS = [
  'intro',
  'name',
  'personality',
  'therapy-style',
  'goal',
  'mood',
  'feedback',
  'social-proof',
  'email',
  'chat',
  'paywall',
] as const

export type FunnelStep = (typeof FUNNEL_STEPS)[number]

export const FUNNEL_STEP_LABELS: Record<FunnelStep, string> = {
  'intro': 'Welcome',
  'name': 'Your Name',
  'personality': 'Twin Personality',
  'therapy-style': 'Therapy Style',
  'goal': 'Your Goal',
  'mood': 'Current Mood',
  'feedback': 'Your Match',
  'social-proof': 'Join Thousands',
  'email': 'Stay Connected',
  'chat': 'Meet Your Twin',
  'paywall': 'Unlock Full Access',
}

export const QUIZ_STEPS: FunnelStep[] = [
  'name',
  'personality',
  'therapy-style',
  'goal',
  'mood',
]

export const MAX_CHAT_MESSAGES_BEFORE_ANALYSIS = 5

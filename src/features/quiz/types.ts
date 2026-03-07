export type Personality = 'supportive' | 'analytical' | 'motivational' | 'empathetic'
export type TherapyStyle = 'cbt' | 'mindfulness' | 'solution-focused' | 'somatic'
export type PrimaryGoal = 'manage-stress' | 'relationships' | 'confidence' | 'anxiety'
export type CurrentMood = 'thriving' | 'good' | 'struggling' | 'overwhelmed'

export type QuizData = {
  name: string
  personality: Personality | null
  therapyStyle: TherapyStyle | null
  goal: PrimaryGoal | null
  mood: CurrentMood | null
}

export type PersonalityOption = {
  value: Personality
  label: string
  description: string
  emoji: string
}

export type TherapyStyleOption = {
  value: TherapyStyle
  label: string
  description: string
}

export type GoalOption = {
  value: PrimaryGoal
  label: string
  emoji: string
}

export type MoodOption = {
  value: CurrentMood
  label: string
  emoji: string
  color: string
}

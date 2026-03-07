'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import type { PersonalityOption, Personality } from '@/features/quiz/types'

const PERSONALITY_OPTIONS: PersonalityOption[] = [
  {
    value: 'supportive',
    label: 'The Supporter',
    description: 'Warm, encouraging, always in your corner',
    emoji: '🤗',
  },
  {
    value: 'analytical',
    label: 'The Analyst',
    description: 'Clear, logical, helps you see patterns',
    emoji: '🧠',
  },
  {
    value: 'motivational',
    label: 'The Coach',
    description: 'Energetic, action-oriented, pushes you forward',
    emoji: '🔥',
  },
  {
    value: 'empathetic',
    label: 'The Empath',
    description: 'Deep listener, validates your feelings first',
    emoji: '💜',
  },
]

type Props = { funnelSlug: string }

export function PersonalityStepView({ funnelSlug }: Props) {
  const { quizData, setPersonality } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'personality')

  function handleSelect(value: Personality): void {
    setPersonality(value)
    goToNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full max-w-lg flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3 text-center">
        <p className="text-violet-500 text-sm font-medium tracking-widest uppercase">
          Step 2 of 5
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {quizData.name ? `${quizData.name}, what personality` : 'What personality'} should your twin have?
        </h1>
        <p className="text-gray-500 text-lg">Choose the style that feels most natural to you.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PERSONALITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200
              ${quizData.personality === option.value
                ? 'border-violet-500 bg-violet-500/20 glow-violet'
                : 'border-black/10 bg-black/5 hover:border-black/20 hover:bg-black/8'
              }`}
          >
            <span className="text-3xl">{option.emoji}</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-900 font-semibold text-lg">{option.label}</span>
              <span className="text-gray-400 text-sm">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

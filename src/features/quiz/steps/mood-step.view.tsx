'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import type { MoodOption, CurrentMood } from '@/features/quiz/types'

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'thriving', label: 'Thriving', emoji: '🌟', color: 'border-emerald-400 bg-emerald-400/10' },
  { value: 'good', label: 'Doing good', emoji: '😊', color: 'border-sky-400 bg-sky-400/10' },
  { value: 'struggling', label: 'Struggling', emoji: '😔', color: 'border-amber-400 bg-amber-400/10' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😰', color: 'border-rose-400 bg-rose-400/10' },
]

type Props = { funnelSlug: string }

export function MoodStepView({ funnelSlug }: Props) {
  const { quizData, setMood } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'mood')

  function handleSelect(value: CurrentMood): void {
    setMood(value)
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
          Step 5 of 5
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          How are you feeling today?
        </h1>
        <p className="text-gray-500 text-lg">Be honest — your twin meets you where you are.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex flex-col items-center gap-3 p-7 rounded-2xl border text-center transition-all duration-200
              ${quizData.mood === option.value
                ? option.color
                : 'border-black/10 bg-black/5 hover:border-black/20 hover:bg-black/8'
              }`}
          >
            <span className="text-5xl">{option.emoji}</span>
            <span className="text-gray-900 font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

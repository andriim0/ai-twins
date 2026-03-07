'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import type { GoalOption, PrimaryGoal } from '@/features/quiz/types'

const GOAL_OPTIONS: GoalOption[] = [
  { value: 'manage-stress', label: 'Manage stress & overwhelm', emoji: '🌊' },
  { value: 'relationships', label: 'Improve my relationships', emoji: '💞' },
  { value: 'confidence', label: 'Build self-confidence', emoji: '✨' },
  { value: 'anxiety', label: 'Overcome anxiety', emoji: '🕊️' },
]

type Props = { funnelSlug: string }

export function GoalStepView({ funnelSlug }: Props) {
  const { quizData, setGoal } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'goal')

  function handleSelect(value: PrimaryGoal): void {
    setGoal(value)
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
          Step 4 of 5
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          What&apos;s your primary goal right now?
        </h1>
        <p className="text-gray-500 text-lg">
          Your twin will focus every session around this.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border text-center transition-all duration-200
              ${quizData.goal === option.value
                ? 'border-amber-400 bg-amber-400/15 glow-amber'
                : 'border-black/10 bg-black/5 hover:border-black/20 hover:bg-black/8'
              }`}
          >
            <span className="text-4xl">{option.emoji}</span>
            <span className="text-gray-900 font-medium text-sm leading-snug">{option.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

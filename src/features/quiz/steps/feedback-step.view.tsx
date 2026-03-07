'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import { Button } from '@/components/ui/button'
import { generatePersonalFeedback } from '@/features/quiz/utils'

type Props = { funnelSlug: string }

export function FeedbackStepView({ funnelSlug }: Props) {
  const { quizData } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'feedback')
  const feedback = generatePersonalFeedback(quizData)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full max-w-lg flex flex-col gap-8 text-center"
    >
      <div className="flex flex-col gap-3">
        <div className="text-5xl mb-2">{feedback.emoji}</div>
        <p className="text-violet-500 text-sm font-medium tracking-widest uppercase">
          Your Match
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {feedback.headline}
        </h1>
      </div>

      <div className="bg-black/5 border border-black/10 rounded-2xl p-6 text-left flex flex-col gap-4">
        <p className="text-gray-700 text-lg leading-relaxed">{feedback.description}</p>

        <div className="flex flex-col gap-2 pt-2 border-t border-black/10">
          {feedback.traits.map((trait) => (
            <div key={trait} className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-violet-500">✓</span>
              {trait}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={goToNext}
        className="h-14 text-lg font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 transition-all"
      >
        See what others say
      </Button>
    </motion.div>
  )
}

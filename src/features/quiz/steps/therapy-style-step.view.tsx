'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import type { TherapyStyleOption, TherapyStyle } from '@/features/quiz/types'

const THERAPY_STYLE_OPTIONS: TherapyStyleOption[] = [
  {
    value: 'cbt',
    label: 'Cognitive Behavioral (CBT)',
    description: 'Identify and reframe negative thought patterns',
  },
  {
    value: 'mindfulness',
    label: 'Mindfulness-Based',
    description: 'Stay present, reduce anxiety through awareness',
  },
  {
    value: 'solution-focused',
    label: 'Solution-Focused',
    description: 'Focus on strengths and practical next steps',
  },
  {
    value: 'somatic',
    label: 'Somatic (Body-Based)',
    description: 'Connect mind and body to release tension',
  },
]

type Props = { funnelSlug: string }

export function TherapyStyleStepView({ funnelSlug }: Props) {
  const { quizData, setTherapyStyle } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'therapy-style')

  function handleSelect(value: TherapyStyle): void {
    setTherapyStyle(value)
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
          Step 3 of 5
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Which therapy approach resonates with you?
        </h1>
        <p className="text-gray-500 text-lg">Your twin will be trained in this modality.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {THERAPY_STYLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex flex-col gap-1 p-5 rounded-2xl border text-left transition-all duration-200
              ${quizData.therapyStyle === option.value
                ? 'border-violet-500 bg-violet-500/20 glow-violet'
                : 'border-black/10 bg-black/5 hover:border-black/20 hover:bg-black/8'
              }`}
          >
            <span className="text-gray-900 font-semibold text-lg">{option.label}</span>
            <span className="text-gray-400 text-sm">{option.description}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

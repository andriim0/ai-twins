'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap } from 'lucide-react'
import { useQuizStore } from '@/features/quiz/store'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { useTrackOnMount } from '@/features/events/hooks/use-track-on-mount'
import { EVENT_TYPES } from '@/features/events/types'

const PLAN_FEATURES = [
  'Unlimited AI twin sessions',
  'Daily mood & progress tracking',
  'Personalized therapy exercises',
  'Crisis support 24/7',
  'Voice message support',
  'Export session summaries',
]

type Props = { funnelSlug: string }

export function PaywallView({ funnelSlug: _ }: Props) {
  const { quizData } = useQuizStore()
  const { track } = useTrackEvent()

  useTrackOnMount(EVENT_TYPES.PAYWALL_VIEW, { source: 'funnel' })

  function handlePlanClick(plan: 'monthly' | 'annual'): void {
    track(EVENT_TYPES.PAYWALL_PLAN_CLICKED, { plan })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg flex flex-col gap-8 text-center"
    >
      <div className="flex flex-col gap-3">
        <div className="text-5xl mb-2">🔓</div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {quizData.name ? `${quizData.name}, unlock` : 'Unlock'} your full potential
        </h1>
        <p className="text-gray-500 text-lg">
          Your AI twin is ready. Start your journey today.
        </p>
      </div>

      <div className="bg-black/5 border border-black/10 rounded-2xl p-5 text-left flex flex-col gap-3">
        <p className="text-gray-400 text-xs uppercase tracking-wider text-center mb-1">
          Everything included
        </p>
        {PLAN_FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-violet-500" />
            </div>
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handlePlanClick('annual')}
          className="relative flex flex-col gap-1 p-5 rounded-2xl border-2 border-amber-400 bg-amber-400/8 text-left transition-all hover:bg-amber-400/15"
        >
          <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-xs">
            Best value
          </Badge>
          <span className="text-gray-900 font-bold text-lg">Annual Plan</span>
          <span className="text-amber-400 font-semibold">$4.99 / month</span>
          <span className="text-gray-400 text-sm">Billed $59.99/year · Save 58%</span>
        </button>

        <button
          onClick={() => handlePlanClick('monthly')}
          className="flex flex-col gap-1 p-5 rounded-2xl border border-black/10 bg-black/5 text-left transition-all hover:border-black/20 hover:bg-black/8"
        >
          <span className="text-gray-900 font-bold text-lg">Monthly Plan</span>
          <span className="text-gray-600 font-semibold">$11.99 / month</span>
          <span className="text-gray-400 text-sm">Cancel anytime</span>
        </button>
      </div>

      <Button
        onClick={() => handlePlanClick('annual')}
        className="h-14 text-lg font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 transition-all"
      >
        <Zap className="w-5 h-5 mr-2" />
        Start my journey
      </Button>

      <p className="text-gray-300 text-xs">
        7-day free trial · No charge today · Cancel anytime
      </p>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { EVENT_TYPES } from '@/features/events/types'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Teacher, 34',
    text: "I've done years of therapy. My AI twin gave me more clarity in one week than months of sessions. It's like having a therapist who actually remembers everything.",
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Startup founder, 29',
    text: "It's already made me cry — in the best way. It found patterns in my stress I had never noticed. Game-changer.",
    rating: 5,
  },
  {
    name: 'Priya N.',
    role: 'Nurse, 41',
    text: "I feel like I'm talking to a friend who actually listens and never judges. Available at 2am when I can't sleep. Priceless.",
    rating: 5,
  },
]

type Props = { funnelSlug: string }

export function SocialProofStepView({ funnelSlug }: Props) {
  const { quizData, quizStartedAt, stepsRevisited } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'social-proof')
  const { track } = useTrackEvent()

  function handleContinue(): void {
    const totalDuration = quizStartedAt ? Date.now() - quizStartedAt : 0
    track(EVENT_TYPES.QUIZ_SUBMIT, {
      name: quizData.name,
      personality: quizData.personality,
      therapyStyle: quizData.therapyStyle,
      goal: quizData.goal,
      mood: quizData.mood,
      totalQuizDuration: totalDuration,
      stepsRevisited,
    })
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
        <div className="flex items-center justify-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400" />
          ))}
          <span className="text-gray-400 text-sm ml-2">4.8 · 2,400+ reviews</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Join 47,000+ people who found their AI twin
        </h1>
        <p className="text-gray-500 text-lg">Real stories from real people.</p>
      </div>

      <div className="flex flex-col gap-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-black/5 border border-black/10 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
            <div>
              <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
              <p className="text-gray-400 text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        className="h-14 text-lg font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 transition-all"
      >
        I&apos;m ready — let&apos;s go
      </Button>
    </motion.div>
  )
}

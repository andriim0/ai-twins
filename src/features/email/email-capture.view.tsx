'use client'

import { useState, useEffect, useRef } from 'react'
import { useTrackOnMount } from '@/features/events/hooks/use-track-on-mount'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import { useEmailSubmit } from '@/features/email/hooks/use-email-submit'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { EVENT_TYPES } from '@/features/events/types'
import { Lock } from 'lucide-react'

type Props = { funnelSlug: string }

export function EmailCaptureView({ funnelSlug }: Props) {
  const { quizData } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'email')
  const { track } = useTrackEvent()
  const [emailValue, setEmailValue] = useState('')

  const { isSubmitting, error, submit } = useEmailSubmit(goToNext)
  const inputRef = useRef<HTMLInputElement>(null)

  useTrackOnMount(EVENT_TYPES.EMAIL_PAGE_VIEWED)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full max-w-lg flex flex-col gap-8 text-center"
    >
      <div className="flex flex-col gap-3">
        <div className="text-5xl mb-2">✉️</div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {quizData.name ? `${quizData.name}, where should` : 'Where should'} we send your twin&apos;s first session?
        </h1>
        <p className="text-gray-500 text-lg">
          Your personalized plan will be waiting in your inbox.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit(emailValue)}
          ref={inputRef}
          className="text-center text-xl h-14 bg-black/5 border-black/20 text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/30"
        />
        {error && (
          <p className="text-rose-500 text-sm">{error}</p>
        )}
      </div>

      <Button
        onClick={() => submit(emailValue)}
        disabled={isSubmitting || !emailValue}
        className="h-14 text-lg font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 disabled:opacity-30 transition-all"
      >
        {isSubmitting ? 'Saving...' : 'Meet my AI twin'}
      </Button>

      <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
        <Lock className="w-3.5 h-3.5" />
        <span>No spam. Unsubscribe anytime. Your data is private.</span>
      </div>
    </motion.div>
  )
}

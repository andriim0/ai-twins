'use client'

import { useState } from 'react'
import { useQuizStore } from '@/features/quiz/store'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { EVENT_TYPES } from '@/features/events/types'
import { emailSchema } from '@/features/email/types'
import { ValidationError } from '@/lib/errors'

type UseEmailSubmitResult = {
  isSubmitting: boolean
  error: string | null
  submit: (email: string) => Promise<void>
}

export function useEmailSubmit(onSuccess: () => void): UseEmailSubmitResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setEmail, quizData } = useQuizStore()
  const { track } = useTrackEvent()

  async function submit(email: string): Promise<void> {
    setError(null)

    const parsed = emailSchema.safeParse({ email })
    if (!parsed.success) {
      const reason = parsed.error.issues[0]?.message ?? 'Invalid email'
      setError(reason)
      track(EVENT_TYPES.EMAIL_VALIDATION_ERROR, { reason })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email, quizData }),
      })

      if (!response.ok) {
        throw new Error(`Session update failed: ${response.status}`)
      }

      setEmail(parsed.data.email)
      track(EVENT_TYPES.EMAIL_SUBMITTED, { email: parsed.data.email })
      onSuccess()
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
        return
      }
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, error, submit }
}

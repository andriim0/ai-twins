'use client'

import { useCallback, useRef } from 'react'
import { trackEvent } from '@/features/events/api'
import type { EventType, EventPayload } from '@/features/events/types'

export function useTrackEvent() {
  const stepEnteredAtRef = useRef<number>(Date.now())

  const track = useCallback((type: EventType, payload?: EventPayload) => {
    const timeOnStep = Date.now() - stepEnteredAtRef.current
    trackEvent({ type, payload, timeOnStep })
  }, [])

  const resetStepTimer = useCallback(() => {
    stepEnteredAtRef.current = Date.now()
  }, [])

  return { track, resetStepTimer }
}

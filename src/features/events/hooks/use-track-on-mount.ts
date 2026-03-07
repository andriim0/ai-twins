'use client'

import { useEffect, useRef } from 'react'
import { useTrackEvent } from './use-track-event'
import type { EventType, EventPayload } from '@/features/events/types'

export function useTrackOnMount(type: EventType, payload?: EventPayload): void {
  const { track } = useTrackEvent()
  const trackedRef = useRef(false)

  useEffect(() => {
    if (trackedRef.current) return
    trackedRef.current = true
    track(type, payload)
  }, [])
}

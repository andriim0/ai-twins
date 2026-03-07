'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/features/events/api'
import { EVENT_TYPES } from '@/features/events/types'
import { ProgressBar } from '@/features/funnel/components/progress-bar.component'
import { FUNNEL_STEPS, type FunnelStep } from '@/features/funnel/config/ai-twin.config'

type Props = {
  children: React.ReactNode
}

export default function FunnelLayout({ children }: Props) {
  const pathname = usePathname()
  const stepEnteredAtRef = useRef<number>(Date.now())
  const prevPathRef = useRef<string>(pathname)

  const step = pathname.split('/').pop() ?? ''
  const funnelSlug = pathname.split('/')[1] ?? ''

  useEffect(() => {
    const timeOnStep = Date.now() - stepEnteredAtRef.current

    if (prevPathRef.current !== pathname) {
      trackEvent({ type: EVENT_TYPES.STEP_VIEWED, payload: { step, funnelSlug }, timeOnStep })
      prevPathRef.current = pathname
      stepEnteredAtRef.current = Date.now()
    } else {
      trackEvent({ type: EVENT_TYPES.STEP_VIEWED, payload: { step, funnelSlug }, timeOnStep: 0 })
    }
  }, [pathname, step, funnelSlug])

  const currentIndex = FUNNEL_STEPS.indexOf(step as FunnelStep)
  const progress = currentIndex >= 0
    ? Math.round((currentIndex / (FUNNEL_STEPS.length - 1)) * 100)
    : 0
  const showProgress = step !== 'intro'

  return (
    <div className="funnel-gradient min-h-screen flex flex-col">
      {showProgress && <ProgressBar progress={progress} />}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { FUNNEL_STEPS, type FunnelStep } from '@/features/funnel/config/ai-twin.config'

export function useFunnelNavigation(funnelSlug: string, currentStep: string) {
  const router = useRouter()

  const currentIndex = FUNNEL_STEPS.indexOf(currentStep as FunnelStep)

  const nextStep = currentIndex < FUNNEL_STEPS.length - 1
    ? FUNNEL_STEPS[currentIndex + 1]
    : null

  const prevStep = currentIndex > 0
    ? FUNNEL_STEPS[currentIndex - 1]
    : null

  const progress = Math.round((currentIndex / (FUNNEL_STEPS.length - 1)) * 100)

  function goToNext(): void {
    if (!nextStep) return
    router.push(`/${funnelSlug}/${nextStep}`)
  }

  function goToPrev(): void {
    if (!prevStep) return
    router.push(`/${funnelSlug}/${prevStep}`)
  }

  function goToStep(step: FunnelStep): void {
    router.push(`/${funnelSlug}/${step}`)
  }

  return { nextStep, prevStep, progress, goToNext, goToPrev, goToStep, currentIndex }
}

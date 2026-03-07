import { notFound } from 'next/navigation'
import { STEP_VIEWS } from '@/features/funnel/registry/step-views'
import type { FunnelStep } from '@/features/funnel/config/ai-twin.config'

type Props = {
  params: Promise<{ 'funnel-slug': string; step: string }>
}

export default async function StepPage({ params }: Props) {
  const { 'funnel-slug': funnelSlug, step } = await params

  const View = STEP_VIEWS[step as FunnelStep]
  if (!View) notFound()

  return <View funnelSlug={funnelSlug} />
}

import { redirect } from 'next/navigation'
import { FUNNEL_STEPS } from '@/features/funnel/config/ai-twin.config'

type Props = {
  params: Promise<{ 'funnel-slug': string }>
}

export default async function FunnelRootPage({ params }: Props) {
  const { 'funnel-slug': funnelSlug } = await params
  redirect(`/${funnelSlug}/${FUNNEL_STEPS[0]}`)
}

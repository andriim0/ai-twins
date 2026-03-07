import { redirect } from 'next/navigation'
import { AI_TWIN_FUNNEL_SLUG } from '@/features/funnel/config/ai-twin.config'

export default function RootPage() {
  redirect(`/${AI_TWIN_FUNNEL_SLUG}`)
}

import type { ComponentType } from 'react'
import type { FunnelStep } from '@/features/funnel/config/ai-twin.config'
import { IntroStepView } from '@/features/funnel/steps/intro-step.view'
import { NameStepView } from '@/features/quiz/steps/name-step.view'
import { PersonalityStepView } from '@/features/quiz/steps/personality-step.view'
import { TherapyStyleStepView } from '@/features/quiz/steps/therapy-style-step.view'
import { GoalStepView } from '@/features/quiz/steps/goal-step.view'
import { MoodStepView } from '@/features/quiz/steps/mood-step.view'
import { FeedbackStepView } from '@/features/quiz/steps/feedback-step.view'
import { SocialProofStepView } from '@/features/quiz/steps/social-proof-step.view'
import { EmailCaptureView } from '@/features/email/email-capture.view'
import { ChatWindowView } from '@/features/chat/chat-window.view'
import { PaywallView } from '@/features/paywall/paywall.view'

type StepViewProps = { funnelSlug: string }

export const STEP_VIEWS: Record<FunnelStep, ComponentType<StepViewProps>> = {
  'intro': IntroStepView,
  'name': NameStepView,
  'personality': PersonalityStepView,
  'therapy-style': TherapyStyleStepView,
  'goal': GoalStepView,
  'mood': MoodStepView,
  'feedback': FeedbackStepView,
  'social-proof': SocialProofStepView,
  'email': EmailCaptureView,
  'chat': ChatWindowView,
  'paywall': PaywallView,
}

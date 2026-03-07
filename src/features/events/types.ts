export const EVENT_TYPES = {
  QUIZ_START: 'quiz_start',
  STEP_VIEWED: 'step_viewed',
  STEP_BACK: 'step_back',
  QUIZ_SUBMIT: 'quiz_submit',
  EMAIL_PAGE_VIEWED: 'email_page_viewed',
  EMAIL_VALIDATION_ERROR: 'email_validation_error',
  EMAIL_SUBMITTED: 'email_submitted',
  CHAT_OPENED: 'chat_opened',
  MESSAGE_SENT: 'message_sent',
  CHAT_IDLE: 'chat_idle',
  ANALYSIS_SHOWN: 'analysis_shown',
  ANALYSIS_DISMISSED: 'analysis_dismissed',
  PAYWALL_VIEW: 'paywall_view',
  PAYWALL_PLAN_CLICKED: 'paywall_plan_clicked',
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export type EventPayload = Record<string, unknown>

export type TrackEventInput = {
  type: EventType
  payload?: EventPayload
  timeOnStep?: number
}

export type EventRow = {
  id: string
  userId: string
  type: string
  payload: EventPayload | null
  timeOnStep: number | null
  platform: string | null
  referrer: string | null
  createdAt: Date
  session: { email: string | null } | null
}

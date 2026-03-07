import type { TrackEventInput } from './types'

export function trackEvent(input: TrackEventInput): void {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }).catch(() => {})
}

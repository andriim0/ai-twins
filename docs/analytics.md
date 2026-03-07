# Analytics & Events

## Overview

Every meaningful user action fires a tracking event via a fire-and-forget POST to `/api/events`. Events are stored in the `Event` table and linked to a `Session`. No third-party analytics service is used — all data is in the project's own database.

## Event Types

| Event | Fired when |
|---|---|
| `quiz_start` | User reaches the `name` step |
| `step_viewed` | User navigates to any funnel step |
| `step_back` | User navigates back |
| `quiz_submit` | User completes all quiz steps |
| `email_page_viewed` | Email capture step opens |
| `email_validation_error` | User submits invalid email |
| `email_submitted` | Valid email saved to DB |
| `chat_opened` | Chat step renders |
| `message_sent` | User sends a chat message |
| `chat_idle` | (reserved) |
| `analysis_shown` | Analysis modal opens |
| `analysis_dismissed` | User closes analysis modal |
| `paywall_view` | Paywall step renders |
| `paywall_plan_clicked` | User clicks a plan button |

## Event Payload

Each event can carry an optional `payload` (JSON) and `timeOnStep` (ms spent on current step before firing).

Examples:
```ts
// message_sent
{ messageCount: 3, messageLength: 42, timeSincePrevious: 8200 }

// analysis_shown
{ stressors: ['work', 'sleep'], emotionalTone: 'anxious', intensity: 'moderate' }

// paywall_plan_clicked
{ plan: 'annual' }
```

## Session Lifecycle

1. On the first event POST, the server checks for a `uid` cookie.
2. If no cookie exists, a new UUID is generated and a `Session` row is created.
3. The `uid` cookie is set in the response (`HttpOnly`, 1-year expiry).
4. All subsequent events are linked to the same session via `userId`.

Session enrichment on creation:
- `platform`: `'mobile'` or `'desktop'` (from User-Agent)
- `referrer`: HTTP Referer header

## `/api/events` Endpoint

**POST** — no auth required (session is created if absent)

The endpoint runs a DB transaction: upsert the session, then insert the event. This guarantees no orphaned events.

## Debug View

A debug page at `/debug/events` shows all stored events with their payloads. This is a development tool — it should be protected or removed before production.

## Key Files

```
src/features/events/
  types.ts                          — EVENT_TYPES, EventType, TrackEventInput, EventRow
  api.ts                            — trackEvent() — fire-and-forget client function
  hooks/use-track-event.ts          — useTrackEvent() hook for components

src/app/api/events/route.ts         — POST handler, session creation, event insert
src/app/debug/events/page.tsx       — debug UI (dev only)
src/lib/user-id.ts                  — generateUserId(), getUserIdFromCookies(), buildUserIdCookie()
```

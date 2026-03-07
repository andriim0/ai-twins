# Roadmap — What Can Be Improved & Built

## High Priority

### Payment Integration
The paywall currently only tracks clicks — there is no actual purchase flow. Integrating Stripe (or another processor) is the critical missing piece before monetization.
- Stripe Checkout or embedded Payment Element
- Webhook to activate subscriptions in DB
- `Session.subscriptionStatus` field
- Gate the paywall CTA behind a real checkout session

### Protect the Debug Page
`/debug/events` exposes all user events and emails with no authentication. It must be protected behind a password or removed entirely before going to production.

### Persist Chat Across Reloads
Chat messages currently live only in React state — refreshing the page resets the conversation. Messages should be saved to the DB or at minimum to `sessionStorage`.

---

## Product Features

### Continue After Analysis
After the analysis modal, users are sent directly to the paywall. A better flow would allow users to keep chatting after seeing the analysis, increasing engagement before the conversion moment.

### Unlimited Chat for Paid Users
Currently the chat is hard-capped at 5 messages for everyone. Paid users should have no limit. This requires reading subscription status server-side before allowing messages.

### Voice Input
The paywall lists "Voice message support" as a feature but it doesn't exist. Could be implemented with the Web Speech API or Whisper API for transcription.

### Onboarding for Returning Users
If a user returns with an existing session, they're sent back through the funnel from the start. A returning user experience (e.g. skip to chat, or show history) would reduce friction.

### Multiple Funnel Variants (A/B Testing)
The architecture already supports multiple funnels via `[funnel-slug]`. A/B testing different step orders, copy, or UI variants by routing different users to different slugs is a natural next step.

---

## Engineering Improvements

### Protect `/debug/events` Route
Add middleware or a simple `ADMIN_PASSWORD` env check before rendering the debug page.

### Rate Limiting on AI Routes
`/api/chat` and `/api/analyze` have no rate limiting. A malicious user could drain the Groq API quota. Add per-user rate limiting (e.g. Upstash Redis + sliding window).

### Error Boundary in Chat
If the AI API is down, the chat silently fails. An error state ("Something went wrong, try again") should be shown to the user instead of nothing.

### Input Sanitization on Chat
User messages are sent directly to the LLM prompt without sanitization. Consider trimming and length-limiting on the server before forwarding to Groq (max is already set to 20 messages).

### Email Confirmation Flow
Collected emails are stored in the DB but no confirmation or follow-up is sent. Adding a transactional email (welcome email, analysis summary) via Resend or SendGrid would increase retention.

### Admin Dashboard
There is no way to view analytics without querying the DB directly. A simple internal dashboard showing funnel drop-off rates, email capture rate, and paywall conversion would be valuable.

### Quiz Data Versioning
`quizData` is stored as a raw JSON blob. If quiz options change in the future, old records won't map cleanly to the new schema. Adding a `quizVersion` field to `Session` would make migrations easier.


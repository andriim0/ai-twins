# Funnel & Quiz

## Overview

The funnel is a multi-step flow at `/[funnel-slug]/[step]`. Currently the only active funnel is `ai-twin`. Each step is a separate URL — navigation is handled by `useFunnelNavigation`, which pushes the user to the next step based on the ordered `FUNNEL_STEPS` array.

## Step Order

```
intro → name → personality → therapy-style → goal → mood → feedback → social-proof → email → chat → paywall
```

| Step | Type | Description |
|---|---|---|
| `intro` | Landing | Hero screen, no input required. Entry point. |
| `name` | Quiz | User enters their first name |
| `personality` | Quiz | Chooses AI twin personality (4 options) |
| `therapy-style` | Quiz | Chooses therapy approach (4 options) |
| `goal` | Quiz | Chooses primary goal (4 options) |
| `mood` | Quiz | Selects current mood (4 options) |
| `feedback` | Transition | Personalized summary generated from quiz answers |
| `social-proof` | Transition | Social credibility screen |
| `email` | Capture | Optional email input, saves to DB |
| `chat` | Core | AI chat session (5 messages, then analysis) |
| `paywall` | Conversion | Subscription offer with two plans |

## Quiz Data Model

All quiz answers are stored in Zustand state (persisted to `localStorage`).

```ts
type QuizData = {
  name: string
  personality: 'supportive' | 'analytical' | 'motivational' | 'empathetic' | null
  therapyStyle: 'cbt' | 'mindfulness' | 'solution-focused' | 'somatic' | null
  goal: 'manage-stress' | 'relationships' | 'confidence' | 'anxiety' | null
  mood: 'thriving' | 'good' | 'struggling' | 'overwhelmed' | null
}
```

Quiz answers are also saved to the `Session` DB record via `PATCH /api/session` after the quiz is submitted.

## Navigation

`useFunnelNavigation(funnelSlug, currentStep)` returns:
- `goToNext()` — navigates to the next step in `FUNNEL_STEPS`
- `goBack()` — navigates to the previous step

The progress bar at the top shows completion percentage based on current step index. It is hidden on the `intro` step.

## Step Registry

Each step component is registered in `src/features/funnel/registry/step-views.ts`:

```ts
export const STEP_VIEWS: Record<FunnelStep, ComponentType<StepViewProps>> = {
  'intro': IntroStepView,
  'name': NameStepView,
  // ...
}
```

The dynamic page at `src/app/[funnel-slug]/[step]/page.tsx` looks up the correct view from this map and renders it.

## Key Files

```
src/features/funnel/
  config/ai-twin.config.ts     — FUNNEL_STEPS, FunnelStep type, step labels
  hooks/use-funnel-navigation.ts
  registry/step-views.ts
  steps/intro-step.view.tsx
  components/progress-bar.component.tsx

src/features/quiz/
  store.ts                     — Zustand store (quizData, setters)
  types.ts                     — QuizData, option types
  utils.ts                     — generatePersonalFeedback()
  steps/                       — one view per quiz step
```

# AI Chat & Analysis

## Overview

After completing the quiz, the user enters an AI chat session with their personalized twin. The chat is limited to 5 user messages. On the 5th message, instead of a regular reply, the system runs a psychological analysis and displays results in a modal.

## Chat Flow

```
User sends message
  ↓
messageCount < 5  →  POST /api/chat  →  AI reply displayed
  ↓
messageCount = 5  →  POST /api/analyze  →  AnalysisModal opens
                                          ↓
                                     User clicks "See plans"  →  /paywall
```

## Intro Message

When the chat opens, the first message is generated locally (no API call) based on the user's selected goal:

| Goal | Opener |
|---|---|
| `manage-stress` | "What's been weighing on you lately — even if it seems small?" |
| `relationships` | "Is there a relationship in your life you'd like to talk about today?" |
| `confidence` | "What's one area where you wish you felt more confident?" |
| `anxiety` | "How has anxiety been showing up for you recently?" |

## `/api/chat` — Chat Reply

**POST** — requires session cookie

Generates a single conversational reply using Groq (`llama-3.1-8b-instant`).

The system prompt is built dynamically from quiz answers:

- **Personality** maps to a communication style (warm, logical, energetic, empathetic)
- **Therapy style** maps to a technique (CBT, mindfulness, solution-focused, somatic)

Key rule in the prompt: if the user expresses positive feelings, celebrate that — never reframe positivity as a problem.

Settings: `temperature: 0.7`, `max_tokens: 150`

## `/api/analyze` — Psychological Analysis

**POST** — requires session cookie

Runs after the 5th user message. Analyzes all user messages in context of their quiz answers and returns structured JSON:

```ts
type AnalysisResult = {
  stressors: string[]       // identified stress factors
  emotionalTone: string     // overall emotional tone
  keyThemes: string[]       // recurring themes
  recommendation: string    // warm, actionable 1-2 sentence suggestion
  intensity: 'low' | 'moderate' | 'high'
}
```

The LLM is instructed to return `response_format: { type: 'json_object' }`. The response is validated with Zod before use — no `as` casts.

Settings: `temperature: 0.4`, `max_tokens: 400`

## Analysis Modal

After analysis completes, `AnalysisModal` opens automatically. It displays:
- Emotional tone and intensity
- Identified stressors
- Key themes
- A personalized recommendation

The user can dismiss the modal (stays on chat) or click "See plans" which navigates to the paywall.

## Key Files

```
src/features/chat/
  types.ts                            — ChatMessage, AnalysisResult, analysisResultSchema
  api.ts                              — fetchChatReply(), fetchAnalysis()
  hooks/use-chat.ts                   — chat state, message handling, analysis trigger
  chat-window.view.tsx                — chat UI, input, typing indicator
  components/analysis-modal.component.tsx

src/app/api/
  chat/route.ts                       — Groq chat reply endpoint
  analyze/route.ts                    — Groq analysis endpoint
```

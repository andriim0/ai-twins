# AI Twin

A personalized AI companion funnel — users complete a short quiz, chat with an AI twin tailored to their answers, receive a psychological analysis, and are presented with a subscription offer.

## Overview

The product is a conversion funnel with an embedded AI chat experience. No account is required to start. A session is created automatically on the first event and tracked via a cookie.

**Live funnel:** `/ai-twin`

## Documentation


| Document                                | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| [Funnel & Quiz](docs/funnel.md)         | Step flow, navigation, quiz data model                 |
| [AI Chat & Analysis](docs/ai-chat.md)   | Chat replies, psychological analysis, Groq integration |
| [Analytics & Events](docs/analytics.md) | Event tracking, session lifecycle, DB schema           |
| [Data & API](docs/data.md)              | API routes, Prisma models, session persistence         |
| [Roadmap](docs/roadmap.md)              | Improvements and features to implement                 |


## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Neon (serverless)
- **ORM:** Prisma 7
- **AI:** Groq API — `llama-3.1-8b-instant`
- **State:** Zustand with `persist` middleware
- **Validation:** Zod
- **UI Primitives:** Base UI, Framer Motion

## Getting Started

```bash
npm install
npx prisma generate
npm run dev
```

Required environment variables:

```env
DATABASE_URL=
GROQ_API_KEY=
```


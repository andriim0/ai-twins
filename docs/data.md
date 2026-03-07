# Data & API

## Database Schema

PostgreSQL via Neon serverless. ORM: Prisma 7.

### Session

Represents a unique anonymous user, identified by a UUID stored in a cookie.

```prisma
model Session {
  id        String   @id          // UUID from cookie
  email     String?               // captured at email step
  quizData  Json?                 // full QuizData object
  platform  String?               // 'mobile' | 'desktop'
  referrer  String?               // HTTP Referer on first visit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  events    Event[]
}
```

### Event

Every tracked user action.

```prisma
model Event {
  id         String   @id @default(cuid())
  userId     String
  type       String
  payload    Json?
  timeOnStep Int?                 // ms spent on step before this event
  platform   String?
  referrer   String?
  createdAt  DateTime @default(now())
  session    Session  @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([type])
  @@index([createdAt])
}
```

## API Routes

### `POST /api/events`

Tracks a user event. Creates a session and sets a `uid` cookie if the user is new. No auth required.

**Body:**
```ts
{ type: string, payload?: object, timeOnStep?: number }
```

### `PATCH /api/session`

Updates the current user's session (email or quizData). Requires a valid `uid` cookie.

**Body:**
```ts
{ email?: string, quizData?: object }
```

### `POST /api/chat`

Returns a single AI chat reply. Requires a valid `uid` cookie.

**Body:**
```ts
{ messages: { role: 'user' | 'assistant', content: string }[], quizData: QuizData }
```

**Response:**
```ts
{ content: string }
```

### `POST /api/analyze`

Runs a psychological analysis on the user's chat messages. Requires a valid `uid` cookie.

**Body:**
```ts
{ messages: string[], quizData: QuizData }
```

**Response:**
```ts
{ stressors: string[], emotionalTone: string, keyThemes: string[], recommendation: string, intensity: 'low' | 'moderate' | 'high' }
```

## Validation

All API routes validate request bodies with Zod before any DB or LLM call. All LLM responses are also parsed through Zod schemas — no `as` casts anywhere.

## Error Handling

Typed error classes in `src/lib/errors.ts`:

| Class | Use |
|---|---|
| `AppError` | Base class |
| `ApiError` | HTTP errors from fetch calls |
| `ValidationError` | Zod parse failures |

## Key Files

```
prisma/schema.prisma
src/lib/prisma.ts              — Prisma client singleton (globalThis pattern)
src/lib/errors.ts              — AppError, ApiError, ValidationError
src/lib/user-id.ts             — Cookie-based anonymous identity
src/lib/json.ts                — jsonObjectSchema (Zod schema for Json fields)
src/app/api/
  events/route.ts
  session/route.ts
  chat/route.ts
  analyze/route.ts
```

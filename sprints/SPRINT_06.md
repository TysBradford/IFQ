# Sprint 6: Backend API Complete

**Theme**: Feature-complete API
**Duration**: 1 week

---

## Objective

Complete all remaining backend functionality: progress tracking, milestones, health timeline, and money saved calculations. Document everything with OpenAPI/Swagger and add integration tests.

---

## Prerequisites

- Sprint 4 & 5 complete
- Database schema finalized
- Vera AI chat working
- Authentication fully functional

---

## Deliverables

### 1. Progress Tracking Endpoints

**Quit Attempt Management:**

```typescript
// lib/quit-attempt.ts
import { supabase } from './supabase'

export interface QuitAttempt {
  id: string
  user_id: string
  started_at: string
  ended_at: string | null
  end_reason: string | null
  is_active: boolean
  cigarettes_avoided: number
  money_saved: number
  created_at: string
}

// Start a new quit attempt
export async function startQuitAttempt(userId: string): Promise<QuitAttempt> {
  // End any existing active attempts
  await supabase
    .from('quit_attempts')
    .update({ is_active: false, ended_at: new Date().toISOString(), end_reason: 'restarted' })
    .eq('user_id', userId)
    .eq('is_active', true)

  // Create new attempt
  const { data, error } = await supabase
    .from('quit_attempts')
    .insert({ user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get active quit attempt
export async function getActiveQuitAttempt(userId: string): Promise<QuitAttempt | null> {
  const { data, error } = await supabase
    .from('quit_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Calculate progress stats
export async function getProgressStats(userId: string): Promise<ProgressStats> {
  const attempt = await getActiveQuitAttempt(userId)
  if (!attempt) return getEmptyStats()

  const smokingProfile = await getSmokingProfile(userId)
  const startDate = new Date(attempt.started_at)
  const now = new Date()

  // Time calculations
  const msElapsed = now.getTime() - startDate.getTime()
  const minutesQuit = Math.floor(msElapsed / (1000 * 60))
  const hoursQuit = Math.floor(msElapsed / (1000 * 60 * 60))
  const daysQuit = Math.floor(msElapsed / (1000 * 60 * 60 * 24))

  // Cigarettes and money calculations
  const cigarettesPerDay = smokingProfile?.cigarettes_per_day || 20
  const packPrice = smokingProfile?.pack_price || 35 // AUD default
  const cigarettesPerPack = 20

  const cigarettesAvoided = Math.floor((daysQuit + (hoursQuit % 24) / 24) * cigarettesPerDay)
  const packsAvoided = cigarettesAvoided / cigarettesPerPack
  const moneySaved = packsAvoided * packPrice

  return {
    quitAttemptId: attempt.id,
    startedAt: attempt.started_at,
    minutesQuit,
    hoursQuit,
    daysQuit,
    cigarettesAvoided,
    moneySaved: Math.round(moneySaved * 100) / 100,
    currency: smokingProfile?.currency || 'AUD'
  }
}

export interface ProgressStats {
  quitAttemptId: string
  startedAt: string
  minutesQuit: number
  hoursQuit: number
  daysQuit: number
  cigarettesAvoided: number
  moneySaved: number
  currency: string
}
```

**API Routes:**

```typescript
// app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getProgressStats, startQuitAttempt } from '@/lib/quit-attempt'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await getProgressStats(user.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Progress stats error:', error)
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const attempt = await startQuitAttempt(user.id)
    return NextResponse.json(attempt)
  } catch (error) {
    console.error('Start quit attempt error:', error)
    return NextResponse.json({ error: 'Failed to start quit attempt' }, { status: 500 })
  }
}
```

### 2. Milestones and Achievements System

**Milestone Definitions:**

```typescript
// lib/milestones.ts

export interface MilestoneDefinition {
  key: string
  type: 'time' | 'health' | 'money' | 'cigarettes'
  title: string
  description: string
  triggerMinutes?: number  // For time-based
  triggerAmount?: number   // For money/cigarettes
  celebrationMessage: string
  icon: string
}

export const MILESTONES: MilestoneDefinition[] = [
  // Time milestones
  {
    key: '20_minutes',
    type: 'time',
    title: '20 Minutes',
    description: 'Your heart rate and blood pressure start to drop.',
    triggerMinutes: 20,
    celebrationMessage: "20 minutes in. Your heart rate is already normalizing. Your body noticed you quit before your brain did.",
    icon: 'heart'
  },
  {
    key: '8_hours',
    type: 'time',
    title: '8 Hours',
    description: 'Carbon monoxide levels in your blood drop to normal.',
    triggerMinutes: 8 * 60,
    celebrationMessage: "8 hours. The carbon monoxide is clearing from your blood. Oxygen levels rising. You're literally breathing easier.",
    icon: 'lungs'
  },
  {
    key: '24_hours',
    type: 'time',
    title: '24 Hours',
    description: 'Your risk of heart attack begins to decrease.',
    triggerMinutes: 24 * 60,
    celebrationMessage: "24 hours smoke-free. Your heart attack risk is already dropping. One day down, a lifetime to go. You're doing it.",
    icon: 'shield'
  },
  {
    key: '48_hours',
    type: 'time',
    title: '48 Hours',
    description: 'Nerve endings start to regrow. Taste and smell improve.',
    triggerMinutes: 48 * 60,
    celebrationMessage: "48 hours. Your nerve endings are regenerating. Food is about to taste way better. Smell that? That's your senses coming back.",
    icon: 'sparkles'
  },
  {
    key: '72_hours',
    type: 'time',
    title: '72 Hours',
    description: 'Nicotine is completely out of your system.',
    triggerMinutes: 72 * 60,
    celebrationMessage: "72 hours. The nicotine is officially OUT of your system. Everything from here is psychological. Your body is free.",
    icon: 'trophy'
  },
  {
    key: '1_week',
    type: 'time',
    title: '1 Week',
    description: 'Your lungs are already healing.',
    triggerMinutes: 7 * 24 * 60,
    celebrationMessage: "One week. 168 hours without letting a corporation dictate when you need to step outside. Your lungs are healing as you read this.",
    icon: 'star'
  },
  {
    key: '2_weeks',
    type: 'time',
    title: '2 Weeks',
    description: 'Circulation improves. Walking gets easier.',
    triggerMinutes: 14 * 24 * 60,
    celebrationMessage: "Two weeks. Your circulation is improving. You might notice exercise is getting easier. Your body is rebuilding.",
    icon: 'zap'
  },
  {
    key: '1_month',
    type: 'time',
    title: '1 Month',
    description: 'Lung function increases up to 30%. Cilia regrow.',
    triggerMinutes: 30 * 24 * 60,
    celebrationMessage: "One month. 30 days. Your lung function has improved up to 30%. The cilia in your lungs are regrowing. You did this.",
    icon: 'award'
  },
  {
    key: '3_months',
    type: 'time',
    title: '3 Months',
    description: 'Your risk of heart disease has significantly decreased.',
    triggerMinutes: 90 * 24 * 60,
    celebrationMessage: "Three months smoke-free. Your heart disease risk has dropped significantly. This is real, lasting change.",
    icon: 'medal'
  },
  {
    key: '6_months',
    type: 'time',
    title: '6 Months',
    description: 'Coughing, sinus congestion, and shortness of breath decrease.',
    triggerMinutes: 180 * 24 * 60,
    celebrationMessage: "Six months. Half a year. You've probably stopped coughing. Breathing feels normal now. This is your new baseline.",
    icon: 'crown'
  },
  {
    key: '1_year',
    type: 'time',
    title: '1 Year',
    description: 'Your excess risk of coronary heart disease is half that of a smoker.',
    triggerMinutes: 365 * 24 * 60,
    celebrationMessage: "ONE YEAR. 365 days. Your heart disease risk is now half what it was when you smoked. You fucking did it.",
    icon: 'gem'
  },

  // Money milestones
  {
    key: 'saved_100',
    type: 'money',
    title: '$100 Saved',
    description: "That's a nice dinner for two.",
    triggerAmount: 100,
    celebrationMessage: "$100 saved. That's money that would have literally gone up in smoke. Treat yourself.",
    icon: 'dollar'
  },
  {
    key: 'saved_500',
    type: 'money',
    title: '$500 Saved',
    description: "That's a weekend away.",
    triggerAmount: 500,
    celebrationMessage: "$500 saved. That's a weekend trip. A new phone. Three months of streaming subscriptions. Your choice.",
    icon: 'wallet'
  },
  {
    key: 'saved_1000',
    type: 'money',
    title: '$1,000 Saved',
    description: "A thousand dollars kept in your pocket.",
    triggerAmount: 1000,
    celebrationMessage: "One thousand dollars saved. Let that sink in. $1,000 you would have burned. It's yours now.",
    icon: 'piggy-bank'
  },

  // Cigarettes avoided
  {
    key: 'avoided_100',
    type: 'cigarettes',
    title: '100 Cigarettes Avoided',
    description: "Five packs worth of poison you didn't inhale.",
    triggerAmount: 100,
    celebrationMessage: "100 cigarettes not smoked. That's 5 packs of poison that didn't touch your lungs.",
    icon: 'check'
  },
  {
    key: 'avoided_500',
    type: 'cigarettes',
    title: '500 Cigarettes Avoided',
    description: "That's over 40 hours of not smoking.",
    triggerAmount: 500,
    celebrationMessage: "500 cigarettes avoided. If each one took 5 minutes, that's over 40 hours you got back.",
    icon: 'clock'
  },
  {
    key: 'avoided_1000',
    type: 'cigarettes',
    title: '1,000 Cigarettes Avoided',
    description: "One thousand cigarettes. Let that sink in.",
    triggerAmount: 1000,
    celebrationMessage: "One thousand cigarettes. 50 packs. That would have been thousands of chemicals in your lungs. Not anymore.",
    icon: 'flame'
  }
]

// Check and award milestones
export async function checkMilestones(userId: string, stats: ProgressStats): Promise<MilestoneDefinition[]> {
  const newlyAchieved: MilestoneDefinition[] = []

  // Get already achieved milestones
  const { data: achieved } = await supabase
    .from('milestones')
    .select('milestone_key')
    .eq('user_id', userId)
    .eq('quit_attempt_id', stats.quitAttemptId)

  const achievedKeys = new Set(achieved?.map(m => m.milestone_key) || [])

  for (const milestone of MILESTONES) {
    if (achievedKeys.has(milestone.key)) continue

    let triggered = false

    switch (milestone.type) {
      case 'time':
        triggered = stats.minutesQuit >= (milestone.triggerMinutes || 0)
        break
      case 'money':
        triggered = stats.moneySaved >= (milestone.triggerAmount || 0)
        break
      case 'cigarettes':
        triggered = stats.cigarettesAvoided >= (milestone.triggerAmount || 0)
        break
    }

    if (triggered) {
      // Save milestone
      await supabase.from('milestones').insert({
        user_id: userId,
        quit_attempt_id: stats.quitAttemptId,
        milestone_type: milestone.type,
        milestone_key: milestone.key
      })

      newlyAchieved.push(milestone)
    }
  }

  return newlyAchieved
}

// Get all achieved milestones for user
export async function getAchievedMilestones(userId: string, quitAttemptId: string): Promise<AchievedMilestone[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', userId)
    .eq('quit_attempt_id', quitAttemptId)
    .order('achieved_at', { ascending: true })

  if (error) throw error

  return (data || []).map(m => ({
    ...MILESTONES.find(def => def.key === m.milestone_key)!,
    achievedAt: m.achieved_at
  }))
}
```

### 3. Health Timeline Data

**Health Recovery Timeline:**

```typescript
// lib/health-timeline.ts

export interface HealthEvent {
  minutesAfterQuit: number
  title: string
  description: string
  category: 'cardiovascular' | 'respiratory' | 'sensory' | 'metabolic'
  icon: string
}

export const HEALTH_TIMELINE: HealthEvent[] = [
  {
    minutesAfterQuit: 20,
    title: 'Heart Rate Normalizes',
    description: 'Your heart rate and blood pressure begin to drop back to normal levels.',
    category: 'cardiovascular',
    icon: 'heart-pulse'
  },
  {
    minutesAfterQuit: 8 * 60,
    title: 'Carbon Monoxide Clears',
    description: 'Carbon monoxide levels in your blood drop to normal. Oxygen levels increase.',
    category: 'respiratory',
    icon: 'wind'
  },
  {
    minutesAfterQuit: 24 * 60,
    title: 'Heart Attack Risk Drops',
    description: 'Your risk of having a heart attack begins to decrease.',
    category: 'cardiovascular',
    icon: 'shield'
  },
  {
    minutesAfterQuit: 48 * 60,
    title: 'Senses Returning',
    description: 'Nerve endings start to regrow. Your sense of taste and smell begin to improve.',
    category: 'sensory',
    icon: 'sparkles'
  },
  {
    minutesAfterQuit: 72 * 60,
    title: 'Nicotine-Free',
    description: 'Nicotine is completely eliminated from your body. Bronchial tubes begin to relax.',
    category: 'metabolic',
    icon: 'check-circle'
  },
  {
    minutesAfterQuit: 7 * 24 * 60,
    title: 'Lungs Begin Healing',
    description: 'Cilia in your lungs begin to regrow, increasing ability to clear mucus and reduce infection.',
    category: 'respiratory',
    icon: 'lungs'
  },
  {
    minutesAfterQuit: 14 * 24 * 60,
    title: 'Improved Circulation',
    description: 'Blood circulation improves. Walking and exercise become easier.',
    category: 'cardiovascular',
    icon: 'activity'
  },
  {
    minutesAfterQuit: 30 * 24 * 60,
    title: 'Lung Function Up 30%',
    description: 'Lung function increases by up to 30%. Breathing is noticeably easier.',
    category: 'respiratory',
    icon: 'trending-up'
  },
  {
    minutesAfterQuit: 90 * 24 * 60,
    title: 'Cilia Fully Regrown',
    description: 'Cilia have fully regrown. Lungs can effectively clear mucus and fight infections.',
    category: 'respiratory',
    icon: 'shield-check'
  },
  {
    minutesAfterQuit: 180 * 24 * 60,
    title: 'Symptoms Decrease',
    description: 'Coughing, sinus congestion, tiredness, and shortness of breath decrease significantly.',
    category: 'respiratory',
    icon: 'minus-circle'
  },
  {
    minutesAfterQuit: 365 * 24 * 60,
    title: 'Heart Disease Risk Halved',
    description: 'Your excess risk of coronary heart disease is now half that of a continuing smoker.',
    category: 'cardiovascular',
    icon: 'heart'
  },
  {
    minutesAfterQuit: 5 * 365 * 24 * 60,
    title: 'Stroke Risk Normal',
    description: 'Your risk of stroke is reduced to that of a non-smoker.',
    category: 'cardiovascular',
    icon: 'brain'
  },
  {
    minutesAfterQuit: 10 * 365 * 24 * 60,
    title: 'Lung Cancer Risk Halved',
    description: 'Your risk of dying from lung cancer is about half that of a continuing smoker.',
    category: 'respiratory',
    icon: 'award'
  }
]

// Get timeline with progress markers
export function getHealthTimeline(minutesQuit: number): HealthTimelineResponse {
  const achieved = HEALTH_TIMELINE.filter(e => minutesQuit >= e.minutesAfterQuit)
  const upcoming = HEALTH_TIMELINE.filter(e => minutesQuit < e.minutesAfterQuit)

  // Get next milestone
  const next = upcoming[0] || null
  const nextProgress = next
    ? Math.min(100, (minutesQuit / next.minutesAfterQuit) * 100)
    : 100

  return {
    achieved,
    upcoming,
    next,
    nextProgress: Math.round(nextProgress),
    currentMinutes: minutesQuit
  }
}

export interface HealthTimelineResponse {
  achieved: HealthEvent[]
  upcoming: HealthEvent[]
  next: HealthEvent | null
  nextProgress: number
  currentMinutes: number
}
```

**API Route:**

```typescript
// app/api/health-timeline/route.ts
export async function GET(req: NextRequest) {
  // ... auth check ...

  const stats = await getProgressStats(user.id)
  const timeline = getHealthTimeline(stats.minutesQuit)

  return NextResponse.json(timeline)
}
```

### 4. Money Saved Calculator

**Detailed Savings Breakdown:**

```typescript
// lib/money-saved.ts

export interface MoneySavedBreakdown {
  totalSaved: number
  currency: string
  packsSaved: number
  projectedYearly: number
  projectedFiveYear: number
  dailyRate: number
  equivalentTo: SavingsEquivalent[]
}

export interface SavingsEquivalent {
  item: string
  quantity: number
  icon: string
}

export function calculateMoneySaved(
  daysQuit: number,
  cigarettesPerDay: number,
  packPrice: number,
  currency: string = 'AUD'
): MoneySavedBreakdown {
  const cigarettesPerPack = 20
  const dailyCost = (cigarettesPerDay / cigarettesPerPack) * packPrice
  const totalSaved = dailyCost * daysQuit
  const packsSaved = (cigarettesPerDay * daysQuit) / cigarettesPerPack

  // Projections
  const projectedYearly = dailyCost * 365
  const projectedFiveYear = projectedYearly * 5

  // Fun equivalents (AUD-centric but adaptable)
  const equivalentTo = calculateEquivalents(totalSaved, currency)

  return {
    totalSaved: Math.round(totalSaved * 100) / 100,
    currency,
    packsSaved: Math.round(packsSaved * 10) / 10,
    projectedYearly: Math.round(projectedYearly),
    projectedFiveYear: Math.round(projectedFiveYear),
    dailyRate: Math.round(dailyCost * 100) / 100,
    equivalentTo
  }
}

function calculateEquivalents(amount: number, currency: string): SavingsEquivalent[] {
  // AUD equivalents (adjust for other currencies)
  const equivalents = [
    { item: 'coffees', price: 5, icon: 'coffee' },
    { item: 'movie tickets', price: 22, icon: 'film' },
    { item: 'streaming months', price: 15, icon: 'tv' },
    { item: 'nice dinners', price: 80, icon: 'utensils' },
    { item: 'concert tickets', price: 120, icon: 'music' },
    { item: 'weekend getaways', price: 400, icon: 'plane' }
  ]

  return equivalents
    .map(eq => ({
      item: eq.item,
      quantity: Math.floor(amount / eq.price),
      icon: eq.icon
    }))
    .filter(eq => eq.quantity >= 1)
    .slice(0, 4) // Top 4 most relevant
}
```

### 5. API Documentation (OpenAPI/Swagger)

**OpenAPI Spec:**

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: IFQ API
  description: Backend API for IFQ quit smoking app
  version: 1.0.0
  contact:
    email: api@ifq.app

servers:
  - url: https://api.ifq.app/v1
    description: Production
  - url: http://localhost:3000/api
    description: Development

security:
  - bearerAuth: []

paths:
  /progress:
    get:
      summary: Get current progress stats
      tags: [Progress]
      responses:
        200:
          description: Progress statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProgressStats'
        401:
          $ref: '#/components/responses/Unauthorized'

    post:
      summary: Start a new quit attempt
      tags: [Progress]
      responses:
        200:
          description: New quit attempt created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuitAttempt'

  /milestones:
    get:
      summary: Get achieved milestones
      tags: [Milestones]
      responses:
        200:
          description: List of achieved milestones
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Milestone'

  /health-timeline:
    get:
      summary: Get health recovery timeline
      tags: [Health]
      responses:
        200:
          description: Health timeline with progress
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthTimeline'

  /chat:
    post:
      summary: Send message to Vera
      tags: [Chat]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                conversationId:
                  type: string
              required: [message]
      responses:
        200:
          description: Vera's response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  conversationId:
                    type: string

  /chat/stream:
    post:
      summary: Send message to Vera (streaming)
      tags: [Chat]
      responses:
        200:
          description: Server-sent event stream
          content:
            text/event-stream:
              schema:
                type: string

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    ProgressStats:
      type: object
      properties:
        quitAttemptId:
          type: string
        startedAt:
          type: string
          format: date-time
        minutesQuit:
          type: integer
        hoursQuit:
          type: integer
        daysQuit:
          type: integer
        cigarettesAvoided:
          type: integer
        moneySaved:
          type: number
        currency:
          type: string

    QuitAttempt:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        startedAt:
          type: string
          format: date-time
        isActive:
          type: boolean

    Milestone:
      type: object
      properties:
        key:
          type: string
        type:
          type: string
          enum: [time, health, money, cigarettes]
        title:
          type: string
        description:
          type: string
        celebrationMessage:
          type: string
        achievedAt:
          type: string
          format: date-time

    HealthTimeline:
      type: object
      properties:
        achieved:
          type: array
          items:
            $ref: '#/components/schemas/HealthEvent'
        upcoming:
          type: array
          items:
            $ref: '#/components/schemas/HealthEvent'
        next:
          $ref: '#/components/schemas/HealthEvent'
        nextProgress:
          type: integer
        currentMinutes:
          type: integer

    HealthEvent:
      type: object
      properties:
        minutesAfterQuit:
          type: integer
        title:
          type: string
        description:
          type: string
        category:
          type: string

  responses:
    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
```

**Swagger UI Setup:**

```typescript
// app/api/docs/route.ts
import { NextResponse } from 'next/server'
import SwaggerUI from 'swagger-ui-react'

// Serve OpenAPI spec
export async function GET() {
  const spec = await import('@/openapi.yaml')
  return NextResponse.json(spec)
}
```

### 6. Integration Tests

```typescript
// __tests__/api/progress.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/progress/route'

describe('Progress API', () => {
  describe('GET /api/progress', () => {
    it('returns 401 without auth', async () => {
      const { req } = createMocks({ method: 'GET' })
      const response = await GET(req)
      expect(response.status).toBe(401)
    })

    it('returns progress stats for authenticated user', async () => {
      // Mock authenticated request
      const { req } = createMocks({
        method: 'GET',
        headers: { Authorization: 'Bearer test-token' }
      })

      // Mock auth
      jest.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: { id: 'test-user' } },
        error: null
      })

      const response = await GET(req)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('daysQuit')
      expect(data).toHaveProperty('moneySaved')
    })
  })

  describe('POST /api/progress', () => {
    it('creates new quit attempt', async () => {
      // ... test implementation
    })

    it('ends previous active attempt when starting new one', async () => {
      // ... test implementation
    })
  })
})

// __tests__/lib/milestones.test.ts
describe('Milestones', () => {
  it('triggers time-based milestones correctly', async () => {
    const stats = {
      quitAttemptId: 'test',
      minutesQuit: 25, // Should trigger 20-minute milestone
      moneySaved: 0,
      cigarettesAvoided: 0
    }

    const achieved = await checkMilestones('user-id', stats)
    expect(achieved.some(m => m.key === '20_minutes')).toBe(true)
  })

  it('does not re-trigger already achieved milestones', async () => {
    // ... test implementation
  })
})
```

---

## Tasks

### Progress Tracking (Day 1)
- [ ] Build quit attempt management functions
- [ ] Create progress stats calculator
- [ ] Build GET /api/progress endpoint
- [ ] Build POST /api/progress endpoint
- [ ] Test calculations accuracy

### Milestones System (Day 2)
- [ ] Define all milestone definitions
- [ ] Build milestone check logic
- [ ] Create milestones API endpoint
- [ ] Test milestone triggers
- [ ] Add milestone notification flag

### Health Timeline (Day 3)
- [ ] Define health timeline events
- [ ] Build timeline calculation logic
- [ ] Create timeline API endpoint
- [ ] Test progress calculations
- [ ] Add category filtering

### Money Saved Calculator (Day 3-4)
- [ ] Build detailed savings calculations
- [ ] Add equivalent items feature
- [ ] Create money saved endpoint
- [ ] Test with various inputs
- [ ] Handle edge cases

### API Documentation (Day 4)
- [ ] Write OpenAPI spec
- [ ] Set up Swagger UI at /docs
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Test spec validity

### Integration Tests (Day 5)
- [ ] Set up testing framework
- [ ] Write progress API tests
- [ ] Write milestones tests
- [ ] Write health timeline tests
- [ ] Run full test suite
- [ ] Fix any failing tests

---

## Success Criteria

- [ ] All MVP endpoints documented and tested
- [ ] Milestone triggers fire correctly
- [ ] Health timeline returns accurate data
- [ ] Money saved calculations are accurate
- [ ] API docs accessible at /docs
- [ ] Integration tests pass
- [ ] No security vulnerabilities in endpoints

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API documentation | OpenAPI 3.0 | Industry standard, tooling support |
| Documentation UI | Swagger UI | Familiar, interactive |
| Testing framework | Jest | Standard for JS/TS, good mocking |
| Time calculations | Server-side | Consistent across clients |

---

## Notes

- Health timeline data comes from medical research—cite sources if questioned
- Milestone messages should match Vera's voice (warm, celebratory)
- Money calculations should use user's pack price from onboarding
- Consider adding slip event tracking API in future sprint
- All progress data resets when starting a new quit attempt

---

## Resources

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Jest Testing Framework](https://jestjs.io/)
- [Quit Smoking Health Timeline (CDC)](https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/benefits/index.htm)

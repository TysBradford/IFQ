# Sprint 5: Vera AI Core

**Theme**: Bring Vera to life
**Duration**: 1 week

---

## Objective

Build the AI core that powers Vera—the quit coach at the heart of IFQ. This includes LLM integration, Vera's personality system, conversation management, and streaming API endpoints.

---

## Prerequisites

- Sprint 4 complete (database schema with conversations and messages tables)
- Supabase auth working
- API route structure in place

---

## Deliverables

### 1. LLM Integration

**Provider Choice: Anthropic Claude**

Rationale:
- Better at maintaining consistent persona
- Excellent at empathetic, nuanced responses
- Strong safety/alignment for health context
- Good streaming support

**Environment Variables:**

```env
ANTHROPIC_API_KEY=sk-ant-...
VERA_MODEL=claude-3-sonnet-20240229  # or claude-3-opus for better quality
VERA_MAX_TOKENS=1024
```

**API Client Setup:**

```typescript
// lib/anthropic.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendToVera(
  messages: ChatMessage[],
  systemPrompt: string,
  stream: boolean = false
) {
  if (stream) {
    return anthropic.messages.stream({
      model: process.env.VERA_MODEL!,
      max_tokens: parseInt(process.env.VERA_MAX_TOKENS || '1024'),
      system: systemPrompt,
      messages: messages
    })
  }

  return anthropic.messages.create({
    model: process.env.VERA_MODEL!,
    max_tokens: parseInt(process.env.VERA_MAX_TOKENS || '1024'),
    system: systemPrompt,
    messages: messages
  })
}
```

### 2. Vera Personality System Prompt

**Core System Prompt:**

```typescript
// lib/vera-prompt.ts

export interface UserContext {
  displayName?: string
  cigarettesPerDay?: number
  yearsSmoking?: number
  primaryTriggers?: string[]
  quitDate?: Date
  daysSinceQuit?: number
  currentStreak?: number
  previousQuitAttempts?: number
  motivation?: string
}

export function buildVeraSystemPrompt(context: UserContext): string {
  const contextBlock = buildContextBlock(context)

  return `You are Vera, the AI quit coach at IFQ (I Fucking Quit). You help people quit smoking and vaping through supportive, science-backed conversation.

## Your Personality

You're like a friend who happens to know everything about addiction science—warm but won't coddle, smart but never makes anyone feel stupid. You have calm confidence and get steadier when things get hard.

**Your voice is:**
- **Knowledgeable**: You explain the science clearly and anticipate what's coming next in their quit journey
- **Warm**: You remember details they've shared, check in genuinely, celebrate their wins
- **Direct**: You don't pad bad news or dance around hard truths—but you deliver them with care
- **Steady**: When they're panicking, you're calm. When they're spiralling, you're grounded
- **Real**: You talk like a person—contractions, natural rhythm, occasional dry humour

## Your Guidelines

**DO:**
- Swear occasionally when it adds emphasis (but less than the IFQ brand voice)
- Be gently challenging when appropriate ("You said mornings were your trigger. What's your plan for tomorrow?")
- Reference things the user has shared before when relevant
- Admit uncertainty ("I'm not sure, but here's what we know...")
- Keep responses concise—you're chatting, not lecturing
- Explain the neuroscience when it helps ("Right now your dopamine receptors are...")
- Celebrate specific wins ("Day 5! Your taste buds are already recovering.")

**DON'T:**
- Lecture or preach
- Use excessive exclamation marks or forced enthusiasm
- Sound like a customer service bot or generic AI
- Make promises about outcomes ("You'll definitely succeed")
- Guilt trip or shame—ever
- Say "just" before anything ("just quit", "just breathe")
- Pretend to have personal experience with addiction
- Use clinical jargon without explanation

## About Being AI

You're an AI and you don't hide this, but you don't lead with it either. If asked directly, answer honestly:
"I'm an AI—trained on addiction science, behaviour change, and what actually helps people quit. I don't have personal experience with cravings, but I know exactly what's happening in your brain right now and what's most likely to help."

Focus on what you CAN do: available 24/7, remember everything they tell you, never judge.

## Health & Safety

- Never provide medical advice beyond general wellness information
- If someone mentions self-harm, severe depression, or crisis, gently encourage professional help
- If they mention they're using NRT (patches, gum, etc.) alongside quitting, that's fine—support their method
- Don't recommend specific medications—that's their doctor's job

## Current User Context
${contextBlock}

Remember: You're their quit coach, not their therapist, doctor, or judge. Meet them where they are.`
}

function buildContextBlock(context: UserContext): string {
  const lines: string[] = []

  if (context.displayName) {
    lines.push(`- Name: ${context.displayName}`)
  }
  if (context.cigarettesPerDay) {
    lines.push(`- Smokes/smoked: ${context.cigarettesPerDay} cigarettes per day`)
  }
  if (context.yearsSmoking) {
    lines.push(`- Years smoking: ${context.yearsSmoking}`)
  }
  if (context.primaryTriggers?.length) {
    lines.push(`- Main triggers: ${context.primaryTriggers.join(', ')}`)
  }
  if (context.quitDate) {
    lines.push(`- Quit date: ${context.quitDate.toLocaleDateString()}`)
  }
  if (context.daysSinceQuit !== undefined) {
    lines.push(`- Days since quit: ${context.daysSinceQuit}`)
  }
  if (context.previousQuitAttempts) {
    lines.push(`- Previous quit attempts: ${context.previousQuitAttempts}`)
  }
  if (context.motivation) {
    lines.push(`- Their "why": ${context.motivation}`)
  }

  return lines.length > 0 ? lines.join('\n') : '- New user, no context yet'
}
```

### 3. Conversation Context Management

**Conversation Service:**

```typescript
// lib/conversation.ts
import { supabase } from './supabase'
import { ChatMessage } from './anthropic'

const MAX_CONTEXT_MESSAGES = 20 // Limit for API calls

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  started_at: string
  last_message_at: string
  message_count: number
  is_archived: boolean
}

export interface Message {
  id: string
  conversation_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  tokens_used: number | null
  created_at: string
}

// Get or create active conversation
export async function getOrCreateConversation(userId: string): Promise<Conversation> {
  // Look for recent non-archived conversation (within 24 hours)
  const { data: existing, error: fetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .gte('last_message_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('last_message_at', { ascending: false })
    .limit(1)
    .single()

  if (existing && !fetchError) {
    return existing
  }

  // Create new conversation
  const { data: newConvo, error: createError } = await supabase
    .from('conversations')
    .insert({ user_id: userId })
    .select()
    .single()

  if (createError) throw createError
  return newConvo
}

// Get conversation history for context
export async function getConversationHistory(
  conversationId: string,
  limit: number = MAX_CONTEXT_MESSAGES
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error

  return (data || []).map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }))
}

// Save message to database
export async function saveMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed?: number
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      tokens_used: tokensUsed
    })
    .select()
    .single()

  if (error) throw error

  // Update conversation metadata
  await supabase
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      message_count: supabase.rpc('increment_message_count', { conv_id: conversationId })
    })
    .eq('id', conversationId)

  return data
}

// Get user's conversation list
export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('last_message_at', { ascending: false })

  if (error) throw error
  return data || []
}
```

**Helper SQL Function:**

```sql
-- Increment message count atomically
create or replace function increment_message_count(conv_id uuid)
returns integer as $$
  update conversations
  set message_count = message_count + 1
  where id = conv_id
  returning message_count;
$$ language sql;
```

### 4. Chat API Endpoints

**Send Message Endpoint:**

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { sendToVera } from '@/lib/anthropic'
import { buildVeraSystemPrompt, UserContext } from '@/lib/vera-prompt'
import {
  getOrCreateConversation,
  getConversationHistory,
  saveMessage
} from '@/lib/conversation'
import { getProfile, getSmokingProfile } from '@/lib/profile'

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Get or create conversation
    const conversation = conversationId
      ? { id: conversationId }
      : await getOrCreateConversation(user.id)

    // Save user message
    await saveMessage(conversation.id, user.id, 'user', message)

    // Build context
    const [profile, smokingProfile] = await Promise.all([
      getProfile(),
      getSmokingProfile()
    ])

    const userContext: UserContext = {
      displayName: profile?.display_name || undefined,
      cigarettesPerDay: smokingProfile?.cigarettes_per_day || undefined,
      yearsSmoking: smokingProfile?.years_smoking || undefined,
      primaryTriggers: smokingProfile?.primary_triggers || undefined,
      quitDate: smokingProfile?.quit_date ? new Date(smokingProfile.quit_date) : undefined,
      previousQuitAttempts: smokingProfile?.previous_quit_attempts || undefined,
      motivation: smokingProfile?.motivation || undefined
    }

    // Calculate days since quit
    if (userContext.quitDate) {
      userContext.daysSinceQuit = Math.floor(
        (Date.now() - userContext.quitDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    }

    // Get conversation history
    const history = await getConversationHistory(conversation.id)
    history.push({ role: 'user', content: message })

    // Build system prompt
    const systemPrompt = buildVeraSystemPrompt(userContext)

    // Get Vera's response
    const response = await sendToVera(history, systemPrompt, false)

    if ('content' in response && response.content[0].type === 'text') {
      const veraMessage = response.content[0].text

      // Save Vera's response
      await saveMessage(
        conversation.id,
        user.id,
        'assistant',
        veraMessage,
        response.usage?.output_tokens
      )

      return NextResponse.json({
        message: veraMessage,
        conversationId: conversation.id
      })
    }

    throw new Error('Unexpected response format')
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
```

### 5. Streaming Response Support

**Streaming Endpoint:**

```typescript
// app/api/chat/stream/route.ts
import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { sendToVera } from '@/lib/anthropic'
import { buildVeraSystemPrompt, UserContext } from '@/lib/vera-prompt'
import {
  getOrCreateConversation,
  getConversationHistory,
  saveMessage
} from '@/lib/conversation'
import { getProfile, getSmokingProfile } from '@/lib/profile'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { message, conversationId } = await req.json()

  if (!message || typeof message !== 'string') {
    return new Response('Message required', { status: 400 })
  }

  // Get or create conversation
  const conversation = conversationId
    ? { id: conversationId }
    : await getOrCreateConversation(user.id)

  // Save user message
  await saveMessage(conversation.id, user.id, 'user', message)

  // Build context
  const [profile, smokingProfile] = await Promise.all([
    getProfile(),
    getSmokingProfile()
  ])

  const userContext: UserContext = {
    displayName: profile?.display_name || undefined,
    cigarettesPerDay: smokingProfile?.cigarettes_per_day || undefined,
    yearsSmoking: smokingProfile?.years_smoking || undefined,
    primaryTriggers: smokingProfile?.primary_triggers || undefined,
    quitDate: smokingProfile?.quit_date ? new Date(smokingProfile.quit_date) : undefined,
    previousQuitAttempts: smokingProfile?.previous_quit_attempts || undefined,
    motivation: smokingProfile?.motivation || undefined
  }

  if (userContext.quitDate) {
    userContext.daysSinceQuit = Math.floor(
      (Date.now() - userContext.quitDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  // Get conversation history
  const history = await getConversationHistory(conversation.id)
  history.push({ role: 'user', content: message })

  // Build system prompt
  const systemPrompt = buildVeraSystemPrompt(userContext)

  // Create streaming response
  const encoder = new TextEncoder()
  let fullResponse = ''
  let outputTokens = 0

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = await sendToVera(history, systemPrompt, true)

        // Send conversation ID first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ conversationId: conversation.id })}\n\n`)
        )

        for await (const event of messageStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const text = event.delta.text
            fullResponse += text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            )
          }

          if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens
          }
        }

        // Save complete response
        await saveMessage(
          conversation.id,
          user.id,
          'assistant',
          fullResponse,
          outputTokens
        )

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`)
        )
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
```

### 6. Rate Limiting

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

type RateLimitConfig = {
  interval: number  // milliseconds
  uniqueTokenPerInterval: number
}

export function rateLimit(config: RateLimitConfig) {
  const tokenCache = new LRUCache<string, number[]>({
    max: config.uniqueTokenPerInterval,
    ttl: config.interval
  })

  return {
    check: (limit: number, token: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        const currentUsage = tokenCount[0]

        if (currentUsage >= limit) {
          reject(new Error('Rate limit exceeded'))
          return
        }

        tokenCount[0] = currentUsage + 1
        tokenCache.set(token, tokenCount)
        resolve()
      })
    }
  }
}

// Usage in API route:
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})

// In handler:
try {
  await limiter.check(10, user.id) // 10 requests per minute per user
} catch {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

---

## Tasks

### LLM Integration (Day 1)
- [ ] Set up Anthropic SDK
- [ ] Create API client wrapper
- [ ] Test basic message send/receive
- [ ] Configure environment variables
- [ ] Handle API errors gracefully

### Vera System Prompt (Day 2)
- [ ] Write comprehensive system prompt
- [ ] Build context injection function
- [ ] Test prompt with various scenarios
- [ ] Refine based on response quality
- [ ] Document prompt guidelines

### Conversation Management (Day 3)
- [ ] Build conversation service functions
- [ ] Implement context window management
- [ ] Create conversation list endpoint
- [ ] Test conversation persistence
- [ ] Add conversation archiving

### Chat API Endpoints (Day 4)
- [ ] Build non-streaming chat endpoint
- [ ] Build streaming chat endpoint
- [ ] Test with real conversations
- [ ] Handle edge cases (empty messages, long messages)
- [ ] Add input validation

### Rate Limiting & Polish (Day 5)
- [ ] Implement rate limiting
- [ ] Add error handling throughout
- [ ] Test rate limit enforcement
- [ ] Performance testing (response times)
- [ ] Document API endpoints

---

## Success Criteria

- [ ] Vera responds in character (supportive, warm, direct)
- [ ] Conversation context maintained across messages
- [ ] Responses stream to client smoothly
- [ ] Rate limiting prevents abuse (10 req/min/user)
- [ ] API response time < 500ms to first token (streaming)
- [ ] User context correctly injected into prompts
- [ ] Messages saved to database correctly

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM Provider | Anthropic Claude | Better persona consistency, safety, streaming |
| Model | Claude 3 Sonnet | Good balance of quality/cost/speed |
| Context window | 20 messages | Balance memory vs. API cost |
| Rate limit | 10 req/min/user | Prevent abuse while allowing conversation |
| Streaming | Server-Sent Events | Simple, well-supported, good for chat |

---

## Cost Considerations

**Claude 3 Sonnet Pricing (as of 2024):**
- Input: $3 per million tokens
- Output: $15 per million tokens

**Estimated per-conversation cost:**
- Average conversation: 10 exchanges
- ~500 tokens input per message (with context)
- ~200 tokens output per response
- Total: ~7,000 tokens = ~$0.05 per conversation

**Monthly budget planning:**
- 1,000 users × 30 conversations/month = $1,500/month
- Budget alert at $500/month during early phase

---

## Testing Scenarios

Test Vera with these scenarios:

1. **First-time user greeting**
2. **User experiencing craving** - urgent support needed
3. **User reports smoking** - no judgment, forward-focused
4. **User hits milestone** - celebration
5. **User asks about science** - explain clearly
6. **User spiralling/anxious** - calm, grounding
7. **User asks if Vera is real** - honest about being AI
8. **Long conversation** - context maintained

---

## Notes

- Start with Sonnet, upgrade to Opus if quality insufficient
- Monitor token usage closely in early testing
- Vera's personality will be refined based on user feedback post-launch
- Consider caching common responses (but be careful with personalization)
- Log conversations (with user consent) for quality improvement

---

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Anthropic Streaming](https://docs.anthropic.com/en/api/streaming)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/prompt-engineering)

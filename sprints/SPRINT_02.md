# Sprint 2: Landing Page Content

**Theme**: Tell the story beautifully
**Duration**: 1 week

---

## Objective

Build out the full content sections that communicate IFQ's value proposition with the same premium craft established in Sprint 1. The page should take visitors from "what is this?" to "I need this" through a compelling, visually stunning narrative arc: Problem → Solution → Meet Vera → How It Works. Every section should feel like it was designed with obsessive attention to detail — the scroll experience as a whole should feel choreographed, not assembled.

---

## Prerequisites

- Sprint 1 complete (Hero section with email capture working)
- Landing page running locally
- Supabase email capture functional

---

## Deliverables

### 1. Problem Section

**Purpose**: Create emotional resonance. Show users we understand their struggle before pitching our solution.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│   THE NUMBERS DON'T LIE                     │  ← Section header
│                                             │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│   │   70%   │  │  $2,292 │  │   480   │    │  ← Stat cards
│   │ want to │  │  wasted │  │ minutes │    │
│   │  quit   │  │  /year  │  │ lost/wk │    │
│   └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│   "You've tried willpower. You've tried     │  ← Emotional hook
│   patches. You've tried pretending you      │
│   only smoke when drinking. We get it."     │
│                                             │
└─────────────────────────────────────────────┘
```

**Copy:**

*Stats (use Space Mono):*
- 70% of smokers want to quit
- $2,292 average spent on cigarettes per year (AU)
- 480 minutes per week lost to smoking breaks

*Emotional hook:*
> You've tried willpower. You've tried patches. You've tried pretending you "only smoke when drinking." We get it. Quitting isn't about wanting it badly enough—it's about having the right tools.

**Component: `ProblemSection.tsx`**
- Animated stat counters (count up on scroll into view) — use eased counting, not linear, and land with emphasis
- Background differentiation from hero: use depth, texture, or atmospheric shifts to create visual rhythm between sections
- Stats in card layout with considered spacing, subtle depth (shadow/border/glow), and hover interactions
- Cards should feel tactile — not flat rectangles with text. Consider elevation, micro-animations on hover, or accent lighting effects
- The transition from hero into this section should feel seamless and intentional — the scroll itself is part of the design

### 2. Solution Section

**Purpose**: Introduce IFQ as the answer. Position against the competition.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│   SO WE BUILT SOMETHING DIFFERENT           │  ← Section header
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ [Icon] Science, not shame           │   │  ← Feature cards
│   │ Evidence-based tools that actually  │   │
│   │ work, delivered without lectures.   │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ [Icon] 24/7 support                 │   │
│   │ Cravings don't wait for office      │   │
│   │ hours. Neither does Vera.           │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ [Icon] Your journey, tracked        │   │
│   │ Watch your health improve, your     │   │
│   │ wallet grow, and your wins stack.   │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Features to highlight:**
1. **Science, not shame** - Evidence-based tools that actually work, delivered without the wellness industry cringe
2. **24/7 support** - Cravings don't wait for office hours. Neither does Vera.
3. **Your journey, tracked** - Watch your health improve, your wallet grow, and your wins stack up
4. **No bullshit** - We won't patronise you. We'll meet you where you are.

**Component: `SolutionSection.tsx`**
- Feature cards with custom icons (not generic icon-library defaults — if using Lucide, select carefully and consider custom modifications)
- Staggered reveal animation on scroll with intentional choreography — each card should arrive with spring physics, not a linear fade
- Electric Coral accents on hover/focus with smooth, non-default transitions
- Cards should have depth and presence — consider subtle glow effects, border treatments, or background texture
- Hover states that reward exploration: slight lift, accent shift, or content micro-animation

### 3. Meet Vera Section

**Purpose**: Introduce the AI coach. Make her feel real and trustworthy.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            MEET VERA                        │  ← Section header
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │
│   │     [Vera Avatar/Illustration]      │   │  ← Vera visual
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Your AI quit coach who actually gets it.  │
│                                             │
│   Vera knows the science. She remembers     │
│   your triggers. She's there at 2am when    │
│   cravings hit. And she'll never judge      │
│   you—not even a little.                    │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ "Okay, craving hitting hard. Let's  │   │  ← Sample chat bubble
│   │ get you through the next 3 minutes. │   │
│   │ What triggered this one?"           │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Copy:**

*Intro:*
> Your AI quit coach who actually gets it.

*Description:*
> Vera knows the science of addiction inside and out. She remembers your triggers, celebrates your wins, and shows up at 2am when cravings hit hardest. She'll hold your hand AND call you on your excuses—because she actually wants you to succeed.

*Sample Vera quotes (pick 2-3 to display):*
- "Cravings peak at 3-5 minutes. That's it. You've sat through longer ad breaks."
- "You smoked. Okay. You're still here. That matters more than you know."
- "Your brain is literally rewiring itself right now. Keep going."

**Component: `MeetVeraSection.tsx`**
- Vera visual representation: this is the emotional heart of the page. Invest in getting this right. Whether abstract, illustrated, or photographic — it needs to feel warm, real, and premium. Not a generic avatar or stock illustration.
- Chat bubble samples showing personality — these should animate in like a real conversation (sequential reveal with typing indicator, natural timing). The interaction should create an "aha" moment where visitors feel what it's like to talk to Vera.
- Warm, personal tone contrasting the bold brand voice
- Consider a subtle ambient animation on the Vera visual (gentle breathing motion, soft glow, or particle effect) to make her feel alive, not static
- This section should have a noticeably different energy from the rest of the page — warmer, more intimate, more personal

### 4. How It Works Section

**Purpose**: Demystify the product. Show the simple path from signup to success.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│          HOW IT WORKS                       │  ← Section header
│                                             │
│   ┌─────┐                                   │
│   │  1  │  TELL US YOUR STORY              │
│   └─────┘  Quick onboarding captures your   │  ← Step 1
│            smoking history, triggers, and   │
│            what you've tried before.        │
│                                             │
│            ↓                                │
│                                             │
│   ┌─────┐                                   │
│   │  2  │  MEET YOUR COACH                 │
│   └─────┘  Vera learns your patterns and    │  ← Step 2
│            creates a personalized plan.     │
│            She's available 24/7.            │
│                                             │
│            ↓                                │
│                                             │
│   ┌─────┐                                   │
│   │  3  │  QUIT FOR GOOD                   │
│   └─────┘  Track your progress, handle      │  ← Step 3
│            cravings in real-time, and       │
│            celebrate every win.             │
│                                             │
└─────────────────────────────────────────────┘
```

**Steps:**

1. **Tell Us Your Story**
   > Quick onboarding captures your smoking history, triggers, and what you've tried before. No judgment—just context Vera needs to help.

2. **Meet Your Coach**
   > Vera learns your patterns and creates a personalised quit plan. She's available 24/7—cravings don't wait for office hours.

3. **Quit For Good**
   > Track your progress, handle cravings in real-time, and celebrate every win. Watch your health improve and your wallet grow.

**Component: `HowItWorksSection.tsx`**
- Vertical timeline on mobile, horizontal on desktop — the layout shift between breakpoints should feel intentionally designed at both sizes, not reflowed
- Step numbers in Victory Gold with visual weight and presence
- Connecting lines between steps that animate progressively on scroll (draw-on effect)
- Micro-illustrations or icons for each step — not optional, these add the visual storytelling that separates premium from generic
- Each step should reveal with scroll-triggered choreography, building anticipation as the user progresses

### 5. Interaction Design & Motion

**Animation Library**: Framer Motion (using shared spring/easing presets from Sprint 1)

**The scroll experience should feel choreographed as a whole — not just individual sections animating in isolation.** Consider the rhythm: fast/slow, bold/subtle, energetic/calm. The page has a narrative arc and the motion should reinforce it.

**Animations to implement:**

| Element | Animation | Trigger | Craft Notes |
|---------|-----------|---------|-------------|
| Stats | Eased count-up with emphasis on landing | Scroll into view | Numbers should decelerate as they approach final value |
| Feature cards | Staggered spring reveal (y + opacity) | Scroll into view | Custom spring config, not linear. ~80ms stagger between cards |
| Vera chat bubbles | Sequential typing indicator → message reveal | Scroll into view | Simulate real conversation timing. This is the "wow" moment. |
| Step timeline | Progressive draw-on of connecting line + step reveals | Scroll into view | Line draws as user scrolls, steps appear as line reaches them |
| Section headers | Subtle slide up with fade | Scroll into view | Fast, confident — headers shouldn't feel slow |
| Background elements | Subtle parallax or atmospheric shift | Scroll position | Adds depth to the page without being distracting |

**Performance requirements:**
- All animations must run at 60fps — test on real mid-range devices, not just dev machines
- Use `will-change` sparingly and remove after animation completes
- Prefer `transform` and `opacity` for GPU-composited animations
- Respect `prefers-reduced-motion` globally
- No animation on initial page load above the fold (hero entrance handled in Sprint 1)
- Total JS bundle < 100kb gzipped

**Component: `AnimatedSection.tsx`** (extends Sprint 1 foundation)
- Reusable wrapper for scroll-triggered animations
- Uses Intersection Observer with configurable thresholds
- Handles reduced motion preferences
- Supports multiple animation variants (fade-up, stagger-children, draw-on, etc.)

---

## Tasks

### Problem Section (Day 1)
- [ ] Create `ProblemSection.tsx` component
- [ ] Design stat cards with depth, texture, and hover interactions — not flat rectangles
- [ ] Implement eased animated counters with emphasis on landing values
- [ ] Write and refine copy
- [ ] Implement scroll-triggered reveal with spring physics
- [ ] Design section transition from hero — the scroll rhythm matters

### Solution Section (Day 2)
- [ ] Create `SolutionSection.tsx` component
- [ ] Design feature cards with carefully selected icons, depth, and presence
- [ ] Implement staggered spring reveal animation with custom timing
- [ ] Write feature copy (direct, benefit-focused)
- [ ] Design and implement hover states that reward exploration (lift, glow, accent shift)

### Meet Vera Section (Day 3)
- [ ] Create `MeetVeraSection.tsx` component
- [ ] Design Vera visual — invest in this. It's the emotional core. Must feel warm and real, not generic.
- [ ] Build chat bubble components with conversation-style sequential animation (typing indicator → message)
- [ ] Write Vera sample dialogue
- [ ] Add ambient animation to Vera visual (gentle motion, glow, or atmospheric effect)
- [ ] Test that the "talking to Vera" interaction creates a genuine preview of the app experience

### How It Works Section (Day 4)
- [ ] Create `HowItWorksSection.tsx` component
- [ ] Build timeline layout that feels intentionally designed at both mobile (vertical) and desktop (horizontal)
- [ ] Design step indicators with visual weight in Victory Gold
- [ ] Create micro-illustrations or icons for each step
- [ ] Implement progressive draw-on animation for connecting line
- [ ] Write step copy

### Polish & Integration (Day 5)
- [ ] Integrate all sections into main page
- [ ] **Scroll experience review**: scroll through the entire page and evaluate the rhythm, pacing, and narrative flow. Does it feel choreographed or assembled? Fix it.
- [ ] Test section transitions — each shift in content/tone should have a corresponding visual shift
- [ ] Cross-device testing (mobile, tablet, desktop) — every breakpoint should feel intentionally designed
- [ ] Performance audit (Lighthouse target: 90+)
- [ ] Accessibility check (keyboard nav, screen reader, reduced motion)
- [ ] **Design review gate**: does every section pass the "screenshot test"? Would a designer share this?

---

## Success Criteria

### Functional
- [ ] All content sections complete and on-brand
- [ ] Copy matches IFQ voice (direct, warm, irreverent)
- [ ] Works across devices (mobile, tablet, desktop)
- [ ] `prefers-reduced-motion` is respected globally
- [ ] Lighthouse performance score > 90
- [ ] No layout shift on animation triggers

### Design Excellence
- [ ] The full-page scroll experience feels choreographed — there's a rhythm to the reveals, transitions, and pacing
- [ ] Each section has visual depth and texture — nothing feels flat or default
- [ ] Hover states and interactive elements reward exploration
- [ ] The Meet Vera section creates a genuine emotional moment — visitors feel what talking to Vera is like
- [ ] Stat counters land with emphasis, not a linear tick
- [ ] Section transitions feel intentional — background shifts, spacing changes, and motion all reinforce the narrative arc
- [ ] Every breakpoint (mobile, tablet, desktop) looks intentionally designed, not reflowed
- [ ] The page passes the "screenshot test" — a designer would want to share individual sections

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Animation library | Framer Motion | Best React animation DX, good performance, spring physics support |
| Scroll detection | Intersection Observer (native) | No extra dependency, widely supported |
| Icon set | Lucide React (with selective curation) | Clean aesthetic, tree-shakeable — but icons should be hand-picked, not used generically |
| Vera visual | High-quality representation (abstract, illustrated, or photographic) | This is the emotional core — invest in quality over speed. Must feel warm and real. |

---

## Copy Guidelines

- **Stats**: Use real, verifiable numbers with sources (can add citations in footer)
- **Problem section**: Empathetic, "we get it" energy
- **Solution section**: Confident, benefit-focused
- **Vera section**: Warm, personal, shows her personality
- **How It Works**: Simple, clear, no jargon
- **Swearing**: Use sparingly in content sections (save for high-impact moments)

---

## Notes

- Vera's visual representation is the emotional heart of the page — don't settle for "good enough". If the first approach doesn't feel right, iterate on it.
- If animations feel slow or distracting, refine the timing and easing — don't just remove them. Motion is core to the premium feel.
- Copy should be tight — if you can cut a word, cut it
- This sprint sets up the narrative; Sprint 3 closes the sale with pricing and FAQ
- **The full-page scroll experience should be evaluated as a single, cohesive journey.** Individual sections looking good isn't enough — the flow between them matters.

---

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Prefers Reduced Motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

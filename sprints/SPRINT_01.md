# Sprint 1: Landing Page Foundation

**Theme**: Set the standard
**Duration**: 1 week

---

## Objective

Build a landing page foundation that immediately signals premium craft and IFQ's rebellious energy. This is the first time the brand meets the real world — it must feel hand-crafted, intentional, and award-worthy from the very first interaction. The hero section alone should be good enough to screenshot and share.

---

## Design Inspiration

### Primary References

| Site | Why It's Relevant | What to Borrow |
|------|-------------------|----------------|
| [Linear](https://linear.app/) | Dark theme, clean typography hierarchy, confident copy | Hero structure, CTA prominence, scroll animations |
| [Resend](https://resend.com/home) | Bold dark design with warm accent colors | Color contrast, email-focused CTA |
| [Oxide](https://oxide.computer/) | Bold typography, rebellious tech energy | Headline treatment, confident tone |

### Dribbble/Inspiration Collections
- [Dark SaaS Landing Pages](https://dribbble.com/tags/dark-saas-landing-page)
- [One Page Love Dark Collection](https://onepagelove.com/dark-schemed-landing-pages)
- [SaaS Landing Page - Dark Tag](https://saaslandingpage.com/tag/dark/)

### Anti-Inspiration (What to Avoid)
- Calm, Headspace - too soft, too pastel
- Generic quit smoking apps - clinical, boring, preachy
- Corporate wellness - stock photos, blues/greens, empty promises

---

## Brand Tokens (from BRAND.md)

### Colors (Tailwind Config)

```javascript
colors: {
  'rebel-black': '#0D0D0D',
  'electric-coral': '#FF6B5B',
  'signal-white': '#FAFAFA',
  'victory-gold': '#FFD93D',
  'steady-slate': '#2D3436',
  'soft-ember': '#FF8B7A',
}
```

### Typography

```javascript
fontFamily: {
  'display': ['Space Grotesk', 'sans-serif'],  // Headlines
  'body': ['Inter', 'sans-serif'],              // Body copy
  'mono': ['Space Mono', 'monospace'],          // Stats/data
}
```

### Design Principles
- **Dark-first**: Rebel Black backgrounds, not white
- **High contrast**: Electric Coral CTAs pop against black
- **Bold headlines**: Short, punchy, can use ALL CAPS for impact
- **No pastels**: We're not a meditation app
- **Mobile-first**: Design for phone, scale up

---

## Deliverables

### 1. Project Setup

**Next.js + TypeScript**
```bash
npx create-next-app@latest ifq-landing --typescript --tailwind --eslint --app --src-dir
```

**Required packages:**
- `@supabase/supabase-js` - Email list storage
- `framer-motion` - Animations (required from day one — motion is core to the experience, not polish)
- Google Fonts: Space Grotesk, Inter, Space Mono

**File structure:**
```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Landing page
│   └── globals.css      # Tailwind + custom styles
├── components/
│   ├── Hero.tsx         # Hero section
│   ├── EmailCapture.tsx # Email form component
│   └── ui/              # Reusable UI components
├── lib/
│   └── supabase.ts      # Supabase client
└── styles/
    └── fonts.ts         # Font configuration
```

### 2. Tailwind Configuration

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rebel-black': '#0D0D0D',
        'electric-coral': '#FF6B5B',
        'signal-white': '#FAFAFA',
        'victory-gold': '#FFD93D',
        'steady-slate': '#2D3436',
        'soft-ember': '#FF8B7A',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

### 3. Hero Section

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│         I FUCKING QUIT                      │  ← Logo/wordmark
│                                             │
│     QUIT LIKE YOU MEAN IT.                  │  ← Headline (Space Grotesk Bold)
│                                             │
│   The anti-bullshit quit smoking app.       │  ← Subhead (Inter)
│   No lectures. No judgment. Just science    │
│   and a coach who actually gets it.         │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ Enter your email                    │   │  ← Email input
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │     GET EARLY ACCESS                │   │  ← CTA (Electric Coral)
│   └─────────────────────────────────────┘   │
│                                             │
│   Join 1,247 others ready to quit for good  │  ← Social proof (update dynamically)
│                                             │
└─────────────────────────────────────────────┘
```

**Copy Options:**

*Headline variants:*
- "QUIT LIKE YOU MEAN IT."
- "YOUR ADDICTION MET ITS MATCH."
- "FINALLY, AN APP THAT GETS IT."

*Subhead variants:*
- "The anti-bullshit quit smoking app. No lectures. No judgment. Just science and a coach who actually gets it."
- "Evidence-based quitting tools delivered without the corporate wellness cringe."
- "Meet Vera—the AI coach who'll hold your hand AND call you on your excuses."

**Component: `Hero.tsx`**
- Full viewport height on mobile
- Centered content with generous, considered breathing room — spacing should feel designed, not default
- Email form inline or below headline
- Background treatment with depth and texture (subtle gradient, grain, or atmospheric effect — not flat black)
- Entrance animation sequence: elements should arrive with intentional choreography (staggered reveals with custom spring easing, not generic fade-ins)
- The headline should feel like it lands with weight — consider scale, timing, and optical spacing
- Email input and CTA should feel premium: smooth focus states, satisfying submit interaction, considered loading/success states
- Cursor interactions on desktop: subtle hover responses that reward exploration

### 4. Email Capture Component

**Behavior:**
- Single email input + submit button
- Inline validation (valid email format) with smooth, non-jarring error presentation
- Loading state on submit — crafted animation, not a default spinner
- Success state: "You're in. We'll be in touch." — with a satisfying celebratory micro-animation (subtle particle burst, checkmark draw-on, or similar)
- Error state: "Something went wrong. Try again?" — gentle, not alarming
- Stores to Supabase `waitlist` table
- Focus state on input should feel premium: smooth border/glow transition with brand color
- Button hover and active states with tactile feedback (scale, color shift, or both)

**Component: `EmailCapture.tsx`**
```typescript
interface EmailCaptureProps {
  onSuccess?: () => void
  className?: string
}

// States: idle | loading | success | error
```

### 5. Supabase Integration

**Table schema: `waitlist`**
```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source text default 'landing_page',
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table waitlist enable row level security;

-- Allow anonymous inserts (for landing page)
create policy "Allow anonymous insert" on waitlist
  for insert with check (true);

-- Only authenticated users can read
create policy "Authenticated users can read" on waitlist
  for select using (auth.role() = 'authenticated');
```

**Environment variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 6. Mobile-Responsive Foundation

**Breakpoints:**
- Mobile: 0-640px (default, design here first)
- Tablet: 640px-1024px
- Desktop: 1024px+

**Mobile requirements:**
- Touch-friendly inputs (min 44px tap targets)
- No horizontal scroll
- Readable text without zooming (16px+ body)
- Fast load (< 3s on 3G)

---

## Tasks

### Setup (Day 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind with brand tokens
- [ ] Set up Google Fonts (Space Grotesk, Inter, Space Mono)
- [ ] Create Supabase project and `waitlist` table
- [ ] Set up environment variables
- [ ] Create basic folder structure

### Hero Section (Day 2-3)
- [ ] Build `Hero.tsx` component with layout structure
- [ ] Implement responsive typography scale with optical spacing adjustments per breakpoint
- [ ] Add background treatment with depth (gradient, grain texture, or atmospheric effect)
- [ ] Style headline and subhead with brand fonts — tune letter-spacing and line-height for visual impact
- [ ] Ensure full mobile viewport coverage
- [ ] Design and implement hero entrance animation sequence (Framer Motion): staggered element reveals with custom spring easing
- [ ] Define custom easing curves / spring configs for the project (shared constants, not inline values)
- [ ] Add subtle scroll indicator or visual cue below the fold

### Email Capture (Day 3-4)
- [ ] Build `EmailCapture.tsx` component
- [ ] Implement form validation with smooth, non-jarring error transitions
- [ ] Connect to Supabase for storage
- [ ] Design and implement all interaction states: idle, focused, loading, success, error — each should feel crafted
- [ ] Success state micro-animation (checkmark draw-on, subtle celebration, etc.)
- [ ] Style input and button with brand colors, premium focus/hover/active states
- [ ] Button press feedback (scale + color shift)

### Interaction & Motion Foundation (Day 4)
- [ ] Create shared animation config: custom spring presets, easing curves, duration tokens
- [ ] Create reusable `AnimatedEntry` wrapper component for scroll-triggered reveals (Framer Motion + Intersection Observer)
- [ ] Respect `prefers-reduced-motion` globally
- [ ] Test all animations at 60fps — no jank, no frame drops

### Polish & Testing (Day 5)
- [ ] Design review: does this feel hand-crafted and premium? Be honest. If it feels template-y, fix it.
- [ ] Cross-browser testing (Safari, Chrome, Firefox)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Lighthouse audit (target: 90+ mobile)
- [ ] Fix any responsive issues
- [ ] Verify animations feel smooth and intentional on real devices
- [ ] Document design decisions and animation specs for consistency in Sprint 2

---

## Success Criteria

### Functional
- [ ] Landing page runs locally with hot reload
- [ ] Email capture form saves to Supabase (verify in dashboard)
- [ ] Brand colors and fonts match BRAND.md spec
- [ ] Page works on mobile (test on real device)
- [ ] No TypeScript errors
- [ ] Clean git history with meaningful commits

### Design Excellence
- [ ] Hero entrance animation is choreographed, not generic — elements arrive with intentional timing
- [ ] Email capture states (focus, loading, success, error) all feel crafted and premium
- [ ] Typography spacing feels optically tuned, not just default
- [ ] Background treatment adds depth — the page has atmosphere, not just flat color
- [ ] Lighthouse mobile score > 90
- [ ] All animations run at 60fps on mid-range devices
- [ ] `prefers-reduced-motion` is respected
- [ ] The page passes the "screenshot test" — a designer would want to share this

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ App Router | Modern React, good DX, Vercel deploy ready |
| Styling | Tailwind CSS | Fast iteration, responsive utilities, matches brand token system |
| Database | Supabase | Free tier sufficient, easy auth later, Postgres underneath |
| Animations | Framer Motion from Sprint 1 | Motion is core to the premium feel, not optional polish — interaction quality must be established from the start |
| Analytics | Defer to Sprint 3 | Need page live first |

---

## Notes

- This sprint sets the design standard for the entire project — the hero section is the first impression, and it must be exceptional
- Sprint 2 will add content sections, each held to the same craft standard
- Sprint 3 will add remaining sections and deploy to production
- If blocked on a design decision, spend the time to get it right — this is the foundation everything else builds on. A premium product cannot be built on a generic foundation
- The animation and motion system established here will be reused across all subsequent sections — invest in getting it right

---

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Space Grotesk on Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- [Inter on Google Fonts](https://fonts.google.com/specimen/Inter)
- [Space Mono on Google Fonts](https://fonts.google.com/specimen/Space+Mono)

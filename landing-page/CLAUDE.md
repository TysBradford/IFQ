# Landing Page UI Guidelines

This is a Next.js project with Tailwind CSS. Refer to the root `CLAUDE.md` for full brand guidelines.

## Tailwind Color Configuration

Use these exact values in `tailwind.config.ts`:

```ts
colors: {
  'rebel-black': '#0D0D0D',
  'electric-coral': '#FF6B5B',
  'signal-white': '#FAFAFA',
  'victory-gold': '#FFD93D',
  'steady-slate': '#2D3436',
  'soft-ember': '#FF8B7A',
}
```

## Font Setup

Import from Google Fonts:
- **Space Grotesk** (500, 700) - Headlines, buttons, UI
- **Inter** (400, 500) - Body text
- **Space Mono** (400) - Stats, numbers, countdowns

Example Next.js font setup:
```ts
import { Space_Grotesk, Inter, Space_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk'
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter'
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-space-mono'
})
```

## Component Patterns

### Buttons (CTAs)
- Background: `bg-electric-coral`
- Text: `text-rebel-black` or `text-signal-white`
- Font: Space Grotesk Medium
- Hover: Slight scale or brightness shift (no soft transitions)
- Strong contrast always

### Headlines
- Font: Space Grotesk Bold
- Major statements: ALL CAPS
- Subheads: Sentence case
- Keep short and punchy

### Body Text
- Font: Inter Regular/Medium
- Warm and human tone
- Good line height for readability

### Stats & Numbers
- Font: Space Mono
- Give visual prominence
- Use Victory Gold for achievements

### Backgrounds
- Primary sections: `bg-rebel-black`
- Secondary sections: `bg-steady-slate`
- Text on dark: `text-signal-white`

## Design Excellence

The landing page must be award-calibre work. Every section, every scroll interaction, every hover state should feel hand-crafted by the best in the industry. This is not a template with brand colours applied — it is a premium, bespoke experience.

**Standards:**
- Interactions feel buttery smooth and intentional
- Typography, spacing, and layout are pixel-perfect
- Animations and transitions are crafted, not default — use Framer Motion or similar for scroll-triggered reveals, parallax, and micro-interactions
- Every section tells a story and guides the user with clarity
- The page should feel like a luxury product, not a health utility
- Details that most landing pages skip — we obsess over
- Nothing ships that feels "good enough" — it ships when it's exceptional

**What this looks like on the web:**
- Custom easing curves on all transitions (no linear or default ease)
- Scroll-driven animations that feel natural, not gimmicky
- Hover states that reward exploration
- Loading states and skeleton screens that maintain the brand feel
- Responsive design that feels intentionally designed at every breakpoint, not just reflowed
- Performance matters — 60fps animations, optimised assets, fast paint

**The bar:** Apple Design Award calibre. The kind of page designers screenshot and share. Users notice the craft, even if they can't articulate why it feels so good.

## Visual Style

- **High contrast** - no soft, muted aesthetics
- **Bold** - not afraid of strong visual weight
- **Anti-corporate wellness** - avoid pastel colors, clinical whites, stock imagery
- Dark mode by default (rebel-black backgrounds)

## What to Avoid

- Clinical blues, passive greens
- Soft pastel color schemes
- Stock photography aesthetic
- Broken cigarette imagery
- Health scare visuals
- Generic wellness app patterns
- Excessive rounded corners (some rounding OK)
- Gradients on logo or brand elements

## Spacing & Layout

- Generous whitespace for breathing room
- Strong visual hierarchy
- Mobile-first design
- Bold section breaks

# Landing Page UI Guidelines

This is a Next.js project with Tailwind CSS. Refer to the root `CLAUDE.md` for full brand guidelines.

## Tailwind Color Configuration

Use these exact values in `tailwind.config.ts`:

```ts
colors: {
  paper: '#FAFAF8',
  'paper-alt': '#F0F0EC',
  ink: '#0A0A0A',
  emerald: {
    DEFAULT: '#00A878',
    soft: '#2DB88E',
  },
  amber: '#F5A623',
  mint: '#7DDBA3',
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
- Background: `bg-emerald`
- Text: `text-white` or `text-ink`
- Font: Space Grotesk Medium
- Hover: `hover:bg-ink` with transition
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
- Use Amber for achievements

### Backgrounds
- Primary sections: `bg-paper`
- Secondary sections: `bg-paper-alt`
- Accent sections: `bg-emerald` or `bg-ink`
- Text on dark: `text-paper` or `text-white`

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

- **High contrast** - bold visual weight with clean editorial feel
- **Bold** - not afraid of strong typographic and color presence
- **Anti-corporate wellness** - avoid pastel pinks, clinical whites, stock imagery
- Paper-first with Ink borders and Emerald accents

## What to Avoid

- Clinical blues, passive pinks
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

## Architecture Notes

### Project Structure
```
src/
  app/
    layout.tsx        # Root layout with font setup (server component)
    page.tsx          # Landing page (server component, imports client components)
    globals.css       # CSS variables, custom classes, responsive rules
  components/
    AnimatedSection.tsx  # Reusable scroll-triggered reveal wrapper (client component)
    WaitlistForm.tsx     # Email capture with Supabase + validation + states (client component)
  lib/
    animations.ts     # Shared Framer Motion spring presets and variant sets
    supabase.ts       # Lazy-initialized Supabase client
```

### Key Patterns
- **Server/client split**: `page.tsx` stays a server component for SEO. Interactive pieces (`AnimatedSection`, `WaitlistForm`) are extracted as `"use client"` components.
- **Supabase client**: Uses lazy initialization (`getSupabase()`) to avoid crashing at build time when env vars aren't available during static generation.
- **Animation system**: Shared presets in `lib/animations.ts` — use `fadeUp`, `slideLeft`, `slideRight`, `scaleUp`, `staggerContainer` variants with the `AnimatedSection` wrapper for consistent scroll-triggered reveals.
- **Waitlist form**: Handles idle/loading/success/error states with Framer Motion transitions. Duplicate emails (Supabase unique constraint `23505`) are treated as success.

### Supabase
- Project ref: `pcpcczibezohuhlullab`
- Linked via Supabase CLI in `landing-page/`
- Waitlist table: `id` (uuid), `email` (text, unique), `created_at` (timestamptz)
- RLS enabled with anonymous insert policy
- Env vars in `.env.local` (gitignored)

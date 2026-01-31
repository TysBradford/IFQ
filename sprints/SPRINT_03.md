# Sprint 3: Landing Page Launch

**Theme**: Go live — flawlessly
**Duration**: 1 week

---

## Objective

Complete the landing page with pricing, FAQ, social proof, and a final CTA — then deploy to production. Every remaining section must meet the same design excellence standard set in Sprints 1 and 2. The final page, viewed end-to-end, should feel like a cohesive, award-calibre experience. By the end of this sprint, the landing page should be live, capturing emails, and good enough that people share it for the craft alone.

---

## Prerequisites

- Sprint 1 & 2 complete (all content sections built)
- Landing page fully functional locally
- Email capture working with Supabase

---

## Deliverables

### 1. Pricing Preview Section

**Purpose**: Set expectations and qualify leads. People who sign up knowing the price are higher-intent.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│          PRICING THAT MAKES SENSE           │  ← Section header
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │         QUIT PLAN                   │   │
│   │         $9.99/month                 │   │
│   │                                     │   │
│   │   ✓ Unlimited Vera conversations   │   │
│   │   ✓ Personalised quit plan         │   │
│   │   ✓ Progress tracking & milestones │   │
│   │   ✓ 24/7 craving support           │   │
│   │   ✓ Health timeline                │   │
│   │                                     │   │
│   │   Less than one pack of cigarettes │   │  ← Value anchor
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   7-day free trial. Cancel anytime.         │  ← Risk reversal
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │       GET EARLY ACCESS              │   │  ← CTA
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Pricing Strategy:**
- Single tier for MVP (avoid decision paralysis)
- Price anchored against cigarette cost
- Free trial to reduce friction
- Monthly only initially (annual comes post-launch)

**Copy:**

*Header:* "PRICING THAT MAKES SENSE"

*Subhead:* "Less than one pack of cigarettes per month."

*Plan name:* "Quit Plan" (simple, action-oriented)

*Price:* $9.99/month (validate against AU market)

*Features list:*
- Unlimited Vera conversations
- Personalised quit plan
- Progress tracking & milestones
- 24/7 craving support
- Health timeline
- Money saved calculator

*Risk reversal:* "7-day free trial. Cancel anytime. No questions asked."

**Component: `PricingSection.tsx`**
- Single card design (can add tiers later) — but the card itself should be a design moment. Not a generic pricing box. Consider: subtle glow, depth, border treatment, or atmospheric background effect that makes it feel premium.
- Victory Gold accent for price — the price should have visual weight and presence, rendered in Space Mono with considered sizing
- Checkmarks in Electric Coral with subtle entrance animations on scroll
- CTA scrolls to hero email capture or has inline form
- The value anchor ("Less than one pack of cigarettes") should land with impact — consider typographic treatment or emphasis animation
- Hover state on the card itself: subtle lift, glow intensification, or border shift
- The section transition into pricing should feel deliberate — this is the "ask", and the design should support conversion

### 2. FAQ Section

**Purpose**: Address objections and reduce support burden.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│      QUESTIONS? WE'VE GOT ANSWERS.          │  ← Section header
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ ▸ Is Vera actually helpful?         │   │  ← Accordion item
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ ▸ What if I slip up?                │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ ▸ Does this work for vaping too?    │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ ▸ Is my data private?               │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │ ▸ Can I cancel anytime?             │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**FAQ Content:**

**Q: Is Vera actually helpful, or is this just another chatbot?**
> Vera is trained specifically on addiction science, behaviour change, and what actually helps people quit. She remembers your triggers, tracks your patterns, and gives you evidence-based strategies—not generic motivational quotes. She's also available 24/7, which matters when cravings hit at 2am.

**Q: What if I slip up and smoke?**
> Then you tell Vera, she doesn't judge you, and you keep going. Slipping doesn't delete your progress or mean you've failed. IFQ is built on the science of behaviour change, which means we know setbacks happen. What matters is getting back on track.

**Q: Does this work for vaping/nicotine pouches too?**
> Yes. IFQ is designed for any nicotine addiction—cigarettes, vapes, pouches, whatever. The mechanics of addiction are the same, and so are the strategies that work.

**Q: Is my data private?**
> Completely. Your conversations with Vera are encrypted and never shared with third parties. We don't sell your data. We don't show you ads. We make money when you subscribe, not when we exploit your information.

**Q: Can I cancel anytime?**
> Yep. No contracts, no cancellation fees, no guilt trips. If IFQ isn't working for you, cancel in the app and you won't be charged again.

**Q: What makes IFQ different from other quit smoking apps?**
> Most quit smoking apps are either (1) basic trackers that don't actually help, or (2) corporate wellness products that feel like getting a lecture from your doctor. IFQ is built by people who get it—combining real science with a coach who talks like a human and actually helps you through cravings in real-time.

**Component: `FAQSection.tsx`**
- Accordion pattern (one open at a time)
- Smooth height animation with spring physics — the expand/collapse should feel buttery, not snappy. Content should ease in, not just appear.
- Chevron/indicator rotation animation synced with content reveal
- Keyboard accessible (full arrow key navigation, Enter/Space to toggle)
- Schema markup for SEO (FAQPage)
- Consider subtle background or border treatment to differentiate open vs. closed items
- The accordion interaction should feel premium — this is a common pattern done poorly everywhere. Ours should feel noticeably better.

### 3. Social Proof Section

**Purpose**: Build trust through validation. Placeholder for now, real testimonials post-launch.

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│        JOIN THE MOVEMENT                    │  ← Section header
│                                             │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│   │  2,340  │  │   47    │  │ Coming  │    │  ← Waitlist stats
│   │ on the  │  │ average │  │  Soon   │    │
│   │waitlist │  │ days    │  │   iOS   │    │
│   │         │  │  quit   │  │         │    │
│   └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│   "Finally an app that doesn't talk to      │
│   me like I'm in trouble at the             │  ← Testimonial placeholder
│   principal's office."                      │
│   — Early Beta User                         │
│                                             │
└─────────────────────────────────────────────┘
```

**Approach:**
- Show waitlist count (real, from Supabase)
- Use placeholder testimonials from beta/friends until real ones come in
- Mark clearly if quotes are from beta users
- Add App Store badge placeholder ("Coming Soon to iOS")

**Component: `SocialProofSection.tsx`**
- Dynamic waitlist counter (fetched from Supabase) — the number should animate on load (count-up with eased deceleration)
- Testimonial display with considered typography and layout — even placeholder quotes should feel premium
- "Coming Soon" App Store badge — styled to match brand, not just a default Apple badge
- This section builds trust and momentum before the final CTA. The visual design should create a sense of community and energy — people are already here, you should be too.

### 4. SEO Optimization

**Meta Tags (in `layout.tsx` or `page.tsx`):**

```tsx
export const metadata: Metadata = {
  title: 'IFQ - Quit Smoking with AI Support | I Fucking Quit',
  description: 'The anti-bullshit quit smoking app. Meet Vera, your AI quit coach who\'s available 24/7, backed by science, and won\'t lecture you. Start your free trial.',
  keywords: ['quit smoking', 'stop smoking app', 'nicotine addiction', 'quit vaping', 'smoking cessation', 'AI health coach'],
  openGraph: {
    title: 'IFQ - Quit Like You Mean It',
    description: 'The anti-bullshit quit smoking app. AI-powered support that actually gets it.',
    url: 'https://ifq.app',
    siteName: 'IFQ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IFQ - Quit Like You Mean It',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IFQ - Quit Like You Mean It',
    description: 'The anti-bullshit quit smoking app.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

**Structured Data (JSON-LD):**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "IFQ - I Fucking Quit",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "iOS",
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "AUD"
  },
  "description": "AI-powered quit smoking app with 24/7 coaching support"
}
```

**Additional SEO Tasks:**
- [ ] Create `sitemap.xml` (auto-generated by Next.js)
- [ ] Create `robots.txt`
- [ ] Add canonical URLs
- [ ] Ensure all images have alt text
- [ ] Check heading hierarchy (single H1)
- [ ] Add FAQ schema markup

### 5. Deploy to Vercel

**Pre-deployment checklist:**
- [ ] All environment variables set in Vercel dashboard
- [ ] Production Supabase URL (not local)
- [ ] Build passes without errors
- [ ] No console warnings in production build

**Vercel Configuration:**

```json
// vercel.json (if needed)
{
  "framework": "nextjs",
  "regions": ["syd1"],  // Sydney for AU audience
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Domain Setup:**
- Connect custom domain (ifq.app or similar)
- Configure DNS records
- Enable HTTPS (automatic with Vercel)
- Set up www redirect

### 6. Analytics Setup

**Recommended: Plausible Analytics**
- Privacy-focused (no cookie banner needed)
- Simple, clean dashboard
- Affordable ($9/month or self-hosted)

**Alternative: PostHog**
- More features (funnels, session replay)
- Free tier available
- Self-hostable

**Events to Track:**

| Event | Description | Properties |
|-------|-------------|------------|
| `page_view` | Page views | `path`, `referrer` |
| `email_signup` | Waitlist signup | `source` |
| `cta_click` | CTA button clicks | `location`, `text` |
| `faq_expand` | FAQ item opened | `question` |
| `scroll_depth` | How far users scroll | `percentage` |

**Implementation:**

```tsx
// lib/analytics.ts
export const trackEvent = (name: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(name, { props })
  }
}
```

---

## Tasks

### Pricing Section (Day 1)
- [ ] Create `PricingSection.tsx` component
- [ ] Design pricing card with depth, glow, and premium presence — not a generic pricing box
- [ ] Price display in Space Mono with Victory Gold accent and visual weight
- [ ] Feature list with Electric Coral checkmarks and staggered entrance animation
- [ ] Value anchor ("Less than one pack") with typographic emphasis
- [ ] Add CTA that links to email capture
- [ ] Write pricing copy
- [ ] Test responsive layout — card should feel intentionally designed at every breakpoint

### FAQ Section (Day 2)
- [ ] Create `FAQSection.tsx` component
- [ ] Build accessible accordion with spring-physics expand/collapse animation
- [ ] Chevron rotation synced with content reveal
- [ ] Write all FAQ content
- [ ] Add FAQ schema markup (JSON-LD)
- [ ] Test keyboard navigation (arrow keys, Enter/Space)
- [ ] Visual differentiation for open vs. closed state

### Social Proof & Footer (Day 2-3)
- [ ] Create `SocialProofSection.tsx` component
- [ ] Build animated waitlist counter (Supabase query + count-up animation)
- [ ] Add placeholder testimonials with considered typography
- [ ] Create `Footer.tsx` — minimal, on-brand, not an afterthought
- [ ] Add App Store badge placeholder styled to match brand

### SEO (Day 3-4)
- [ ] Add all meta tags
- [ ] Create OpenGraph image (`/public/og-image.png`)
- [ ] Add structured data (JSON-LD)
- [ ] Generate `sitemap.xml` and `robots.txt`
- [ ] Test with social share preview tools

### Analytics Setup (Day 4)
- [ ] Set up Plausible (or chosen analytics)
- [ ] Add tracking script to layout
- [ ] Implement custom events
- [ ] Test event tracking locally

### Final Design Review (Day 5 — before deploy)
- [ ] **Full-page scroll review**: scroll through the entire page from top to bottom. Evaluate the experience as a single, cohesive journey. Does it feel choreographed? Is there rhythm to the pacing? Does the narrative arc (Problem → Solution → Vera → How It Works → Pricing → Social Proof → CTA) flow naturally?
- [ ] **Section transitions**: does each section feel like a deliberate shift, or do they just... stop and start?
- [ ] **Breakpoint review**: check mobile, tablet, and desktop. Every breakpoint should feel intentionally designed.
- [ ] **Interaction audit**: test every hover state, focus state, click state, and animation. Do they all feel premium?
- [ ] **Performance audit**: Lighthouse 90+. All animations at 60fps on real devices.
- [ ] **The screenshot test**: would a designer share screenshots of this page? If not, what needs to change?
- [ ] **Fix anything that doesn't meet the bar.** Nothing ships that feels "good enough."

### Deploy (Day 5)
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] Deploy to preview URL
- [ ] Test all functionality on preview
- [ ] Connect custom domain
- [ ] Deploy to production
- [ ] Verify analytics working
- [ ] Test email signup end-to-end
- [ ] Final production check: scroll through the live page on a real phone. Does it feel premium?

---

## Success Criteria

### Functional
- [ ] Live at production domain
- [ ] SEO meta tags rendering correctly (test with social share debuggers)
- [ ] Analytics tracking page views and email signups
- [ ] Page speed: < 3s load on 3G connection
- [ ] Social share preview looks correct (test Facebook, Twitter, LinkedIn)
- [ ] All links functional
- [ ] Email signup works on production
- [ ] No console errors in production

### Design Excellence
- [ ] The full page, scrolled top to bottom, feels like a single cohesive experience — not a collection of sections
- [ ] Pricing card feels premium, not generic — it has depth, presence, and visual weight
- [ ] FAQ accordion animation is noticeably smoother than typical implementations (spring physics, content easing)
- [ ] Every interactive element (buttons, links, accordion, email form) has crafted hover/focus/active states
- [ ] Lighthouse performance score > 90
- [ ] All animations run at 60fps on mid-range mobile devices
- [ ] The page passes the "screenshot test" — designers would share it
- [ ] The page passes the "share test" — the OpenGraph preview image and description make people want to click

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | Vercel | Best Next.js support, Sydney edge region, simple deploys |
| Analytics | Plausible | Privacy-focused, no cookie banner, simple |
| Region | Australia (syd1) | Primary target audience |
| Domain | ifq.app (or similar) | Short, memorable, available |

---

## Pre-Launch Checklist

### Content
- [ ] All copy proofread
- [ ] Contact email set up (support@ifq.app or similar)
- [ ] Privacy policy page created (or linked)
- [ ] Terms of service page created (or linked)

### Technical
- [ ] Favicon and app icons set
- [ ] 404 page styled
- [ ] Error boundaries in place
- [ ] Supabase RLS verified
- [ ] CORS configured correctly

### Performance
- [ ] Images optimized (WebP, proper sizing)
- [ ] Fonts subset if needed
- [ ] No render-blocking resources
- [ ] Lighthouse scores: 90+ across all metrics
- [ ] All animations at 60fps (tested on real mid-range device)

### Design Quality
- [ ] Full-page scroll experience feels cohesive and choreographed
- [ ] Every section has visual depth — nothing feels flat or default
- [ ] All interactive elements have crafted states (hover, focus, active, loading)
- [ ] Typography is optically tuned at every breakpoint
- [ ] Responsive design feels intentionally designed, not reflowed
- [ ] The page would be at home on Awwwards or SiteInspire

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in client-side code
- [ ] Environment variables not exposed

---

## Notes

- The landing page is the first public expression of the IFQ brand. It must be exceptional — don't ship anything that feels "good enough"
- That said, exceptional doesn't mean infinite scope. The sections are defined. The craft applied to those sections is what matters.
- Monitor email signups daily to validate interest
- Placeholder testimonials should be replaced ASAP post-launch
- Consider A/B testing headlines after getting baseline data
- Keep footer minimal (don't need every link at launch)
- **This page will be shared in design communities, sent to potential partners, and seen by future investors. It must represent the quality standard of the entire product.**

---

## Resources

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Plausible Analytics](https://plausible.io/docs)
- [Schema.org FAQ Page](https://schema.org/FAQPage)
- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

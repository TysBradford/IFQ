# Sprint 12: Public Launch

**Theme**: Ship it
**Duration**: 1 week

---

## Objective

Submit the app to the App Store, update the landing page to drive downloads, email the waitlist, launch social media content, and monitor the first days of real user activity.

---

## Prerequisites

- Sprint 11 complete (all assets prepared, TestFlight validated)
- App Store Connect account set up
- Landing page live and capturing emails
- Waitlist email service configured
- Social media accounts created

---

## Deliverables

### 1. App Store Submission

**Pre-Submission Checklist:**

```
App Store Connect Setup:
- [ ] App record created
- [ ] Bundle ID matches Xcode project
- [ ] SKU set (e.g., "ifq-ios-app")
- [ ] Primary language: English (Australia)
- [ ] Content rights: confirmed

App Information:
- [ ] Name: IFQ - Quit Smoking Coach
- [ ] Subtitle: AI Support to Quit for Good
- [ ] Category: Health & Fitness
- [ ] Secondary: Medical
- [ ] Content Rating: 17+ (language)
- [ ] Price: Free (with in-app subscription)

Version Information:
- [ ] Screenshots uploaded (all device sizes)
- [ ] App preview video uploaded
- [ ] Description entered
- [ ] Keywords entered
- [ ] What's New text
- [ ] Promotional text
- [ ] Support URL
- [ ] Marketing URL (landing page)

Privacy:
- [ ] Privacy policy URL entered
- [ ] App Privacy Nutrition Labels completed
  - [ ] Contact info: email
  - [ ] Health data: smoking habits
  - [ ] Usage data: app interactions
  - [ ] Identifiers: user ID
  - [ ] NOT linked to identity where possible

In-App Purchases:
- [ ] Subscription group created
- [ ] Monthly plan: $9.99 AUD
- [ ] 7-day free trial configured
- [ ] Subscription description written
- [ ] Review information provided

Review Notes:
- [ ] Test account credentials (if needed)
- [ ] Notes for reviewer:
      "IFQ is a quit smoking support app. The AI coach (Vera) is
      powered by a large language model and provides evidence-based
      quit smoking support. This is not a medical app and includes
      appropriate disclaimers. The app contains occasional strong
      language as part of its anti-corporate brand identity."
```

**Submission Process:**

```
1. Final Xcode archive → validate
2. Upload build to App Store Connect
3. Select build in version
4. Complete all metadata fields
5. Submit for review
6. Monitor review status
```

**Common Rejection Reasons to Prevent:**

| Issue | Prevention |
|-------|-----------|
| Crashes | TestFlight validated, zero crash rate |
| Broken links | All URLs tested |
| Placeholder content | All placeholder text removed |
| Missing privacy policy | Policy live and linked |
| Subscription issues | StoreKit tested end-to-end |
| Health claims | Disclaimers in place |
| Offensive content | Language is brand-appropriate, not gratuitous |

### 2. Landing Page Update

**Changes Required:**

```diff
 Hero Section:
- [Email capture form]
+ [App Store download badge]
+ [Email capture form (moved below)]

 New Section: Download
+ App Store badge (official Apple badge)
+ QR code linking to App Store listing
+ "Available now on iOS"

 Existing Section Updates:
- "Coming Soon" badges → "Download Now"
- Waitlist counter → "Join X users already quitting"
```

**App Store Badge Component:**

```tsx
// components/AppStoreBadge.tsx
export function AppStoreBadge({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <img
        src="/badges/app-store-badge.svg"
        alt="Download on the App Store"
        className="h-14"
      />
    </a>
  )
}
```

**Updated Hero:**

```tsx
// Updated Hero section
<section className="min-h-screen flex flex-col items-center justify-center bg-ink">
  <h1 className="font-display text-5xl md:text-7xl font-bold text-paper uppercase">
    Quit Like You Mean It.
  </h1>

  <p className="mt-6 font-body text-lg text-paper/80 max-w-md text-center">
    The anti-bullshit quit smoking app. Meet Vera—your AI coach
    who's available 24/7, backed by science, and won't lecture you.
  </p>

  {/* Primary CTA: Download */}
  <div className="mt-10">
    <AppStoreBadge url="https://apps.apple.com/app/ifq/id..." />
  </div>

  {/* Secondary CTA: Email for non-iOS or curious */}
  <div className="mt-8">
    <p className="text-paper/50 text-sm mb-2">
      Not on iOS? Get notified when we launch on Android.
    </p>
    <EmailCapture variant="inline" />
  </div>
</section>
```

### 3. Email Blast to Waiting List

**Email Service Setup:**
- Use Resend, Postmark, or similar transactional email service
- Connect to Supabase waitlist table
- Send in batches (avoid spam filters)

**Launch Email Template:**

```
Subject: IFQ is live. Let's do this.
From: Vera <vera@ifq.app>
---

Hey,

You signed up because you were ready to quit. The app is live.

IFQ is now on the App Store. Here's what's waiting for you:

→ Vera, your AI quit coach, available 24/7
→ Science-backed tools that actually work
→ Progress tracking that makes every day count
→ Zero judgment. Ever.

Your first 7 days are free. After that, it's $9.99/month—less
than a single pack of cigarettes.

[DOWNLOAD IFQ →]

You signed up for a reason. Today's as good a day as any.

— The IFQ team

---

P.S. If you've already quit by the time you're reading this:
congratulations. We're here if you need backup.

Unsubscribe: {unsubscribe_link}
```

**Email Campaign Strategy:**

| Email | Timing | Subject | Purpose |
|-------|--------|---------|---------|
| Launch | Day 0 | "IFQ is live. Let's do this." | Download announcement |
| Reminder | Day 3 | "Still thinking about quitting?" | Nudge non-converters |
| Social proof | Day 7 | "X people started their quit this week" | FOMO + validation |

**Sending Script:**

```typescript
// scripts/send-launch-email.ts
import { supabase } from '../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const BATCH_SIZE = 50
const BATCH_DELAY_MS = 1000 // 1 second between batches

async function sendLaunchEmails() {
  // Get all waitlist emails
  const { data: subscribers, error } = await supabase
    .from('waitlist')
    .select('email')
    .order('created_at', { ascending: true })

  if (error || !subscribers) {
    console.error('Failed to fetch subscribers:', error)
    return
  }

  console.log(`Sending to ${subscribers.length} subscribers...`)

  // Send in batches
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    const promises = batch.map(sub =>
      resend.emails.send({
        from: 'Vera <vera@ifq.app>',
        to: sub.email,
        subject: 'IFQ is live. Let\'s do this.',
        html: getLaunchEmailHTML(sub.email)
      })
    )

    await Promise.allSettled(promises)

    console.log(`Sent batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(subscribers.length / BATCH_SIZE)}`)

    // Rate limit pause
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS))
    }
  }

  console.log('Launch emails sent!')
}

sendLaunchEmails()
```

### 4. Social Media Launch Content

**Platform Priority:**
1. TikTok (primary growth channel for target demographic)
2. Instagram (reels + stories)
3. Twitter/X (for organic sharing)

**Launch Day Content Calendar:**

| Time | Platform | Content | Type |
|------|----------|---------|------|
| 9am | All | "IFQ is live." announcement | Image/text |
| 12pm | TikTok | App walkthrough video | 30-60s video |
| 3pm | Instagram | Vera introduction reel | 15-30s reel |
| 6pm | Twitter | Launch thread with stats | Thread |
| 8pm | TikTok | "What happens to your body when you quit" | Educational |

**Content Templates:**

**Announcement Post:**
```
IFQ is live on the App Store.

The anti-bullshit quit smoking app.

No lectures. No judgment. Just science and a coach who
actually gets it.

Link in bio.
```

**Educational TikTok Script:**
```
"Here's what happens to your body after you stop smoking:

20 minutes: heart rate drops
8 hours: blood oxygen normalises
24 hours: heart attack risk drops
48 hours: taste and smell come back
72 hours: nicotine is OUT of your body
1 week: lungs start healing
1 month: lung function up 30%

Every single one of these is tracked in IFQ.
Download link in bio."
```

**Thread Post:**
```
1/ We built IFQ because we couldn't stand the quit smoking apps
   that already exist.

2/ They're either basic trackers that don't actually help, or
   corporate wellness products that talk to you like you're in
   trouble at the principal's office.

3/ So we built an app with an AI coach named Vera who:
   - Knows addiction science inside and out
   - Is available 24/7
   - Remembers your triggers
   - Won't lecture you
   - Talks like a human

4/ Your first 7 days are free. After that, it costs less than
   a single pack of cigarettes per month.

5/ IFQ. Quit like you mean it.
   [App Store link]
```

### 5. Monitor App Store Review

**Review Monitoring:**

```
Check App Store Connect:
- [ ] Review status changes (Processing → In Review → Ready for Sale)
- [ ] Respond to any reviewer questions within 24 hours
- [ ] If rejected, address feedback and resubmit immediately

Typical timeline:
- Processing: 1-24 hours
- In Review: 1-3 days (can be longer)
- Result: Approved or Rejected with feedback
```

**If Rejected:**

Common fixes:
1. **Metadata issues**: Fix copy/screenshots and resubmit
2. **Bug found**: Fix, test, upload new build
3. **Guideline question**: Respond via Resolution Center
4. **Privacy concern**: Update privacy policy/nutrition labels

**Post-Approval Actions:**

```
Immediate (within 1 hour):
- [ ] Verify app is live and downloadable
- [ ] Test purchase flow on live app
- [ ] Update landing page with App Store link
- [ ] Trigger email blast
- [ ] Post social media announcement

First 24 hours:
- [ ] Monitor crash reports (Xcode Organizer)
- [ ] Check Supabase for new user signups
- [ ] Monitor API logs for errors
- [ ] Respond to any App Store reviews
- [ ] Post additional social content
```

### 6. Launch Day Operations

**Monitoring Dashboard:**

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| App crashes | Xcode Organizer | Any crash |
| API errors | Vercel logs | > 5% error rate |
| Response time | Vercel analytics | > 3s p95 |
| Database | Supabase dashboard | Connection limit |
| LLM costs | Anthropic dashboard | > $50/day |
| Downloads | App Store Connect | Track daily |
| Email signups | Supabase | Track conversion |
| Waitlist → Download | Analytics | Track funnel |

**Incident Response Plan:**

```
Level 1 (Minor): UI bug, non-critical feature broken
→ Log issue, fix in next update

Level 2 (Major): Feature broken for all users
→ Investigate immediately, hotfix if possible

Level 3 (Critical): App crashing, data loss, security issue
→ All hands on deck, consider pulling app if necessary
```

**Key Metrics to Track First Week:**

| Metric | Target | Source |
|--------|--------|--------|
| Downloads | Track total | App Store Connect |
| Waitlist → Download conversion | > 30% | Email + analytics |
| Onboarding completion | > 50% | Backend |
| First Vera message sent | > 80% of onboarded | Backend |
| Day 1 retention | > 40% | Backend |
| Free trial starts | Track all | StoreKit |
| Crash-free rate | > 99% | Xcode |

---

## Tasks

### App Store Submission (Day 1)
- [ ] Final build archive and upload
- [ ] Complete all App Store Connect metadata
- [ ] Fill in App Privacy nutrition labels
- [ ] Configure subscription in App Store Connect
- [ ] Submit for review
- [ ] Notify team of submission

### Landing Page Update (Day 1-2)
- [ ] Add App Store badge component
- [ ] Update hero section with download CTA
- [ ] Change "Coming Soon" to "Download Now"
- [ ] Update waitlist counter to user counter
- [ ] Deploy to production
- [ ] Test all links

### Email Campaign (Day 2-3)
- [ ] Set up transactional email service
- [ ] Design launch email (HTML)
- [ ] Write follow-up email sequence
- [ ] Test email delivery (send to self)
- [ ] Prepare batch sending script
- [ ] (Send when app approved)

### Social Media Content (Day 3-4)
- [ ] Create announcement graphics
- [ ] Record app walkthrough video
- [ ] Write all launch copy
- [ ] Schedule posts (or prepare for manual)
- [ ] Set up link in bio

### Launch Day Execution (Day 5)
- [ ] Monitor App Store review status
- [ ] When approved: execute launch sequence
  - [ ] Update landing page
  - [ ] Send email blast
  - [ ] Post social media
  - [ ] Personal outreach to friends/family
- [ ] Monitor crash reports
- [ ] Monitor API performance
- [ ] Respond to first App Store reviews
- [ ] Track download numbers

---

## Success Criteria

- [ ] App approved and live on App Store
- [ ] Landing page drives to App Store listing
- [ ] Launch emails sent successfully (> 95% delivery rate)
- [ ] First organic downloads occurring
- [ ] No critical bugs in production (crash-free rate > 99%)
- [ ] API stable under initial load
- [ ] First users completing onboarding

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Email service | Resend | Good deliverability, simple API, affordable |
| Batch sending | 50/second | Avoid spam filter triggers |
| Monitoring | Vercel + Xcode + Supabase | Native tools, no extra cost |
| Social scheduling | Manual for launch | More control, authentic feel |

---

## Launch Communication Template

**For Friends/Family/Network:**
```
Hey! I just launched an app called IFQ (I Fucking Quit) — it's
an AI-powered quit smoking app with a coach named Vera.

If you know anyone trying to quit smoking or vaping, I'd really
appreciate if you could share it:

[App Store link]

And if you've got 2 minutes, a review on the App Store would
mean the world to me.

Thanks!
```

**For Reddit/Forums:**
```
I built an app to help people quit smoking. It's called IFQ and
it has an AI coach named Vera who's available 24/7 for craving
support, backed by real addiction science.

What makes it different: no lectures, no judgment, no corporate
wellness BS. Just real support when you need it.

7-day free trial, then $9.99/month (less than a pack of cigarettes).

[link]

Happy to answer any questions about the tech or approach.
```

---

## Post-Launch Priorities (Week 2+)

Based on launch data, prioritize:

1. **Critical bugs**: Any crash or data issue → immediate fix
2. **Onboarding drop-off**: Where do people leave? → A/B test
3. **Vera quality**: Review conversations → refine prompt
4. **Retention drivers**: What keeps people coming back? → amplify
5. **Review responses**: Every review gets a thoughtful response

---

## Notes

- **PENDING: App Store URLs** - Update landing page app store badge links with actual URLs once apps are published:
  - App Store: `prototyping/refined-rebel/index.html` (line ~46)
  - Google Play: same file
  - Current placeholder: `href="#"`
- Submit early in the week (Mon/Tue) for fastest review
- Have someone else proofread all App Store copy
- Test the complete download → onboard → chat flow on a fresh device
- Keep App Store pricing in AUD (localizes to other currencies automatically)
- First impressions matter enormously—make launch day feel special
- Don't be afraid to share personally—your network is your first wave

---

## Resources

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Resend Documentation](https://resend.com/docs)
- [App Store Marketing Guidelines](https://developer.apple.com/app-store/marketing/guidelines/)
- [App Store Badge Downloads](https://developer.apple.com/app-store/marketing/guidelines/#section-badges)

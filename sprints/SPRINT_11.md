# Sprint 11: App Store Prep

**Theme**: Ready for review
**Duration**: 1 week

---

## Objective

Prepare all App Store assets, legal documents, and complete internal testing. By the end of this sprint, the app should be submitted to App Store review or ready for immediate submission.

---

## Prerequisites

- Sprint 10 complete (all features polished)
- Apple Developer Program membership active
- App running stably on test devices
- No known crashes or critical bugs

---

## Deliverables

### 1. App Store Screenshots

**Required Sizes:**

| Device | Resolution | Dimensions |
|--------|-----------|------------|
| iPhone 6.7" (15 Pro Max) | 3x | 1290 x 2796 px |
| iPhone 6.5" (11 Pro Max) | 3x | 1242 x 2688 px |
| iPhone 5.5" (8 Plus) | 3x | 1242 x 2208 px |

**Screenshot Set (6-8 screenshots per size):**

```
Screenshot 1: HERO
┌──────────────────────────────┐
│                              │
│      IFQ                     │
│                              │
│   QUIT LIKE                  │
│   YOU MEAN IT.               │
│                              │
│   The anti-bullshit quit     │
│   smoking app with a coach   │
│   who actually gets it.      │
│                              │
│      [App Preview]           │
│                              │
└──────────────────────────────┘
Background: Rebel Black with Electric Coral accents

Screenshot 2: MEET VERA
┌──────────────────────────────┐
│                              │
│   YOUR QUIT COACH.           │
│   AVAILABLE 24/7.            │
│                              │
│   ┌──────────────────────┐   │
│   │  [Chat Interface     │   │
│   │   showing Vera       │   │
│   │   conversation]      │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘

Screenshot 3: SCIENCE-BACKED
┌──────────────────────────────┐
│                              │
│   SCIENCE, NOT SHAME.        │
│                              │
│   ┌──────────────────────┐   │
│   │  [Vera explaining    │   │
│   │   neuroscience in    │   │
│   │   chat]              │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘

Screenshot 4: TRACK PROGRESS
┌──────────────────────────────┐
│                              │
│   EVERY WIN COUNTS.          │
│                              │
│   ┌──────────────────────┐   │
│   │  [Progress Dashboard │   │
│   │   showing days,      │   │
│   │   money saved]       │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘

Screenshot 5: HEALTH TIMELINE
┌──────────────────────────────┐
│                              │
│   WATCH YOUR BODY HEAL.      │
│                              │
│   ┌──────────────────────┐   │
│   │  [Health timeline    │   │
│   │   with milestones]   │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘

Screenshot 6: ACHIEVEMENTS
┌──────────────────────────────┐
│                              │
│   CELEBRATE EVERY            │
│   MILESTONE.                 │
│                              │
│   ┌──────────────────────┐   │
│   │  [Achievement badges │   │
│   │   and celebration]   │   │
│   └──────────────────────┘   │
│                              │
└──────────────────────────────┘
```

**Screenshot Design Guidelines:**
- **Background**: Rebel Black (#0D0D0D) with subtle gradients
- **Text overlay**: Space Grotesk Bold, Signal White
- **Accent**: Electric Coral for CTAs and highlights
- **Device frame**: Optional—App Store doesn't require them
- **Copy**: Short, punchy, benefit-focused headlines
- **Localization**: English (Australia) primary

**Tools:**
- Figma for layout and design
- Xcode screenshots or fastlane snapshot for device captures
- Export at required resolutions

### 2. App Preview Video

**Duration:** 15-30 seconds

**Storyboard:**

```
[0-3s]   IFQ logo animation on black background
[3-8s]   Quick onboarding flow (skip through)
[8-15s]  Chat with Vera - show conversation flow
          Focus: Vera responding to craving
[15-22s] Progress dashboard with counter animating
          Show: days, money saved, health milestones
[22-28s] Achievement unlocking with celebration
[28-30s] "Quit Like You Mean It" + download CTA
```

**Technical Requirements:**
- H.264 codec
- 30fps minimum
- No letterboxing
- Must show actual app functionality
- Size: 1080 x 1920 (portrait)
- Under 30 seconds

**Audio:** Optional background music (royalty-free) or silent. No voiceover required.

### 3. App Store Description & Keywords

**App Name:** IFQ - Quit Smoking Coach

**Subtitle:** AI Support to Quit for Good

**Description:**

```
IFQ is the anti-bullshit quit smoking app. No lectures. No judgment. Just science-backed tools and a coach who actually gets it.

MEET VERA — YOUR QUIT COACH
Vera is an AI coach trained on addiction science who's available 24/7. She remembers your triggers, celebrates your wins, and helps you through cravings in real-time. She's the support you need at 2am when willpower isn't enough.

SCIENCE, NOT SHAME
IFQ is built on evidence-based approaches to quitting. We explain what's happening in your brain and body—clearly, without the medical jargon. Knowledge is power when you're fighting addiction.

TRACK YOUR PROGRESS
• Days smoke-free counter
• Money saved calculator (watch your wallet grow)
• Health timeline (see your body heal in real-time)
• Achievement milestones with celebration

BUILT FOR YOUR JOURNEY
• Personalised quit plan based on your smoking history
• Trigger identification and management
• 24/7 support—cravings don't wait for office hours
• Zero judgment for setbacks
• Works for cigarettes, vaping, and all nicotine products

WHY IFQ?
Most quit smoking apps are either basic trackers or corporate wellness products that talk to you like you're in trouble at the principal's office. IFQ is different. We match the intensity of what you're going through with tools that actually work.

Start your 7-day free trial. Quit like you mean it.

SUBSCRIPTION INFORMATION
• IFQ offers a monthly subscription for full access
• Payment will be charged to your Apple ID account
• Subscription automatically renews unless cancelled
• Manage or cancel anytime in Settings > Apple ID > Subscriptions
```

**Keywords (100 character limit):**

```
quit smoking,stop smoking,nicotine,vaping,addiction,coach,AI,health,craving,smoke free
```

**Category:** Health & Fitness
**Secondary Category:** Medical

**Content Rating:** 17+ (for language/swearing)

### 4. Privacy Policy & Terms of Service

**Privacy Policy Key Sections:**

```markdown
# Privacy Policy

Last updated: [Date]

## What We Collect
- Account information (email, name from Apple Sign In)
- Smoking profile data (cigarettes/day, triggers, quit date)
- Chat messages with Vera (stored encrypted)
- Usage analytics (anonymous)
- Device token for push notifications

## What We DON'T Do
- Sell your data to third parties
- Show you ads
- Share your information with tobacco companies
- Store more than we need
- Access your data without authentication

## Data Storage
- All data encrypted at rest and in transit
- Hosted on Supabase (PostgreSQL) in [region]
- Chat conversations encrypted and only accessible to you

## Data Retention
- Active account: data retained while subscription active
- Deleted account: all data permanently deleted within 30 days
- We do not retain data for users who delete accounts

## Your Rights
- Export your data at any time
- Delete your account and all data
- Modify your profile information
- Opt out of non-essential notifications

## Third-Party Services
- Supabase (database and authentication)
- Anthropic (AI model for Vera — conversations sent for processing)
- Apple (authentication, push notifications, payments)
- Plausible Analytics (anonymous, cookie-free analytics)

## Contact
For privacy questions: privacy@ifq.app
```

**Terms of Service Key Sections:**

```markdown
# Terms of Service

## Service Description
IFQ provides AI-powered quit smoking support. We are NOT a medical service.

## Important Disclaimers
- IFQ is not a substitute for medical advice
- Consult your doctor before making health decisions
- Results vary and are not guaranteed
- Vera is an AI, not a human counsellor

## Subscription Terms
- 7-day free trial for new users
- Monthly subscription at $9.99 AUD
- Auto-renews unless cancelled
- Cancel anytime via Apple Settings

## User Conduct
- Don't abuse or attempt to hack the service
- Don't share your account
- Content provided to Vera may be used to improve the service (anonymised)

## Limitation of Liability
- IFQ provides tools and support, not medical treatment
- We are not responsible for health outcomes
- Maximum liability limited to subscription fees paid
```

### 5. App Icon Final Versions

**Required Sizes:**

| Context | Size | Notes |
|---------|------|-------|
| App Store | 1024 x 1024 | High-res, no transparency |
| iPhone | 180 x 180 (60pt @3x) | Home screen |
| iPad | 167 x 167 (83.5pt @2x) | Home screen |
| Spotlight | 120 x 120 (40pt @3x) | Search results |
| Settings | 87 x 87 (29pt @3x) | Settings app |
| Notification | 60 x 60 (20pt @3x) | Notification center |

**Icon Design:**
- Bold "Q" lettermark on Rebel Black background
- Electric Coral accent
- Clean, high contrast
- No text beyond the lettermark (too small to read)
- Rounded corners handled by iOS (provide square)

### 6. TestFlight Internal Testing

**TestFlight Setup:**

```
1. Archive build in Xcode
2. Upload to App Store Connect
3. Add internal testers (up to 25)
4. Distribute build
5. Collect feedback via TestFlight
```

**Testing Checklist:**

| Feature | Test | Status |
|---------|------|--------|
| Sign In | Apple Sign In works | [ ] |
| Onboarding | All 4 screens complete | [ ] |
| Chat | Send message, receive response | [ ] |
| Chat | Streaming works smoothly | [ ] |
| Progress | Days counter accurate | [ ] |
| Progress | Money saved correct | [ ] |
| Progress | Health timeline shows | [ ] |
| Achievements | Milestones unlock | [ ] |
| Notifications | Push arrives | [ ] |
| Notifications | Tap navigates correctly | [ ] |
| Settings | All preferences save | [ ] |
| Settings | Sign out works | [ ] |
| Offline | App handles no connection | [ ] |
| Background | App resumes correctly | [ ] |
| Memory | No memory leaks | [ ] |
| Crash | No crashes in 30 min session | [ ] |

**Test Scenarios:**

1. **New user flow**: Install → Sign In → Onboard → Chat → View Progress
2. **Returning user**: Open → Chat loads history → Check progress
3. **Craving scenario**: Open during craving → Chat with Vera → Get support
4. **Offline**: Turn off wifi → Open app → Verify graceful handling
5. **Background/foreground**: Chat → Switch app → Come back → Chat continues
6. **Notification**: Receive notification → Tap → Navigate to correct screen
7. **Account deletion**: Delete account → Verify data removed → Can re-register

---

## Tasks

### Screenshots (Day 1-2)
- [ ] Capture raw screenshots from device
- [ ] Design screenshot frames in Figma
- [ ] Add text overlays and branding
- [ ] Export at all required sizes
- [ ] Review with brand guidelines

### App Preview Video (Day 2)
- [ ] Record screen capture
- [ ] Edit to 30-second clip
- [ ] Add transitions and text
- [ ] Export in correct format
- [ ] Test preview on device

### App Store Copy (Day 3)
- [ ] Write full description
- [ ] Select keywords (100 char limit)
- [ ] Write promotional text
- [ ] Write "What's New" for v1.0
- [ ] Review copy against brand voice

### Legal Documents (Day 3-4)
- [ ] Draft privacy policy
- [ ] Draft terms of service
- [ ] Set up legal pages on website
- [ ] Link from within app
- [ ] Legal review (if possible)

### App Icon (Day 4)
- [ ] Finalise icon design
- [ ] Export at all required sizes
- [ ] Add to Xcode asset catalog
- [ ] Test icon renders well at small sizes
- [ ] Verify no transparency issues

### TestFlight (Day 4-5)
- [ ] Create release build
- [ ] Upload to App Store Connect
- [ ] Add internal testers
- [ ] Run through all test scenarios
- [ ] Fix any issues found
- [ ] Create regression build if needed

---

## Success Criteria

- [ ] All App Store assets meet Apple requirements
- [ ] Privacy policy covers data usage accurately
- [ ] Internal testers approve UX flow
- [ ] No crashes in TestFlight (zero crash rate)
- [ ] All screenshots show correct content
- [ ] App preview video is engaging and accurate
- [ ] Keywords optimized for search

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Screenshot tool | Xcode + Figma | Full control over design |
| Video editing | QuickTime + iMovie | Simple, free tools |
| Legal docs | Self-drafted + template | Fast for MVP, professional review later |
| Testing distribution | TestFlight | Apple's official tool, tracks crashes |

---

## App Store Optimization (ASO) Notes

- **Title**: Keep under 30 characters, include primary keyword
- **Subtitle**: 30 characters, different keywords from title
- **Keywords**: No duplicates from title/subtitle, comma-separated, no spaces
- **Screenshots**: First 3 visible without scrolling, make them count
- **Video**: Auto-plays in search results, make first 3 seconds compelling
- **Category**: Health & Fitness for discoverability
- **Ratings**: Request reviews after positive moments (achievement unlocked)

---

## App Review Guidelines Compliance

| Guideline | Action |
|-----------|--------|
| 1.1 Safety | Include content warning for addiction topics |
| 2.1 Performance | No crashes, fast app launch |
| 3.1.1 In-App Purchase | Use StoreKit for subscription |
| 4.0 Design | Follow HIG, native iOS patterns |
| 5.1.1 Data Collection | Privacy policy accurate and accessible |
| 5.1.2 Data Use | Explain AI data processing |
| Health content | Disclaimer: not medical advice |

---

## Notes

- Apple review can take 1-7 days—submit early in the week
- Have backup screenshots in case Apple rejects any
- Privacy policy must match App Store Privacy Nutrition Label
- Consider creating a simple support email for Apple review
- TestFlight crash reports are critical—fix ALL crashes before submission
- Age rating 17+ is appropriate given language in the app

---

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Screenshot Specs](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [App Preview Video Specs](https://developer.apple.com/help/app-store-connect/reference/app-preview-specifications)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

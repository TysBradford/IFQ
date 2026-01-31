# Implementation Plan

This document outlines the sprint-by-sprint roadmap for building IFQ from scaffolding to public launch and beyond.

---

## Progress Tracker

**Current Sprint**: Sprint 1
**Last Updated**: 2025-01-25

### Phase Summary

| Phase | Focus | Sprints | Status | Progress |
|-------|-------|---------|--------|----------|
| 1 | Audience Building | 1-3 | 🟡 In Progress | 0/3 sprints |
| 2 | Backend Foundation | 4-6 | ⚪ Not Started | 0/3 sprints |
| 3 | iOS App MVP | 7-10 | ⚪ Not Started | 0/4 sprints |
| 4 | Launch | 11-12 | ⚪ Not Started | 0/2 sprints |
| 5 | Post-Launch | 13+ | ⚪ Not Started | — |

### Sprint Status

| Sprint | Theme | Status | Criteria Met |
|--------|-------|--------|--------------|
| 1 | Landing Page Foundation — Set the Standard | 🟡 In Progress | 0/4 |
| 2 | Landing Page Content — Tell the Story Beautifully | ⚪ Not Started | 0/4 |
| 3 | Landing Page Launch — Go Live Flawlessly | ⚪ Not Started | 0/5 |
| 4 | Database & Auth | ⚪ Not Started | 0/4 |
| 5 | Vera AI Core | ⚪ Not Started | 0/4 |
| 6 | Backend API Complete | ⚪ Not Started | 0/4 |
| 7 | iOS Auth & Onboarding | ⚪ Not Started | 0/4 |
| 8 | Chat Interface | ⚪ Not Started | 0/4 |
| 9 | Progress Dashboard | ⚪ Not Started | 0/4 |
| 10 | Polish & Notifications | ⚪ Not Started | 0/4 |
| 11 | App Store Prep | ⚪ Not Started | 0/4 |
| 12 | Public Launch | ⚪ Not Started | 0/5 |

**Legend**: ⚪ Not Started | 🟡 In Progress | 🟢 Complete

---

## How to Use This Document

- **Sprint Duration**: 1 week per sprint
- **Sprint Details**: Each sprint references `/sprints/SPRINT_XX.md` for detailed implementation tasks
- **Philosophy**: Ship with craft. Every sprint has a design excellence bar — nothing goes live that feels "good enough." Iterate based on real user feedback, build audience before app launch.
- **Tracking**: Update checkboxes as criteria are met, update status tables above

This plan prioritizes getting the landing page live first to capture interest and build an email list while the app is being developed.

---

## Phase 1: Audience Building

Build the landing page first to start capturing emails and validating interest while the app is developed.

### Sprint 1: Landing Page Foundation

**Status**: 🟡 In Progress
**Theme**: Set the standard

**Key Deliverables**:
- [ ] Next.js project setup with TypeScript
- [ ] Tailwind CSS configured with IFQ brand tokens (colors, typography)
- [ ] Hero section with value proposition and email capture — award-calibre first impression
- [ ] Framer Motion animation system with shared spring/easing presets
- [ ] Supabase integration for email list storage
- [ ] Mobile-responsive foundation

**Success Criteria**:
- [ ] Landing page runs locally with hot reload
- [ ] Email capture form saves to Supabase
- [ ] Brand colors and fonts match BRAND.md spec
- [ ] Hero entrance animation is choreographed and premium
- [ ] All interaction states (focus, hover, loading, success) feel crafted
- [ ] Lighthouse mobile score > 90

**Details**: [/sprints/SPRINT_01.md](/sprints/SPRINT_01.md)

---

### Sprint 2: Landing Page Content

**Status**: ⚪ Not Started
**Theme**: Tell the story beautifully

**Key Deliverables**:
- [ ] Problem section (nicotine addiction stats, emotional hook) — with crafted stat cards and eased counter animations
- [ ] Solution section (what IFQ offers) — feature cards with depth, presence, and hover interactions
- [ ] Meet Vera section (introduce the AI coach) — the emotional heart of the page, with conversation-style animation
- [ ] How It Works walkthrough (3-step visual) — progressive reveal with draw-on timeline animation
- [ ] Cohesive scroll experience with choreographed section transitions

**Success Criteria**:
- [ ] All content sections complete and on-brand
- [ ] Copy matches IFQ voice (direct, warm, irreverent)
- [ ] Full-page scroll experience feels choreographed, not assembled
- [ ] Every section has visual depth — nothing feels flat or default
- [ ] Works across devices — every breakpoint feels intentionally designed

**Details**: [/sprints/SPRINT_02.md](/sprints/SPRINT_02.md)

---

### Sprint 3: Landing Page Launch

**Status**: ⚪ Not Started
**Theme**: Go live — flawlessly

**Key Deliverables**:
- [ ] Pricing section — premium card with depth and presence, not a generic pricing box
- [ ] FAQ section — spring-physics accordion that feels noticeably better than standard implementations
- [ ] Social proof section — animated waitlist counter, considered testimonial layout
- [ ] Final design review gate — full-page scroll audit, interaction audit, breakpoint review
- [ ] SEO optimization (meta tags, OpenGraph, structured data)
- [ ] Deploy to Vercel production
- [ ] Analytics setup (Plausible or similar)

**Success Criteria**:
- [ ] Live at production domain
- [ ] SEO meta tags rendering correctly
- [ ] Analytics tracking page views and email signups
- [ ] Page speed: < 3s load on 3G
- [ ] Social share preview looks correct
- [ ] Full page passes the design excellence bar — cohesive, choreographed, screenshot-worthy
- [ ] Lighthouse 90+ across all metrics

**Details**: [/sprints/SPRINT_03.md](/sprints/SPRINT_03.md)

---

## Phase 2: Backend Foundation

Build the API and Vera AI core that will power the iOS app.

### Sprint 4: Database & Auth

**Status**: ⚪ Not Started
**Theme**: Foundation infrastructure

**Key Deliverables**:
- [ ] Supabase schema design (users, profiles, conversations, messages)
- [ ] Row Level Security (RLS) policies
- [ ] Authentication flow (Apple Sign In, email/password)
- [ ] User profile management endpoints
- [ ] Database migrations system

**Success Criteria**:
- [ ] User can sign up, sign in, sign out
- [ ] Profile CRUD operations working
- [ ] RLS prevents cross-user data access
- [ ] Auth tokens refresh correctly

**Details**: [/sprints/SPRINT_04.md](/sprints/SPRINT_04.md)

---

### Sprint 5: Vera AI Core

**Status**: ⚪ Not Started
**Theme**: Bring Vera to life

**Key Deliverables**:
- [ ] LLM integration (Claude or GPT-4)
- [ ] Vera personality system prompt and behavior guidelines
- [ ] Conversation context management
- [ ] Chat API endpoints (send message, get history)
- [ ] Streaming response support

**Success Criteria**:
- [ ] Vera responds in character (supportive, warm, direct)
- [ ] Conversation context maintained across messages
- [ ] Responses stream to client
- [ ] Rate limiting in place

**Details**: [/sprints/SPRINT_05.md](/sprints/SPRINT_05.md)

---

### Sprint 6: Backend API Complete

**Status**: ⚪ Not Started
**Theme**: Feature-complete API

**Key Deliverables**:
- [ ] Progress tracking endpoints (quit date, days smoke-free)
- [ ] Milestones and achievements system
- [ ] Health timeline data (based on quit duration)
- [ ] Money saved calculator endpoint
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Integration tests

**Success Criteria**:
- [ ] All MVP endpoints documented and tested
- [ ] Milestone triggers fire correctly
- [ ] Health timeline returns accurate data
- [ ] API docs accessible at /docs

**Details**: [/sprints/SPRINT_06.md](/sprints/SPRINT_06.md)

---

## Phase 3: iOS App MVP

Build the SwiftUI app that users will interact with.

### Sprint 7: iOS Auth & Onboarding

**Status**: ⚪ Not Started
**Theme**: First impressions

**Key Deliverables**:
- [ ] Xcode project structure and architecture
- [ ] Sign in with Apple integration
- [ ] Onboarding flow screens (smoking history, goals, preferences)
- [ ] Profile setup and persistence
- [ ] API client setup

**Success Criteria**:
- [ ] User can sign in with Apple
- [ ] Onboarding captures required data
- [ ] Data syncs to backend
- [ ] App handles offline gracefully

**Details**: [/sprints/SPRINT_07.md](/sprints/SPRINT_07.md)

---

### Sprint 8: Chat Interface

**Status**: ⚪ Not Started
**Theme**: Talk to Vera

**Key Deliverables**:
- [ ] Chat UI (message bubbles, input field, send button)
- [ ] Real-time message streaming display
- [ ] Message history loading
- [ ] Vera typing indicator
- [ ] Basic rich content support (formatted text)

**Success Criteria**:
- [ ] Messages send and display correctly
- [ ] Streaming responses render smoothly
- [ ] History loads on app open
- [ ] Chat feels responsive and native

**Details**: [/sprints/SPRINT_08.md](/sprints/SPRINT_08.md)

---

### Sprint 9: Progress Dashboard

**Status**: ⚪ Not Started
**Theme**: Show the wins

**Key Deliverables**:
- [ ] Days quit counter (prominent display)
- [ ] Money saved calculator
- [ ] Health milestones timeline
- [ ] Achievement badges display
- [ ] Pull-to-refresh

**Success Criteria**:
- [ ] Stats update in real-time
- [ ] Health milestones show accurate timings
- [ ] Achievements display with celebratory UI
- [ ] Dashboard feels motivating, not clinical

**Details**: [/sprints/SPRINT_09.md](/sprints/SPRINT_09.md)

---

### Sprint 10: Polish & Notifications

**Status**: ⚪ Not Started
**Theme**: Production ready

**Key Deliverables**:
- [ ] Push notification registration and handling
- [ ] Vera-initiated check-in notifications
- [ ] Settings screen (notification preferences, account)
- [ ] UI polish pass (animations, transitions, edge cases)
- [ ] Error handling and empty states

**Success Criteria**:
- [ ] Push notifications arrive correctly
- [ ] Settings persist and sync
- [ ] No visual bugs or jank
- [ ] Handles network errors gracefully

**Details**: [/sprints/SPRINT_10.md](/sprints/SPRINT_10.md)

---

## Phase 4: Launch

Prepare for and execute the public App Store launch.

### Sprint 11: App Store Prep

**Status**: ⚪ Not Started
**Theme**: Ready for review

**Key Deliverables**:
- [ ] App Store screenshots (6.5", 5.5" sizes)
- [ ] App preview video (15-30s)
- [ ] App Store description and keywords
- [ ] Privacy policy and terms of service
- [ ] App icon final versions
- [ ] TestFlight internal testing

**Success Criteria**:
- [ ] All App Store assets meet Apple requirements
- [ ] Privacy policy covers data usage accurately
- [ ] Internal testers approve UX flow
- [ ] No crashes in TestFlight

**Details**: [/sprints/SPRINT_11.md](/sprints/SPRINT_11.md)

---

### Sprint 12: Public Launch

**Status**: ⚪ Not Started
**Theme**: Ship it

**Key Deliverables**:
- [ ] App Store submission
- [ ] Landing page update (download button, App Store badge)
- [ ] Email blast to waiting list
- [ ] Social media launch content
- [ ] Monitor App Store review and respond

**Success Criteria**:
- [ ] App approved and live on App Store
- [ ] Landing page drives to App Store listing
- [ ] Launch emails sent successfully
- [ ] First organic downloads occurring
- [ ] No critical bugs in production

**Details**: [/sprints/SPRINT_12.md](/sprints/SPRINT_12.md)

---

## Phase 5: Post-Launch

Iterate based on real user feedback and scale what works.

### Sprint 13+: Iteration & Scale

**Status**: ⚪ Not Started
**Theme**: Learn and grow

**Potential Deliverables** (prioritized based on feedback):
- [ ] Payment/subscription integration (RevenueCat)
- [ ] Referral program ("Invite a friend who wants to quit")
- [ ] Vera proactive messaging (scheduled check-ins)
- [ ] Community features
- [ ] Android app planning
- [ ] Advanced analytics and A/B testing

**Ongoing Work**:
- [ ] Monitor retention metrics daily
- [ ] Collect and publish success stories
- [ ] Iterate on Vera's personality based on user feedback
- [ ] App Store review responses
- [ ] Content marketing execution

**Success Metrics** (from DISTRIBUTION.md):
- [ ] 50%+ onboarding completion
- [ ] 20%+ trial to paid conversion
- [ ] Day 30 retention > 35%
- [ ] First users hitting 30-day smoke-free milestone

**Details**: Sprint docs created as needed based on priorities

---

## Cross-Cutting Concerns

### Testing Strategy

- [ ] **Unit Tests**: Core business logic (progress calculations, milestone triggers)
- [ ] **Integration Tests**: API endpoints, database operations
- [ ] **UI Tests**: Critical user flows (onboarding, chat, payment)
- [ ] **Manual Testing**: Each sprint includes QA time before merge

### Security

- [ ] All API endpoints require authentication (except public landing page)
- [ ] Supabase RLS on all tables
- [ ] No PII in logs
- [ ] HTTPS everywhere
- [ ] Rate limiting on LLM endpoints

### Monitoring

- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring
- [ ] LLM cost tracking
- [ ] User analytics (privacy-respecting)

### DevOps

- [ ] CI/CD from day one (GitHub Actions)
- [ ] Preview deployments for PRs
- [ ] Separate staging environment before Sprint 11
- [ ] Database backups automated

---

## Alignment with Growth Strategy

This implementation plan maps to DISTRIBUTION.md growth stages:

| Growth Stage | Implementation Phase | When | Status |
|--------------|---------------------|------|--------|
| Pre-launch (email capture) | Phase 1: Landing Page | Sprints 1-3 | 🟡 In Progress |
| 0→100 users (validation) | Phase 4: Launch | Sprints 11-12 | ⚪ Not Started |
| 100→1,000 users (PMF) | Phase 5: Iteration | Sprint 13+ | ⚪ Not Started |
| 1,000→10,000 (scale) | Future | Based on traction | ⚪ Not Started |

The landing page goes live in Sprint 3, giving ~9 weeks of audience building before the app launches in Sprint 12. This enables:
- Email list growth through organic TikTok/Instagram content
- Early user research via landing page visitors
- Social proof collection before app launch
- Influencer outreach with something tangible to show

---

## Notes

- Sprint docs (`/sprints/SPRINT_XX.md`) contain detailed implementation tasks, technical specs, and acceptance criteria
- Sprints are 1 week but can flex if blocked—transparency over false deadlines
- This plan assumes solo developer or small team; adjust scope for team size
- Payment integration deferred to post-launch to reduce MVP complexity
- Android is explicitly out of scope until iOS traction proven
- **Update this tracker** as work progresses—check boxes and update status fields

# Project Overview

## Vision

<!-- Define the high-level vision for the project -->

## Goals

<!-- List the primary goals and objectives -->

## Milestones

### Phase 1: Foundation
- [ ] Set up monorepo structure
- [ ] Initialize landing page
- [ ] Initialize backend API
- [ ] Initialize iOS app project
- [ ] Configure CI/CD pipelines

### Phase 2: Core Features
<!-- Define core feature milestones -->

### Phase 3: Launch
<!-- Define launch milestones -->

## Architecture

### System Overview

```
┌─────────────────┐     ┌─────────────────┐
│   Landing Page  │     │    iOS App      │
│   (Next.js)     │     │   (SwiftUI)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Backend   │
              │  (FastAPI)  │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │  Supabase   │
              │ (Auth + DB) │
              └─────────────┘
```

## Technical Decisions

<!-- Document key technical decisions and rationale -->

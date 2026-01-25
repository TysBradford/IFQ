# IFQ

Monorepo for the IFQ project.

## Project Structure

```
├── docs/                    # Project documentation
│   ├── PROJECT.md          # Project overview and goals
│   ├── BRAND.md            # Brand guidelines
│   ├── DISTRIBUTION.md     # Distribution strategy
│   └── ICP.md              # Ideal Customer Profile
├── landing-page/           # Next.js + TypeScript + Tailwind
├── ios-app/                # Swift + SwiftUI
└── backend/                # Python FastAPI + Poetry
```

## Tech Stack

| Component     | Technology                        |
|---------------|-----------------------------------|
| Landing Page  | Next.js, TypeScript, Tailwind CSS |
| iOS App       | Swift, SwiftUI                    |
| Backend       | Python, FastAPI, Poetry           |
| Database      | Supabase (PostgreSQL)             |
| Auth          | Supabase Auth                     |
| Hosting       | Vercel (landing page + backend)   |
| CI/CD         | GitHub Actions                    |

## Getting Started

### Landing Page

```bash
cd landing-page
npm install
npm run dev
```

### Backend

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

### iOS App

Open `ios-app/IFQ.xcodeproj` in Xcode.

## Development

See individual project READMEs for detailed setup instructions.

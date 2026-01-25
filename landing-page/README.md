# IFQ Landing Page

Next.js landing page for the IFQ project.

## Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start dev server         |
| `npm run build`   | Build for production     |
| `npm run start`   | Start production server  |
| `npm run lint`    | Run ESLint               |
| `npm run type-check` | Run TypeScript check  |

## Deployment

Deployed to Vercel automatically on push to `main`.

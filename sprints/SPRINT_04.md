# Sprint 4: Database & Auth

**Theme**: Foundation infrastructure
**Duration**: 1 week

---

## Objective

Set up the complete database schema and authentication system that will power the iOS app. This is the critical infrastructure layer—everything else builds on top of this foundation.

---

## Prerequisites

- Supabase project created (from Sprint 1)
- Landing page live and capturing emails
- Basic familiarity with PostgreSQL and RLS

---

## Deliverables

### 1. Database Schema Design

**Core Tables:**

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  timezone text default 'Australia/Sydney',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Smoking profiles (onboarding data)
create table public.smoking_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  cigarettes_per_day integer,
  years_smoking integer,
  pack_price decimal(10, 2),
  currency text default 'AUD',
  primary_triggers text[], -- ['stress', 'alcohol', 'boredom', 'social']
  previous_quit_attempts integer default 0,
  motivation text, -- freeform "why I want to quit"
  quit_date timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Quit attempts (users can restart)
create table public.quit_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  started_at timestamptz default now() not null,
  ended_at timestamptz, -- null if current attempt
  end_reason text, -- 'smoked', 'gave_up', 'restarted', null if active
  is_active boolean default true,
  cigarettes_avoided integer default 0,
  money_saved decimal(10, 2) default 0,
  created_at timestamptz default now() not null
);

-- Conversations with Vera
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  title text, -- optional, generated from first message
  started_at timestamptz default now() not null,
  last_message_at timestamptz default now() not null,
  message_count integer default 0,
  is_archived boolean default false
);

-- Individual messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  tokens_used integer,
  created_at timestamptz default now() not null
);

-- Milestones achieved
create table public.milestones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  quit_attempt_id uuid references public.quit_attempts on delete cascade not null,
  milestone_type text not null, -- 'time', 'health', 'money', 'cigarettes'
  milestone_key text not null, -- '24_hours', '72_hours', 'taste_improved', etc.
  achieved_at timestamptz default now() not null,
  notified boolean default false,
  unique(user_id, quit_attempt_id, milestone_key)
);

-- Slip events (when user smokes)
create table public.slip_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  quit_attempt_id uuid references public.quit_attempts on delete cascade not null,
  occurred_at timestamptz default now() not null,
  cigarettes_smoked integer default 1,
  trigger text, -- what triggered it
  context text, -- freeform notes
  created_at timestamptz default now() not null
);

-- Create indexes for performance
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_messages_user on public.messages(user_id);
create index idx_conversations_user on public.conversations(user_id);
create index idx_quit_attempts_user on public.quit_attempts(user_id);
create index idx_milestones_user on public.milestones(user_id);
```

### 2. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.smoking_profiles enable row level security;
alter table public.quit_attempts enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.milestones enable row level security;
alter table public.slip_events enable row level security;

-- Profiles: users can only access their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Smoking profiles: users can only access their own
create policy "Users can manage own smoking profile"
  on public.smoking_profiles for all
  using (auth.uid() = user_id);

-- Quit attempts: users can only access their own
create policy "Users can manage own quit attempts"
  on public.quit_attempts for all
  using (auth.uid() = user_id);

-- Conversations: users can only access their own
create policy "Users can manage own conversations"
  on public.conversations for all
  using (auth.uid() = user_id);

-- Messages: users can only access messages in their conversations
create policy "Users can manage own messages"
  on public.messages for all
  using (auth.uid() = user_id);

-- Milestones: users can only access their own
create policy "Users can manage own milestones"
  on public.milestones for all
  using (auth.uid() = user_id);

-- Slip events: users can only access their own
create policy "Users can manage own slip events"
  on public.slip_events for all
  using (auth.uid() = user_id);
```

### 3. Authentication Flow

**Supported Auth Methods:**
- Apple Sign In (primary for iOS)
- Email + Password (fallback)

**Supabase Auth Configuration:**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

**Apple Sign In Setup:**

1. Create Apple Developer App ID with Sign In with Apple capability
2. Create Services ID for web authentication
3. Configure redirect URLs in Supabase dashboard
4. Add Apple provider in Supabase Auth settings

**Auth Functions:**

```typescript
// lib/auth.ts

// Email/password signup
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
  return data
}

// Email/password signin
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// Apple Sign In
export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Listen to auth changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}
```

### 4. User Profile Management

**Create Profile on Signup (Database Trigger):**

```sql
-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Profile API Functions:**

```typescript
// lib/profile.ts

export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  timezone: string
  created_at: string
  updated_at: string
}

export interface SmokingProfile {
  id: string
  user_id: string
  cigarettes_per_day: number | null
  years_smoking: number | null
  pack_price: number | null
  currency: string
  primary_triggers: string[]
  previous_quit_attempts: number
  motivation: string | null
  quit_date: string | null
}

// Get user profile
export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Update user profile
export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get smoking profile
export async function getSmokingProfile(): Promise<SmokingProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('smoking_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data
}

// Create or update smoking profile
export async function upsertSmokingProfile(
  profile: Partial<SmokingProfile>
): Promise<SmokingProfile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('smoking_profiles')
    .upsert({
      ...profile,
      user_id: user.id,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### 5. Database Migrations System

**Migration File Structure:**

```
supabase/
├── migrations/
│   ├── 20250101000000_create_profiles.sql
│   ├── 20250101000001_create_smoking_profiles.sql
│   ├── 20250101000002_create_quit_attempts.sql
│   ├── 20250101000003_create_conversations.sql
│   ├── 20250101000004_create_messages.sql
│   ├── 20250101000005_create_milestones.sql
│   ├── 20250101000006_create_slip_events.sql
│   └── 20250101000007_create_rls_policies.sql
└── seed.sql (optional test data)
```

**Using Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Create new migration
supabase migration new create_profiles

# Apply migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

---

## Tasks

### Database Schema (Day 1-2)
- [ ] Design final schema based on requirements
- [ ] Create migration files for each table
- [ ] Run migrations on Supabase
- [ ] Verify tables created correctly
- [ ] Add indexes for query performance

### RLS Policies (Day 2)
- [ ] Write RLS policies for all tables
- [ ] Test policies prevent cross-user access
- [ ] Test policies allow proper user access
- [ ] Document any edge cases

### Auth Setup (Day 3)
- [ ] Configure Apple Sign In in Apple Developer Portal
- [ ] Add Apple provider to Supabase
- [ ] Configure email templates in Supabase
- [ ] Set up redirect URLs for web
- [ ] Create auth helper functions

### Profile Management (Day 4)
- [ ] Create profile trigger function
- [ ] Build profile API functions
- [ ] Build smoking profile API functions
- [ ] Test CRUD operations
- [ ] Handle edge cases (null values, etc.)

### Testing & Documentation (Day 5)
- [ ] Test full auth flow (signup, signin, signout)
- [ ] Test profile creation on signup
- [ ] Verify RLS blocks unauthorized access
- [ ] Test token refresh works correctly
- [ ] Document API functions
- [ ] Create seed data for development

---

## Success Criteria

- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User can sign out
- [ ] Profile CRUD operations work correctly
- [ ] RLS prevents cross-user data access (verified with tests)
- [ ] Auth tokens refresh correctly
- [ ] Apple Sign In configured (ready for iOS)
- [ ] All migrations documented and version controlled

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth provider | Supabase Auth | Integrated, handles Apple Sign In, free tier |
| Primary auth | Apple Sign In | Required for iOS app, best UX |
| Fallback auth | Email/password | Works everywhere, good fallback |
| Session storage | Supabase default | Handles refresh tokens automatically |
| UUID generation | gen_random_uuid() | PostgreSQL native, no extension needed |

---

## Security Considerations

- **RLS is mandatory**: Every table must have RLS enabled
- **No service key on client**: Only use anon key in frontend
- **Validate on server**: Don't trust client-side validation alone
- **Audit logging**: Consider adding audit table for sensitive operations (future)
- **Rate limiting**: Auth endpoints have built-in rate limiting from Supabase

---

## Notes

- This sprint is infrastructure-heavy with less visible output
- Test RLS thoroughly—security bugs here are critical
- Keep schema flexible for iteration but don't over-engineer
- Document any schema decisions for future reference
- Consider adding soft delete (is_deleted flag) for compliance (GDPR)

---

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Sign In with Apple Guide](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL UUID](https://www.postgresql.org/docs/current/functions-uuid.html)

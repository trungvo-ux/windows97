# Supabase Setup for Blackjack Multiplayer

## Quick Start

1. **Create a Supabase project** at https://app.supabase.com
2. **Get your credentials** from Settings → API:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (safe to expose in frontend)
   - Service Role Key (keep secret, backend only)

3. **Create a `.env` file** in the project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Note**: The app will run without Supabase configured, but multiplayer features will be disabled.

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_blackjack_lobbies.sql`

This will create:
- `blackjack_lobbies` table - stores lobby information
- `blackjack_players` table - stores player information (many-to-many with lobbies)
- Row Level Security (RLS) policies for secure access
- Indexes for performance

## Authentication Flow

1. Users sign up/login using Supabase Auth (email/password)
2. Frontend gets auth token from Supabase session
3. Token is sent with API requests to authenticate users
4. Backend verifies token using Supabase service role key

## Features

- **Secure Authentication**: Uses Supabase Auth with RLS policies
- **Database Storage**: Lobbies stored in PostgreSQL instead of Redis
- **Real-time Updates**: Still uses Pusher for WebSocket updates
- **OS Theme Styling**: Lobby dialog matches Windows XP/98/macOS theme

## Next Steps

1. Install Supabase package: `npm install @supabase/supabase-js --legacy-peer-deps`
2. Set up Supabase project and get credentials
3. Run the migration SQL
4. Update environment variables
5. Test lobby creation/joining flow


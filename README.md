# CargoGrid OS

CargoGrid OS is a React/Vite landing page, questionnaire flow, and admin portal backed by Supabase.

## Run Locally

**Prerequisites:** Node.js and a Supabase project.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project and run `supabase_migration.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and set:
   ```bash
   VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   APP_URL="http://localhost:3000"
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

Set these environment variables in Vercel Project Settings before deploying:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `APP_URL`

The browser app only needs the Supabase anon key. Do **not** expose a Supabase service-role key in Vercel frontend environment variables.

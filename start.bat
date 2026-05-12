@echo off
REM ClubPilot Development Server Startup Script

echo Starting ClubPilot development server...
echo.
echo Make sure you have:
echo 1. Created .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
echo 2. Run: npm install
echo.

if not exist ".env.local" (
  echo.
  echo Error: .env.local file not found
  echo Please copy .env.local.example to .env.local and fill in your Supabase credentials
  exit /b 1
)

set APP_PORT=3000
npm run dev

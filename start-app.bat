@echo off
REM Starts the Next.js dev server for the portfolio_claude app on a fixed port
REM so it doesn't collide with other projects' dev servers (e.g. port 3000).
cd /d "%~dp0web"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting portfolio_claude dev server at http://localhost:3210 ...
call npm run dev -- -p 3210

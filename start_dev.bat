@echo off
echo Running system verification...
python verify_system.py

if %ERRORLEVEL% NEQ 0 (
    echo System verification failed! Please fix issues before continuing.
    pause
    exit /b 1
)

echo Starting development servers...

:: Start backend
start cmd /k "cd backend && npm run dev"

:: Wait a moment for backend to start
timeout /t 5

:: Start frontend
start cmd /k "npm run dev"

echo Development environment started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
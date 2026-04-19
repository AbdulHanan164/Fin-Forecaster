@echo off
title FinForecaster Analytics — Launcher
color 0A

echo.
echo  ================================================
echo    FinForecaster Analytics — Starting Services
echo  ================================================
echo.

:: ─── Paths ────────────────────────────────────────
set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

:: ─── Start Backend ────────────────────────────────
echo  [1/2] Starting Backend  (FastAPI on port 8000)...
start "FinForecaster Backend" cmd /k "cd /d "%BACKEND%" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Brief pause so backend gets a head start
timeout /t 2 /nobreak >nul

:: ─── Start Frontend ───────────────────────────────
echo  [2/2] Starting Frontend (Vite on port 5173)...
start "FinForecaster Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev"

:: ─── Done ─────────────────────────────────────────
echo.
echo  Both services are starting in separate windows.
echo.
echo  Backend  ^>  http://localhost:8000
echo  Frontend ^>  http://localhost:5173
echo.
echo  Close this window or press any key to exit the launcher.
echo.
pause >nul

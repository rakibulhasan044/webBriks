@echo off
echo Cleaning up corrupted Docker cache (this prevents EOF errors)...
docker system prune -f

echo.
echo Building Backend (Sequential Build to prevent memory crash)...
docker compose build backend

echo.
echo Building Frontend (Sequential Build to prevent memory crash)...
docker compose build frontend

echo.
echo Starting WebBriks Docker containers...
docker compose up -d

echo.
echo ==========================================
echo  🚀 WebBriks Stack is up and running!
echo ==========================================
echo  🌐 Frontend: http://localhost:3000
echo  ⚙️  Backend:  http://localhost:6001/api/v1
echo  📚 Swagger:  http://localhost:6001/api/v1/docs
echo  🪣  MinIO UI: http://localhost:9001 (Storage)
echo ==========================================
echo.

@REM @echo off
@REM echo Cleaning up Docker build cache (this prevents EOF errors)...
@REM docker builder prune -af

@REM echo.
@REM echo Building Backend (Sequential Build to prevent memory crash)...
@REM docker compose build backend
@REM if %errorlevel% neq 0 (
@REM     echo.
@REM     echo Backend build failed. Stopping.
@REM     pause
@REM     exit /b 1
@REM )

@REM timeout /t 5

@REM echo.
@REM echo Building Frontend (Sequential Build to prevent memory crash)...
@REM docker compose build frontend
@REM if %errorlevel% neq 0 (
@REM     echo.
@REM     echo Frontend build failed. Stopping.
@REM     pause
@REM     exit /b 1
@REM )

@REM echo.
@REM echo Starting WebBriks Docker containers...
@REM docker compose up -d

@REM echo.
@REM echo ==========================================
@REM echo  WebBriks Stack is up and running!
@REM echo ==========================================
@REM echo  Frontend: http://localhost:3000
@REM echo  Backend:  http://localhost:6001/api/v1
@REM echo  Swagger:  http://localhost:6001/api/v1/docs
@REM echo  MinIO UI: http://localhost:9001 (Storage)
@REM echo ==========================================
@REM echo.


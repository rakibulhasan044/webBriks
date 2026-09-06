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

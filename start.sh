#!/bin/bash

# Start Docker Compose
echo "Starting WebBriks Docker containers..."
docker compose up -d --build

# Print a beautiful summary
echo ""
echo "🚀 WebBriks Stack is up and running!"
echo "=========================================="
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Backend:  http://localhost:6001/api/v1"
echo "📚 Swagger:  http://localhost:6001/api/v1/docs"
echo "🪣  MinIO UI: http://localhost:9001 (Storage)"
echo "=========================================="
echo ""



# echo "Cleaning up Docker build cache (this prevents EOF errors)..."
# docker builder prune -af

# echo ""
# echo "Building Backend (Sequential Build)..."
# docker compose build backend
# if [ $? -ne 0 ]; then
#     echo ""
#     echo "Backend build failed. Stopping."
#     exit 1
# fi

# sleep 5

# echo ""
# echo "Building Frontend (Sequential Build)..."
# docker compose build frontend
# if [ $? -ne 0 ]; then
#     echo ""
#     echo "Frontend build failed. Stopping."
#     exit 1
# fi

# echo ""
# echo "Starting WebBriks Docker containers..."
# docker compose up -d

# echo ""
# echo "🚀 WebBriks Stack is up and running!"
# echo "=========================================="
# echo "🌐 Frontend: http://localhost:3000"
# echo "⚙️  Backend:  http://localhost:6001/api/v1"
# echo "📚 Swagger:  http://localhost:6001/api/v1/docs"
# echo "🪣  MinIO UI: http://localhost:9001 (Storage)"
# echo "=========================================="
# echo ""
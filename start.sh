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

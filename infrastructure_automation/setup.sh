#!/bin/bash

echo "🔧 Stopping any previous containers..."
docker-compose down

echo "🚀 Building and starting all services..."
docker-compose up --build -d

echo "✅ All services are up!"


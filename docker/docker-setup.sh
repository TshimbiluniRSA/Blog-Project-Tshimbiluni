#!/bin/bash

# Docker Setup Script for Tshimbiluni Blog Web App
# This script sets up and runs the full-stack application using Docker Compose

set -e  # Exit on any error

echo "🚀 Starting Tshimbiluni Blog Web App Docker Setup..."

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose -f docker/docker-compose.yml down --remove-orphans 2>/dev/null || true

# Remove any existing images (optional - uncomment if you want fresh builds)
# echo "🗑️  Removing existing images..."
# docker-compose -f docker/docker-compose.yml down --rmi all 2>/dev/null || true

# Build and start the services
echo "🔨 Building and starting services..."
docker-compose -f docker/docker-compose.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if backend is ready
echo "🔍 Checking backend health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:8000/api/ >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    else
        echo "⏳ Attempt $attempt/$max_attempts: Backend not ready yet..."
        sleep 2
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Backend failed to start after $max_attempts attempts"
    echo "📋 Backend logs:"
    docker-compose -f docker/docker-compose.yml logs backend
    exit 1
fi

# Check if frontend is ready
echo "🔍 Checking frontend health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5173/ >/dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    else
        echo "⏳ Attempt $attempt/$max_attempts: Frontend not ready yet..."
        sleep 2
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Frontend failed to start after $max_attempts attempts"
    echo "📋 Frontend logs:"
    docker-compose -f docker/docker-compose.yml logs frontend
    exit 1
fi

echo ""
echo "🎉 SUCCESS! All services are running!"
echo ""
echo "📱 Access your application:"
echo "   🌐 Frontend: http://localhost:5173"
echo "   🔧 Backend API: http://localhost:8000/api/"
echo "   📚 Admin Panel: http://localhost:8000/admin/"
echo ""
echo "📋 Useful commands:"
echo "   📊 View logs: docker-compose -f docker/docker-compose.yml logs"
echo "   📊 View specific service logs: docker-compose -f docker/docker-compose.yml logs [backend|frontend]"
echo "   🛑 Stop services: docker-compose -f docker/docker-compose.yml down"
echo "   🔄 Restart services: docker-compose -f docker/docker-compose.yml restart"
echo "   🔨 Rebuild: docker-compose -f docker/docker-compose.yml up --build"
echo ""
echo "Happy coding! 🚀"
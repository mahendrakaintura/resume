#!/bin/bash

# JobStation Development Setup Script
echo "🚀 Starting JobStation Development Environment..."

# Set PHP 8.2 path for this session
export PATH="/usr/local/opt/php@8.2/bin:$PATH"

# Check PHP version
echo "📋 Current PHP version:"
php -v

# Kill any existing processes on required ports
echo "🧹 Cleaning up existing processes..."
lsof -i :5173 -t | xargs kill -9 2>/dev/null || true
lsof -i :8000 -t | xargs kill -9 2>/dev/null || true

# Clear Vite cache
echo "🗑️  Clearing Vite cache..."
rm -rf node_modules/.vite 2>/dev/null || true

# Start Vite dev server in background
echo "⚡ Starting Vite dev server..."
npm run dev &

# Wait a moment for Vite to start
sleep 5

# Start Laravel artisan serve
echo "🎯 Starting Laravel server..."
php artisan serve --host=localhost --port=8000

echo "✅ Development environment is ready!"
echo "🌐 Laravel: http://localhost:8000"
echo "⚡ Vite: http://localhost:5173"

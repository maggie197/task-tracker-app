#!/bin/bash

# Task Manager Quick Start Script
# This script helps you get started quickly

echo " Task Manager App - Quick Start"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo " Error: Please run this script from the task-manager-app directory"
    exit 1
fi

echo " Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo " Failed to install backend dependencies"
    exit 1
fi
echo " Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo " Failed to install frontend dependencies"
    exit 1
fi
echo " Frontend dependencies installed"
echo ""

cd ..

echo " Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to http://localhost:3000"


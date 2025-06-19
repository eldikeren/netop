#!/bin/bash
echo "Starting Vercel build..."
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Build completed. Listing dist directory:"
ls -la dist/

echo "Build script finished." 
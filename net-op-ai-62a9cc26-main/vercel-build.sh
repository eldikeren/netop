#!/bin/bash
set -e

echo "=== Starting Vercel Build ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Installing dependencies ==="
npm install

echo "=== Building project ==="
npm run build

echo "=== Build completed ==="
echo "Contents of dist directory:"
ls -la dist/

echo "=== Build script finished successfully ===" 
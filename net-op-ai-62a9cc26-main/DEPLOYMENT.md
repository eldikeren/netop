# Vercel Deployment Guide

## Current Issue
Vercel is deploying old commit (4d628db) instead of latest (be7fea5).

## Solution
Force new deployment by creating this file.

## Configuration
- Framework: Vite
- Build Command: npm run build
- Output Directory: dist
- Node Version: 18.x

## Environment Variables Required
```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://api.netop.cloud
VITE_API_BASE_URL=https://api.netop.cloud/v1
VITE_DEV_MODE=false
``` 
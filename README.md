# NetOp AI

A modern network operations dashboard built with React, Vite, and Tailwind CSS.

## Features

- **Real-time Monitoring**: Track network incidents, sites, and devices
- **Auth0 Integration**: Secure authentication with Auth0
- **Demo Mode**: Preview the UI without authentication
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4200` to see the app.

### Demo Mode

Visit `http://localhost:4200/?demo=true` to preview the UI with sample data.

## Deployment

This app is configured for Vercel deployment with proper SPA routing support.

### Environment Variables

Set these in your Vercel project settings:

```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://api.netop.cloud
VITE_API_BASE_URL=https://api.netop.cloud/v1
VITE_DEV_MODE=false
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Radix UI, Lucide React icons
- **Routing**: React Router DOM
- **Authentication**: Auth0 SPA SDK
- **Deployment**: Vercel

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── api/           # API entities and services
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
└── utils/         # Helper functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Demo Data

The app includes comprehensive demo data for:
- Network incidents with different severities
- Multiple sites with operational status
- Network devices with performance metrics
- Notification preferences

This allows you to preview the full UI functionality without backend integration.

## License

MIT
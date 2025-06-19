# NetOp AI

A modern network operations management application with AI-powered incident detection and resolution.

## Features

- **Incident Management**: Real-time monitoring and incident tracking
- **Site Management**: Multi-site network infrastructure management
- **AI-Powered Analytics**: Intelligent incident analysis and recommendations
- **User Authentication**: Secure Auth0-based authentication
- **Real-time Notifications**: Instant alerts and status updates

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Auth0 account and application

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://api.netop.cloud

# API Configuration
VITE_API_BASE_URL=https://api.netop.cloud/v1
```

### Auth0 Setup

1. Create an Auth0 application:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new Single Page Application
   - Set the Allowed Callback URLs to `http://localhost:4200` (for development)
   - Set the Allowed Logout URLs to `http://localhost:4200`
   - Set the Allowed Web Origins to `http://localhost:4200`

2. Configure your Auth0 application:
   - Add the following scopes: `openid profile email read:incidents write:incidents`
   - Set the audience to `https://api.netop.cloud`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:4200`

### Building for Production

```bash
npm run build
```

## Architecture

This application uses:
- **React 18** with Vite for fast development
- **Auth0** for secure authentication
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation

## Backend Integration

The frontend is designed to work with a Node.js/Express backend that includes:
- Auth0 JWT validation
- RESTful API endpoints
- Real-time WebSocket connections
- Database integration

See the backend specifications in `src/components/backend/BackendSpecs.jsx` for implementation details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
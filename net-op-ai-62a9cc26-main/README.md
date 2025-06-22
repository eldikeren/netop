# NetOp AI

A modern network operations dashboard with Auth0 authentication and comprehensive monitoring capabilities.

## Features

- 🔐 **Auth0 Authentication** - Secure user authentication and authorization
- 📊 **Dashboard Overview** - Real-time network metrics and statistics
- 🚨 **Incident Management** - Track and manage network incidents
- 🏢 **Site Monitoring** - Monitor network sites and their status
- 📱 **Responsive Design** - Modern UI that works on all devices
- 🎭 **Demo Mode** - Preview the application with mock data

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd net-op-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Auth0 configuration:
```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api.com
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4200`

## Demo Mode

To preview the application without Auth0 configuration, add `?demo=true` to the URL:

```
http://localhost:4200?demo=true
```

This will activate demo mode with mock data for testing the UI.

## Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will automatically detect the Vite configuration

3. Configure environment variables in Vercel:
   - Go to your project settings
   - Add the environment variables from your `.env` file

4. Deploy:
   - Vercel will automatically build and deploy your application
   - The build command is: `npm run build`
   - The output directory is: `dist`

### Environment Variables for Production

Make sure to set these environment variables in your Vercel project:

- `VITE_AUTH0_DOMAIN` - Your Auth0 domain
- `VITE_AUTH0_CLIENT_ID` - Your Auth0 client ID  
- `VITE_AUTH0_AUDIENCE` - Your Auth0 API audience

## Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)

2. Create a new application:
   - Application Type: Single Page Application
   - Allowed Callback URLs: `http://localhost:4200, https://your-domain.vercel.app`
   - Allowed Logout URLs: `http://localhost:4200, https://your-domain.vercel.app`

3. Configure your application settings and copy the credentials to your `.env` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthProvider.jsx
│   └── ui/
├── pages/
│   ├── Home.jsx
│   ├── Incidents.jsx
│   ├── Sites.jsx
│   ├── Notifications.jsx
│   ├── Settings.jsx
│   ├── Layout.jsx
│   └── index.jsx
├── api/
│   └── entities.js
├── App.jsx
├── main.jsx
└── index.css
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 
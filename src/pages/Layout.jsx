import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { isDemoMode } from "@/api/entities";
import { 
  Home, 
  MapPin, 
  AlertCircle, 
  Bell, 
  Settings,
  Eye
} from "lucide-react";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Sites",
    url: createPageUrl("Sites"),
    icon: MapPin,
  },
  {
    title: "Incidents",
    url: createPageUrl("Incidents"),
    icon: AlertCircle,
  },
  {
    title: "Notifications",
    url: createPageUrl("Notifications"),
    icon: Bell,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const demoMode = isDemoMode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Eye className="w-4 h-4" />
            <span className="font-medium">Demo Mode Active</span>
            <span className="text-yellow-100">•</span>
            <span className="text-yellow-100">Sample data for UI preview</span>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --primary-purple: #7c3aed;
          --primary-purple-dark: #5b21b6;
          --primary-purple-light: #a855f7;
          --critical-red: #e53e3e;
          --warning-orange: #f56500;
          --caution-yellow: #eab308;
          --info-blue: #3182ce;
          --success-green: #38a169;
          --background-light: #faf5ff;
          --text-primary: #1a202c;
          --text-secondary: #718096;
          --border-light: #e2e8f0;
        }
        
        body {
          background: linear-gradient(135deg, var(--background-light) 0%, #f3e8ff 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-gradient {
          background: linear-gradient(135deg, var(--primary-purple-dark) 0%, var(--primary-purple) 100%);
        }
        
        .status-dot-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile-first responsive design */
        @media (max-width: 768px) {
          .mobile-padding {
            padding: 1rem;
          }
          
          .mobile-text {
            font-size: 0.875rem;
          }
        }

        /* Touch-friendly button sizing */
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }

        /* Smooth scrolling for mobile */
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          :root {
            --background-light: #0f172a;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --border-light: #334155;
          }
        }
      `}</style>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${demoMode ? 'pt-12' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-50">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 touch-target ${
                  isActive 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                  {item.title}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

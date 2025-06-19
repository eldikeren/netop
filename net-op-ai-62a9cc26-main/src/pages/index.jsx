import Layout from "./Layout.jsx";

import Incidents from "./Incidents";

import Notifications from "./Notifications";

import Settings from "./Settings";

import Home from "./Home";

import Sites from "./Sites";

import { ProtectedRoute } from "@/components/auth/AuthProvider";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Incidents: Incidents,
    
    Notifications: Notifications,
    
    Settings: Settings,
    
    Home: Home,
    
    Sites: Sites,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <ProtectedRoute>
            <Layout currentPageName={currentPage}>
                <Routes>            
                    <Route path="/" element={<Incidents />} />
                    <Route path="/Incidents" element={<Incidents />} />
                    <Route path="/Notifications" element={<Notifications />} />
                    <Route path="/Settings" element={<Settings />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Sites" element={<Sites />} />
                </Routes>
            </Layout>
        </ProtectedRoute>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
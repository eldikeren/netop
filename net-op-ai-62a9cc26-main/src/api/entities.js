// Placeholder entities - these will be replaced with actual API calls
// when the backend is implemented

// Demo data for UI preview
const DEMO_INCIDENTS = [
  {
    id: 'inc-001',
    title: 'Network Connectivity Issue',
    description: 'Primary router experiencing intermittent connectivity problems',
    severity: 'high',
    status: 'active',
    site_id: 'site-001',
    device_id: 'dev-001',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:20:00Z',
    assigned_to: 'admin@netop.cloud',
    priority: 'urgent',
    category: 'connectivity',
    resolution_time: null,
    tags: ['router', 'connectivity', 'urgent']
  },
  {
    id: 'inc-002',
    title: 'Server Performance Degradation',
    description: 'Application server response times increased by 300%',
    severity: 'medium',
    status: 'investigating',
    site_id: 'site-002',
    device_id: 'dev-005',
    created_at: '2024-01-15T09:15:00Z',
    updated_at: '2024-01-15T12:45:00Z',
    assigned_to: 'tech@netop.cloud',
    priority: 'high',
    category: 'performance',
    resolution_time: null,
    tags: ['server', 'performance', 'monitoring']
  },
  {
    id: 'inc-003',
    title: 'Security Alert - Unauthorized Access',
    description: 'Multiple failed login attempts detected from unknown IP',
    severity: 'critical',
    status: 'resolved',
    site_id: 'site-001',
    device_id: 'dev-003',
    created_at: '2024-01-14T16:20:00Z',
    updated_at: '2024-01-15T08:30:00Z',
    assigned_to: 'security@netop.cloud',
    priority: 'critical',
    category: 'security',
    resolution_time: '16h 10m',
    tags: ['security', 'access', 'resolved']
  },
  {
    id: 'inc-004',
    title: 'Backup System Failure',
    description: 'Automated backup process failed for the third consecutive time',
    severity: 'medium',
    status: 'active',
    site_id: 'site-003',
    device_id: 'dev-008',
    created_at: '2024-01-15T02:00:00Z',
    updated_at: '2024-01-15T11:15:00Z',
    assigned_to: 'admin@netop.cloud',
    priority: 'medium',
    category: 'backup',
    resolution_time: null,
    tags: ['backup', 'automation', 'storage']
  },
  {
    id: 'inc-005',
    title: 'DNS Resolution Issues',
    description: 'Internal DNS server not responding to queries',
    severity: 'high',
    status: 'investigating',
    site_id: 'site-002',
    device_id: 'dev-006',
    created_at: '2024-01-15T07:45:00Z',
    updated_at: '2024-01-15T13:20:00Z',
    assigned_to: 'tech@netop.cloud',
    priority: 'high',
    category: 'dns',
    resolution_time: null,
    tags: ['dns', 'resolution', 'network']
  }
];

const DEMO_SITES = [
  {
    id: 'site-001',
    name: 'Headquarters',
    location: 'New York, NY',
    status: 'operational',
    devices_count: 45,
    incidents_count: 2,
    uptime: 99.8,
    last_maintenance: '2024-01-10T14:00:00Z',
    contact_person: 'John Smith',
    contact_email: 'john.smith@company.com',
    address: '123 Business Ave, New York, NY 10001',
    timezone: 'America/New_York',
    critical_incidents: 1,
    warning_incidents: 1
  },
  {
    id: 'site-002',
    name: 'West Coast Office',
    location: 'San Francisco, CA',
    status: 'operational',
    devices_count: 32,
    incidents_count: 2,
    uptime: 99.5,
    last_maintenance: '2024-01-08T10:00:00Z',
    contact_person: 'Sarah Johnson',
    contact_email: 'sarah.johnson@company.com',
    address: '456 Tech Street, San Francisco, CA 94105',
    timezone: 'America/Los_Angeles',
    critical_incidents: 0,
    warning_incidents: 2
  },
  {
    id: 'site-003',
    name: 'European Branch',
    location: 'London, UK',
    status: 'maintenance',
    devices_count: 28,
    incidents_count: 1,
    uptime: 98.9,
    last_maintenance: '2024-01-15T09:00:00Z',
    contact_person: 'Michael Brown',
    contact_email: 'michael.brown@company.com',
    address: '789 Innovation Lane, London, UK SW1A 1AA',
    timezone: 'Europe/London',
    critical_incidents: 0,
    warning_incidents: 1
  },
  {
    id: 'site-004',
    name: 'Asia Pacific Hub',
    location: 'Singapore',
    status: 'operational',
    devices_count: 38,
    incidents_count: 0,
    uptime: 99.9,
    last_maintenance: '2024-01-12T16:00:00Z',
    contact_person: 'Lisa Chen',
    contact_email: 'lisa.chen@company.com',
    address: '321 Digital Road, Singapore 018956',
    timezone: 'Asia/Singapore',
    critical_incidents: 0,
    warning_incidents: 0
  }
];

const DEMO_DEVICES = [
  {
    id: 'dev-001',
    name: 'Core Router - HQ',
    type: 'router',
    site_id: 'site-001',
    status: 'operational',
    ip_address: '192.168.1.1',
    model: 'Cisco ISR 4321',
    serial_number: 'CISCO123456',
    last_seen: '2024-01-15T14:30:00Z',
    uptime: '45 days, 12 hours',
    cpu_usage: 23,
    memory_usage: 67,
    temperature: 42,
    location: 'Server Room A'
  },
  {
    id: 'dev-002',
    name: 'Access Switch - Floor 1',
    type: 'switch',
    site_id: 'site-001',
    status: 'operational',
    ip_address: '192.168.1.10',
    model: 'Cisco Catalyst 2960',
    serial_number: 'CISCO789012',
    last_seen: '2024-01-15T14:30:00Z',
    uptime: '30 days, 8 hours',
    cpu_usage: 15,
    memory_usage: 45,
    temperature: 38,
    location: 'Floor 1 - IT Closet'
  },
  {
    id: 'dev-003',
    name: 'Firewall - HQ',
    type: 'firewall',
    site_id: 'site-001',
    status: 'operational',
    ip_address: '192.168.1.254',
    model: 'Fortinet FortiGate 60F',
    serial_number: 'FORTI345678',
    last_seen: '2024-01-15T14:30:00Z',
    uptime: '60 days, 3 hours',
    cpu_usage: 34,
    memory_usage: 78,
    temperature: 45,
    location: 'Network Operations Center'
  },
  {
    id: 'dev-004',
    name: 'Application Server',
    type: 'server',
    site_id: 'site-001',
    status: 'operational',
    ip_address: '192.168.1.100',
    model: 'Dell PowerEdge R740',
    serial_number: 'DELL901234',
    last_seen: '2024-01-15T14:30:00Z',
    uptime: '15 days, 22 hours',
    cpu_usage: 67,
    memory_usage: 89,
    temperature: 52,
    location: 'Data Center - Rack 3'
  },
  {
    id: 'dev-005',
    name: 'Database Server',
    type: 'server',
    site_id: 'site-002',
    status: 'degraded',
    ip_address: '192.168.2.50',
    model: 'HP ProLiant DL380',
    serial_number: 'HP567890',
    last_seen: '2024-01-15T14:30:00Z',
    uptime: '8 days, 5 hours',
    cpu_usage: 89,
    memory_usage: 95,
    temperature: 58,
    location: 'Server Room B'
  }
];

// Helper function to check if we're in demo mode - more robust
const isDemoMode = () => {
  try {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      return true;
    }
    
    // Check localStorage as fallback
    if (localStorage.getItem('demo_mode') === 'true') {
      return true;
    }
    
    // Check if we're in demo mode from AuthProvider context
    if (window.__DEMO_MODE__ === true) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Error checking demo mode:', error);
    return false;
  }
};

// Set demo mode globally
const setDemoMode = (enabled) => {
  try {
    if (enabled) {
      localStorage.setItem('demo_mode', 'true');
      window.__DEMO_MODE__ = true;
    } else {
      localStorage.removeItem('demo_mode');
      window.__DEMO_MODE__ = false;
    }
  } catch (error) {
    console.warn('Error setting demo mode:', error);
  }
};

// Initialize demo mode on load
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === 'true') {
    setDemoMode(true);
  }
}

export const NetworkDevice = {
  // Placeholder for network device operations
  list: async () => {
    if (isDemoMode()) {
      return DEMO_DEVICES;
    }
    throw new Error('NetworkDevice.list() - Backend not implemented yet');
  },
  get: async (id) => {
    if (isDemoMode()) {
      const device = DEMO_DEVICES.find(d => d.id === id);
      if (!device) throw new Error('Device not found');
      return device;
    }
    throw new Error('NetworkDevice.get() - Backend not implemented yet');
  }
};

export const Incident = {
  // Placeholder for incident operations
  list: async () => {
    if (isDemoMode()) {
      // Enrich incidents with site and device names
      return DEMO_INCIDENTS.map(incident => {
        const site = DEMO_SITES.find(s => s.id === incident.site_id);
        const device = DEMO_DEVICES.find(d => d.id === incident.device_id);
        
        return {
          ...incident,
          site: site ? site.name : 'Unknown Site',
          device: device ? device.name : 'Unknown Device',
          detected_at: incident.created_at // Use created_at as detected_at for demo
        };
      });
    }
    throw new Error('Incident.list() - Backend not implemented yet');
  },
  get: async (id) => {
    if (isDemoMode()) {
      const incident = DEMO_INCIDENTS.find(i => i.id === id);
      if (!incident) throw new Error('Incident not found');
      
      // Enrich with site and device names
      const site = DEMO_SITES.find(s => s.id === incident.site_id);
      const device = DEMO_DEVICES.find(d => d.id === incident.device_id);
      
      return {
        ...incident,
        site: site ? site.name : 'Unknown Site',
        device: device ? device.name : 'Unknown Device',
        detected_at: incident.created_at
      };
    }
    throw new Error('Incident.get() - Backend not implemented yet');
  },
  update: async (id, data) => {
    if (isDemoMode()) {
      console.log('Demo mode: Updating incident', id, data);
      return { success: true, message: 'Incident updated in demo mode' };
    }
    throw new Error('Incident.update() - Backend not implemented yet');
  }
};

export const NotificationPreference = {
  // Placeholder for notification preference operations
  get: async () => {
    if (isDemoMode()) {
      return {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        critical_alerts: true,
        warning_alerts: true,
        info_alerts: false,
        maintenance_notifications: true,
        weekly_reports: true
      };
    }
    throw new Error('NotificationPreference.get() - Backend not implemented yet');
  },
  update: async (preferences) => {
    if (isDemoMode()) {
      console.log('Demo mode: Updating notification preferences', preferences);
      return { success: true, message: 'Preferences updated in demo mode' };
    }
    throw new Error('NotificationPreference.update() - Backend not implemented yet');
  },
  list: async () => {
    if (isDemoMode()) {
      return [
        {
          id: 'pref-001',
          type: 'email',
          enabled: true,
          events: ['critical', 'warning', 'maintenance']
        },
        {
          id: 'pref-002',
          type: 'push',
          enabled: true,
          events: ['critical', 'warning']
        },
        {
          id: 'pref-003',
          type: 'sms',
          enabled: false,
          events: ['critical']
        }
      ];
    }
    throw new Error('NotificationPreference.list() - Backend not implemented yet');
  }
};

export const Site = {
  // Placeholder for site operations
  list: async () => {
    if (isDemoMode()) {
      return DEMO_SITES;
    }
    throw new Error('Site.list() - Backend not implemented yet');
  },
  get: async (id) => {
    if (isDemoMode()) {
      const site = DEMO_SITES.find(s => s.id === id);
      if (!site) throw new Error('Site not found');
      return site;
    }
    throw new Error('Site.get() - Backend not implemented yet');
  }
};

// User authentication will be handled by Auth0
export const User = {
  // These methods will be replaced with Auth0 SDK calls
  login: async () => {
    throw new Error('User.login() - Use AuthService.loginWithAuth0() instead');
  },
  logout: async () => {
    throw new Error('User.logout() - Use AuthService.logout() instead');
  },
  me: async () => {
    throw new Error('User.me() - Use AuthService.getCurrentUser() instead');
  }
};

// Export demo mode functions for use in other components
export { isDemoMode, setDemoMode };
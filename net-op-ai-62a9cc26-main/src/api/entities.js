// Demo data for the application
const demoIncidents = [
  {
    id: 1,
    title: "Network Connectivity Issue",
    description: "Users reporting intermittent connectivity problems",
    status: "open",
    priority: "high",
    site_id: 1,
    device_id: 1,
    created_at: "2024-01-15T10:30:00Z",
    site: "Headquarters",
    device: "Core Switch 1"
  },
  {
    id: 2,
    title: "Server Performance Degradation",
    description: "Application server response times increased by 300%",
    status: "in_progress",
    priority: "medium",
    site_id: 2,
    device_id: 3,
    created_at: "2024-01-14T14:20:00Z",
    site: "Data Center",
    device: "App Server 1"
  },
  {
    id: 3,
    title: "Security Alert - Unauthorized Access",
    description: "Multiple failed login attempts detected",
    status: "resolved",
    priority: "critical",
    site_id: 1,
    device_id: 2,
    created_at: "2024-01-13T09:15:00Z",
    site: "Headquarters",
    device: "Firewall 1"
  },
  {
    id: 4,
    title: "Backup System Failure",
    description: "Automated backup process failed for the third time",
    status: "open",
    priority: "medium",
    site_id: 2,
    device_id: 4,
    created_at: "2024-01-12T22:45:00Z",
    site: "Data Center",
    device: "Backup Server"
  },
  {
    id: 5,
    title: "DNS Resolution Issues",
    description: "Internal DNS server not responding to queries",
    status: "in_progress",
    priority: "high",
    site_id: 1,
    device_id: 5,
    created_at: "2024-01-11T16:30:00Z",
    site: "Headquarters",
    device: "DNS Server"
  }
]

const demoSites = [
  {
    id: 1,
    name: "Headquarters",
    location: "New York, NY",
    status: "online",
    device_count: 15,
    last_updated: "2024-01-15T12:00:00Z"
  },
  {
    id: 2,
    name: "Data Center",
    location: "Austin, TX",
    status: "online",
    device_count: 8,
    last_updated: "2024-01-15T11:45:00Z"
  },
  {
    id: 3,
    name: "Branch Office",
    location: "San Francisco, CA",
    status: "offline",
    device_count: 5,
    last_updated: "2024-01-15T10:30:00Z"
  },
  {
    id: 4,
    name: "Remote Site",
    location: "Chicago, IL",
    status: "online",
    device_count: 3,
    last_updated: "2024-01-15T12:15:00Z"
  }
]

const demoDevices = [
  {
    id: 1,
    name: "Core Switch 1",
    type: "switch",
    site_id: 1,
    status: "online",
    ip_address: "192.168.1.1",
    last_seen: "2024-01-15T12:00:00Z",
    site: "Headquarters"
  },
  {
    id: 2,
    name: "Firewall 1",
    type: "firewall",
    site_id: 1,
    status: "online",
    ip_address: "192.168.1.2",
    last_seen: "2024-01-15T12:00:00Z",
    site: "Headquarters"
  },
  {
    id: 3,
    name: "App Server 1",
    type: "server",
    site_id: 2,
    status: "online",
    ip_address: "10.0.1.10",
    last_seen: "2024-01-15T11:45:00Z",
    site: "Data Center"
  },
  {
    id: 4,
    name: "Backup Server",
    type: "server",
    site_id: 2,
    status: "offline",
    ip_address: "10.0.1.11",
    last_seen: "2024-01-14T22:45:00Z",
    site: "Data Center"
  },
  {
    id: 5,
    name: "DNS Server",
    type: "server",
    site_id: 1,
    status: "online",
    ip_address: "192.168.1.3",
    last_seen: "2024-01-15T12:00:00Z",
    site: "Headquarters"
  }
]

// Helper function to check if we're in demo mode
const isDemoMode = () => {
  return window.isDemoMode || localStorage.getItem('demoMode') === 'true'
}

// API functions
export const getIncidents = async () => {
  if (isDemoMode()) {
    return demoIncidents
  }
  throw new Error("Backend not implemented yet")
}

export const getSites = async () => {
  if (isDemoMode()) {
    return demoSites
  }
  throw new Error("Backend not implemented yet")
}

export const getDevices = async () => {
  if (isDemoMode()) {
    return demoDevices
  }
  throw new Error("Backend not implemented yet")
}

export const createIncident = async (incidentData) => {
  if (isDemoMode()) {
    const newIncident = {
      id: demoIncidents.length + 1,
      ...incidentData,
      created_at: new Date().toISOString(),
      status: "open"
    }
    demoIncidents.push(newIncident)
    return newIncident
  }
  throw new Error("Backend not implemented yet")
}

export const updateIncident = async (id, updates) => {
  if (isDemoMode()) {
    const index = demoIncidents.findIndex(incident => incident.id === id)
    if (index !== -1) {
      demoIncidents[index] = { ...demoIncidents[index], ...updates }
      return demoIncidents[index]
    }
    throw new Error("Incident not found")
  }
  throw new Error("Backend not implemented yet")
} 
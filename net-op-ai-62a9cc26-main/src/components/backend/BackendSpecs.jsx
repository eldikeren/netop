/**
 * NetOp AI Backend Foundation Specifications
 * This file contains the complete backend structure and implementation guide
 * Use this as a blueprint when setting up your GitHub repository
 */

export const BACKEND_STRUCTURE = {
  "/backend": {
    "package.json": {
      "name": "netop-ai-backend",
      "version": "1.0.0",
      "main": "index.js",
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "jest"
      },
      "dependencies": {
        "express": "^4.18.2",
        "express-openid-connect": "^2.17.1",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "body-parser": "^1.20.2",
        "axios": "^1.5.0",
        "jsonwebtoken": "^9.0.2",
        "jwks-client": "^3.0.1",
        "helmet": "^7.0.0",
        "morgan": "^1.10.0"
      },
      "devDependencies": {
        "nodemon": "^3.0.1",
        "jest": "^29.6.4"
      }
    },
    "index.js": `
const express = require('express');
const { auth } = require('express-openid-connect');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: \`https://\${process.env.AUTH0_DOMAIN}\`,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
};

app.use(auth(config));

// Import routes
const incidentsRoutes = require('./routes/incidents');
const sitesRoutes = require('./routes/sites');
const devicesRoutes = require('./routes/devices');
const notificationsRoutes = require('./routes/notifications');
const authRoutes = require('./routes/auth');

// API routes
app.use('/api/incidents', incidentsRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`NetOp AI Backend running on port \${PORT}\`);
});

module.exports = app;
`,
    ".env.example": `
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_AUDIENCE=https://api.netop.cloud

# Server Configuration
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# External API Configuration
NETOP_API_URL=https://api.netop.cloud/v1
NETOP_API_KEY=your-netop-api-key

# Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/netop_ai
MONGODB_URI=mongodb://localhost:27017/netop_ai

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Environment
NODE_ENV=development
`,
    "middleware/auth.js": `
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-client');

const client = jwksClient({
  jwksUri: \`https://\${process.env.AUTH0_DOMAIN}/.well-known/jwks.json\`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const requiresAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: \`https://\${process.env.AUTH0_DOMAIN}/\`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { requiresAuth };
`
  }
};

export const API_ROUTES = {
  "routes/incidents.js": `
const express = require('express');
const router = express.Router();
const { requiresAuth } = require('../middleware/auth');
const incidentsController = require('../controllers/incidentsController');

// Get all incidents with filtering
router.get('/', requiresAuth, incidentsController.getIncidents);

// Get specific incident
router.get('/:id', requiresAuth, incidentsController.getIncidentById);

// Update incident (mark as reviewed, change status)
router.put('/:id', requiresAuth, incidentsController.updateIncident);

// Mark incident as reviewed
router.post('/:id/review', requiresAuth, incidentsController.markAsReviewed);

module.exports = router;
`,
  "routes/sites.js": `
const express = require('express');
const router = express.Router();
const { requiresAuth } = require('../middleware/auth');
const sitesController = require('../controllers/sitesController');

// Get all sites user has access to
router.get('/', requiresAuth, sitesController.getSites);

// Get site details
router.get('/:id', requiresAuth, sitesController.getSiteById);

module.exports = router;
`,
  "routes/notifications.js": `
const express = require('express');
const router = express.Router();
const { requiresAuth } = require('../middleware/auth');
const notificationsController = require('../controllers/notificationsController');

// Get user notification preferences
router.get('/preferences', requiresAuth, notificationsController.getPreferences);

// Update notification preferences
router.put('/preferences', requiresAuth, notificationsController.updatePreferences);

module.exports = router;
`
};

export const CONTROLLERS = {
  "controllers/incidentsController.js": `
const incidentsService = require('../services/incidentsService');

const getIncidents = async (req, res) => {
  try {
    const { status, severity, site, limit = 20, offset = 0 } = req.query;
    const userId = req.user.sub;
    
    const filters = { status, severity, site, limit, offset };
    const incidents = await incidentsService.getIncidents(userId, filters);
    
    res.json({
      data: incidents,
      meta: {
        total: incidents.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    
    const incident = await incidentsService.getIncidentById(userId, id);
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const updateData = req.body;
    
    const updatedIncident = await incidentsService.updateIncident(userId, id, updateData);
    
    res.json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

const markAsReviewed = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    
    const updatedIncident = await incidentsService.markAsReviewed(userId, id);
    
    res.json(updatedIncident);
  } catch (error) {
    console.error('Error marking incident as reviewed:', error);
    res.status(500).json({ error: 'Failed to mark incident as reviewed' });
  }
};

module.exports = {
  getIncidents,
  getIncidentById,
  updateIncident,
  markAsReviewed
};
`
};

export const SERVICES = {
  "services/incidentsService.js": `
const axios = require('axios');

class IncidentsService {
  constructor() {
    this.netopApiUrl = process.env.NETOP_API_URL;
    this.apiKey = process.env.NETOP_API_KEY;
  }

  async getIncidents(userId, filters) {
    try {
      // Call external NetOp API
      const response = await axios.get(\`\${this.netopApiUrl}/incidents\`, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        },
        params: {
          ...filters,
          user_id: userId
        }
      });

      // Transform and enrich data
      const incidents = response.data.map(incident => ({
        ...incident,
        insight: this.generateInsight(incident)
      }));

      return incidents;
    } catch (error) {
      console.error('Error calling NetOp API:', error);
      // Fallback to mock data for development
      return this.getMockIncidents(filters);
    }
  }

  async getIncidentById(userId, incidentId) {
    try {
      const response = await axios.get(\`\${this.netopApiUrl}/incidents/\${incidentId}\`, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      return {
        ...response.data,
        insight: this.generateInsight(response.data)
      };
    } catch (error) {
      console.error('Error fetching incident details:', error);
      return this.getMockIncidentById(incidentId);
    }
  }

  generateInsight(incident) {
    // Simple rule-based insights (replace with AI service call)
    if (incident.category === 'Network Utilization' && incident.severity === 'critical') {
      return 'High network congestion detected. Consider load balancing or bandwidth upgrade.';
    }
    if (incident.category === 'Operational' && incident.device.includes('Router')) {
      return 'Router connectivity issue. Check power and network cables.';
    }
    return 'Monitoring situation. No immediate action required.';
  }

  getMockIncidents(filters) {
    // Mock data for development
    return [
      {
        id: '1',
        title: 'Network Congestion at NetOpHQ',
        site: 'NetOpHQ',
        device: 'Core Router 01',
        severity: 'critical',
        category: 'Network Utilization',
        status: 'open',
        detected_at: new Date().toISOString(),
        description: 'High bandwidth utilization detected on primary WAN link',
        insight: 'High network congestion detected. Consider load balancing or bandwidth upgrade.'
      },
      {
        id: '2',
        title: 'Server Performance Degradation',
        site: 'NetOpLabs',
        device: 'App Server 03',
        severity: 'high',
        category: 'Service Performance',
        status: 'investigating',
        detected_at: new Date(Date.now() - 3600000).toISOString(),
        description: 'Response times exceeding threshold',
        insight: 'CPU utilization spike detected. Consider scaling resources.'
      }
    ];
  }
}

module.exports = new IncidentsService();
`
};

// Export everything for easy access
export default {
  BACKEND_STRUCTURE,
  API_ROUTES,
  CONTROLLERS,
  SERVICES
};
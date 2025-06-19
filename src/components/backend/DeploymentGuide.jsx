/**
 * Deployment and Production Setup Guide for NetOp AI Backend
 * Complete guide for deploying to various cloud platforms
 */

export const DEPLOYMENT_CONFIGS = {
  "docker/Dockerfile": `
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S netop -u 1001

# Change ownership
RUN chown -R netop:nodejs /app
USER netop

EXPOSE 5000

CMD ["node", "index.js"]
`,
  "docker/docker-compose.yml": `
version: '3.8'

services:
  netop-api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: netop_ai
      POSTGRES_USER: netop
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
`,
  "kubernetes/deployment.yaml": `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: netop-api
  labels:
    app: netop-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: netop-api
  template:
    metadata:
      labels:
        app: netop-api
    spec:
      containers:
      - name: netop-api
        image: netop-ai:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: netop-secrets
              key: database-url
        - name: AUTH0_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: netop-secrets
              key: auth0-client-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: netop-api-service
spec:
  selector:
    app: netop-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer
`,
  "vercel/vercel.json": `
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
`,
  "railway/railway.toml": `
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
`,
  "heroku/Procfile": `
web: node index.js
`,
  "heroku/app.json": `
{
  "name": "netop-ai-backend",
  "description": "NetOp AI Backend API",
  "image": "heroku/nodejs",
  "addons": [
    "heroku-postgresql:hobby-dev",
    "heroku-redis:hobby-dev"
  ],
  "env": {
    "NODE_ENV": {
      "value": "production"
    },
    "AUTH0_DOMAIN": {
      "description": "Auth0 domain"
    },
    "AUTH0_CLIENT_ID": {
      "description": "Auth0 client ID"
    },
    "AUTH0_CLIENT_SECRET": {
      "description": "Auth0 client secret"
    }
  }
}
`
};

export const MONITORING_SETUP = {
  "monitoring/healthCheck.js": `
const express = require('express');
const router = express.Router();

// Basic health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Detailed health check with dependencies
router.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check database connection
    health.checks.database = await checkDatabase();
    
    // Check external API
    health.checks.netop_api = await checkNetOpAPI();
    
    // Check Redis (if using)
    health.checks.redis = await checkRedis();
    
    const allHealthy = Object.values(health.checks).every(check => check.status === 'OK');
    health.status = allHealthy ? 'OK' : 'DEGRADED';
    
    res.status(allHealthy ? 200 : 503).json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.error = error.message;
    res.status(503).json(health);
  }
});

async function checkDatabase() {
  // Implement database health check
  return { status: 'OK', responseTime: '< 50ms' };
}

async function checkNetOpAPI() {
  // Implement NetOp API health check
  return { status: 'OK', responseTime: '< 200ms' };
}

async function checkRedis() {
  // Implement Redis health check
  return { status: 'OK', responseTime: '< 10ms' };
}

module.exports = router;
`,
  "monitoring/metrics.js": `
const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: 'netop_api_'
});

// Custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'netop_api_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new promClient.Histogram({
  name: 'netop_api_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const incidentsProcessed = new promClient.Counter({
  name: 'netop_api_incidents_processed_total',
  help: 'Total number of incidents processed',
  labelNames: ['severity', 'site']
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(incidentsProcessed);

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
    
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path)
      .observe(duration);
  });
  
  next();
};

module.exports = {
  register,
  metricsMiddleware,
  incidentsProcessed
};
`
};

export const SECURITY_CONFIG = {
  "security/rateLimiting.js": `
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

// General rate limiting
const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// API rate limiting
const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 API requests per windowMs
  keyGenerator: (req) => {
    return req.user?.sub || req.ip; // Use user ID if authenticated, otherwise IP
  }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true
});

module.exports = {
  generalLimiter,
  apiLimiter,
  authLimiter
};
`,
  "security/validation.js": `
const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const incidentValidation = [
  body('title').trim().isLength({ min: 1, max: 500 }).escape(),
  body('description').optional().trim().isLength({ max: 2000 }).escape(),
  body('severity').isIn(['critical', 'high', 'medium', 'low']),
  body('category').isIn(['Network Utilization', 'Network Performance', 'Service Performance', 'Operational']),
  handleValidationErrors
];

const notificationPreferenceValidation = [
  body('category').isIn(['operational', 'network_utilization', 'performance', 'resource_utilization']),
  body('severity').isIn(['critical', 'high', 'medium', 'low']),
  body('enabled').isBoolean(),
  body('push_notifications').optional().isBoolean(),
  body('email_notifications').optional().isBoolean(),
  handleValidationErrors
];

const queryValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  query('severity').optional().isIn(['critical', 'high', 'medium', 'low']),
  query('status').optional().isIn(['open', 'investigating', 'resolved', 'closed']),
  handleValidationErrors
];

module.exports = {
  incidentValidation,
  notificationPreferenceValidation,
  queryValidation,
  handleValidationErrors
};
`
};

export default {
  DEPLOYMENT_CONFIGS,
  MONITORING_SETUP,
  SECURITY_CONFIG
};
/**
 * Database Models and Schema Definitions for NetOp AI
 * These can be used with MongoDB (Mongoose) or PostgreSQL (Sequelize/Prisma)
 */

export const MONGODB_MODELS = {
  "models/Incident.js": `
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  site: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  type: String,
  category: {
    type: String,
    enum: ['Network Utilization', 'Network Performance', 'Service Performance', 'Operational'],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'closed'],
    default: 'open'
  },
  detected_at: {
    type: Date,
    default: Date.now
  },
  resolved_at: Date,
  insight: String,
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewed_by: String,
  reviewed_at: Date,
  external_id: String, // ID from external NetOp API
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

incidentSchema.index({ site: 1, severity: 1, status: 1 });
incidentSchema.index({ detected_at: -1 });
incidentSchema.index({ external_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Incident', incidentSchema);
`,
  "models/Site.js": `
const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  site_name: {
    type: String,
    required: true,
    unique: true
  },
  region: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['healthy', 'degraded', 'critical'],
    default: 'healthy'
  },
  device_count: {
    type: Number,
    default: 0
  },
  active_incidents: {
    type: Number,
    default: 0
  },
  location: String,
  authorized_users: [String], // Auth0 user IDs
  external_id: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

siteSchema.index({ authorized_users: 1 });
siteSchema.index({ external_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Site', siteSchema);
`,
  "models/NotificationPreference.js": `
const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['operational', 'network_utilization', 'performance', 'resource_utilization'],
    required: true
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  push_notifications: {
    type: Boolean,
    default: true
  },
  email_notifications: {
    type: Boolean,
    default: false
  },
  quiet_hours_start: String,
  quiet_hours_end: String,
  sites: [String] // Site IDs this preference applies to
}, {
  timestamps: true
});

notificationPreferenceSchema.index({ user_id: 1, category: 1, severity: 1 }, { unique: true });

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema);
`,
  "models/User.js": `
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0_id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  full_name: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  app_settings: {
    dark_mode: {
      type: Boolean,
      default: false
    },
    auto_refresh: {
      type: Boolean,
      default: true
    },
    notifications_enabled: {
      type: Boolean,
      default: true
    },
    sound_enabled: {
      type: Boolean,
      default: true
    },
    vibration_enabled: {
      type: Boolean,
      default: true
    }
  },
  authorized_sites: [String],
  last_login: Date,
  device_tokens: [String] // For push notifications
}, {
  timestamps: true
});

userSchema.index({ auth0_id: 1 }, { unique: true });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
`
};

export const POSTGRESQL_SCHEMA = `
-- PostgreSQL Schema for NetOp AI

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  app_settings JSONB DEFAULT '{}',
  authorized_sites TEXT[],
  last_login TIMESTAMP,
  device_tokens TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) UNIQUE NOT NULL,
  region VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'critical')),
  device_count INTEGER DEFAULT 0,
  active_incidents INTEGER DEFAULT 0,
  location TEXT,
  authorized_users TEXT[],
  external_id VARCHAR(255) UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  site VARCHAR(255) NOT NULL,
  device VARCHAR(255) NOT NULL,
  type VARCHAR(255),
  category VARCHAR(100) NOT NULL CHECK (category IN ('Network Utilization', 'Network Performance', 'Service Performance', 'Operational')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  insight TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  external_id VARCHAR(255) UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('operational', 'network_utilization', 'performance', 'resource_utilization')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  enabled BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  quiet_hours_start VARCHAR(5),
  quiet_hours_end VARCHAR(5),
  sites TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, severity)
);

-- Indexes
CREATE INDEX idx_incidents_site_severity_status ON incidents(site, severity, status);
CREATE INDEX idx_incidents_detected_at ON incidents(detected_at DESC);
CREATE INDEX idx_incidents_external_id ON incidents(external_id);
CREATE INDEX idx_sites_authorized_users ON sites USING GIN(authorized_users);
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

export default {
  MONGODB_MODELS,
  POSTGRESQL_SCHEMA
};
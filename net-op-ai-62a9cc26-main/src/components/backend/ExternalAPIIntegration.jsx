/**
 * External API Integration Patterns for NetOp AI
 * Templates for integrating with real network monitoring APIs
 */

export const NETOP_API_INTEGRATION = {
  "services/netopApiService.js": `
const axios = require('axios');

class NetOpApiService {
  constructor() {
    this.baseUrl = process.env.NETOP_API_URL || 'https://api.netop.cloud/v1';
    this.apiKey = process.env.NETOP_API_KEY;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async getIncidents(filters = {}) {
    try {
      const response = await this.client.get('/incidents', {
        params: {
          status: filters.status,
          severity: filters.severity,
          site: filters.site,
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          from_date: filters.from_date,
          to_date: filters.to_date
        }
      });

      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Get Incidents:', error.response?.data || error.message);
      throw new Error('Failed to fetch incidents from NetOp API');
    }
  }

  async getIncidentDetails(incidentId) {
    try {
      const response = await this.client.get(\`/incidents/\${incidentId}\`);
      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Get Incident Details:', error.response?.data || error.message);
      throw new Error('Failed to fetch incident details from NetOp API');
    }
  }

  async getSites() {
    try {
      const response = await this.client.get('/sites');
      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Get Sites:', error.response?.data || error.message);
      throw new Error('Failed to fetch sites from NetOp API');
    }
  }

  async getDevices(siteId = null) {
    try {
      const params = siteId ? { site_id: siteId } : {};
      const response = await this.client.get('/devices', { params });
      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Get Devices:', error.response?.data || error.message);
      throw new Error('Failed to fetch devices from NetOp API');
    }
  }

  async getMetrics(deviceId, metricType, timeRange = '1h') {
    try {
      const response = await this.client.get(\`/devices/\${deviceId}/metrics\`, {
        params: {
          metric_type: metricType,
          time_range: timeRange
        }
      });
      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Get Metrics:', error.response?.data || error.message);
      throw new Error('Failed to fetch device metrics from NetOp API');
    }
  }

  // Webhook endpoint for real-time incident updates
  async setupWebhook(callbackUrl) {
    try {
      const response = await this.client.post('/webhooks', {
        url: callbackUrl,
        events: ['incident.created', 'incident.updated', 'incident.resolved'],
        active: true
      });
      return response.data;
    } catch (error) {
      console.error('NetOp API Error - Setup Webhook:', error.response?.data || error.message);
      throw new Error('Failed to setup webhook with NetOp API');
    }
  }
}

module.exports = new NetOpApiService();
`,
  "services/aiInsightService.js": `
const axios = require('axios');

class AIInsightService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.model = 'gpt-3.5-turbo';
  }

  async generateIncidentInsight(incident) {
    if (!this.openaiApiKey) {
      return this.generateRuleBasedInsight(incident);
    }

    try {
      const prompt = this.buildInsightPrompt(incident);
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a network operations expert. Provide concise, actionable insights for network incidents in 1-2 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': \`Bearer \${this.openaiApiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Insight Error:', error.response?.data || error.message);
      return this.generateRuleBasedInsight(incident);
    }
  }

  buildInsightPrompt(incident) {
    return \`
Network Incident Analysis:
- Site: \${incident.site}
- Device: \${incident.device}
- Type: \${incident.type}
- Category: \${incident.category}
- Severity: \${incident.severity}
- Description: \${incident.description}

Provide a brief technical insight and recommended action.
\`;
  }

  generateRuleBasedInsight(incident) {
    const insights = {
      'critical': {
        'Network Utilization': 'Critical bandwidth saturation detected. Immediate traffic analysis and load balancing required.',
        'Network Performance': 'Severe network degradation identified. Check for hardware failures or configuration issues.',
        'Service Performance': 'Critical service outage detected. Verify server status and restart services if needed.',
        'Operational': 'Critical operational failure. Immediate manual intervention required.'
      },
      'high': {
        'Network Utilization': 'High network congestion observed. Consider bandwidth upgrade or traffic optimization.',
        'Network Performance': 'Performance degradation detected. Monitor closely and prepare for intervention.',
        'Service Performance': 'Service slowdown identified. Check resource utilization and scaling options.',
        'Operational': 'Operational issue requires attention. Review logs and system status.'
      },
      'medium': {
        'Network Utilization': 'Moderate network usage increase. Continue monitoring for trends.',
        'Network Performance': 'Minor performance impact observed. Schedule maintenance if pattern continues.',
        'Service Performance': 'Service performance slightly degraded. Monitor for escalation.',
        'Operational': 'Routine operational alert. Standard monitoring procedures apply.'
      },
      'low': {
        'Network Utilization': 'Network utilization within normal ranges. Informational only.',
        'Network Performance': 'Performance metrics normal. No action required.',
        'Service Performance': 'Service operating normally. Continue routine monitoring.',
        'Operational': 'Low priority operational notice. No immediate action needed.'
      }
    };

    return insights[incident.severity]?.[incident.category] || 
           'Incident detected. Review details and monitor for changes.';
  }
}

module.exports = new AIInsightService();
`
};

export const WEBHOOK_HANDLERS = {
  "routes/webhooks.js": `
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const incidentsService = require('../services/incidentsService');

// Middleware to verify webhook signature
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-netop-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.NETOP_WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return res.status(401).json({ error: 'Missing signature or secret' });
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  next();
};

// Handle NetOp webhook events
router.post('/netop', verifyWebhookSignature, async (req, res) => {
  try {
    const { event_type, data } = req.body;
    
    switch (event_type) {
      case 'incident.created':
        await handleNewIncident(data);
        break;
      case 'incident.updated':
        await handleIncidentUpdate(data);
        break;
      case 'incident.resolved':
        await handleIncidentResolution(data);
        break;
      default:
        console.log(\`Unknown webhook event: \${event_type}\`);
    }
    
    res.status(200).json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleNewIncident(incidentData) {
  // Process new incident
  // Send push notifications to relevant users
  // Store in database
  console.log('New incident received:', incidentData);
}

async function handleIncidentUpdate(incidentData) {
  // Update incident in database
  // Notify users of changes
  console.log('Incident updated:', incidentData);
}

async function handleIncidentResolution(incidentData) {
  // Mark incident as resolved
  // Send resolution notifications
  console.log('Incident resolved:', incidentData);
}

module.exports = router;
`
};

export const PUSH_NOTIFICATIONS = {
  "services/pushNotificationService.js": `
const admin = require('firebase-admin');

class PushNotificationService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n')
        })
      });
    }
  }

  async sendIncidentNotification(incident, userTokens) {
    const message = {
      notification: {
        title: \`NetOp Alert: \${incident.severity.toUpperCase()}\`,
        body: \`\${incident.title} at \${incident.site}\`
      },
      data: {
        incident_id: incident.id,
        severity: incident.severity,
        site: incident.site,
        type: 'incident'
      },
      tokens: userTokens
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log(\`Sent \${response.successCount} notifications successfully\`);
      
      if (response.failureCount > 0) {
        console.log(\`Failed to send \${response.failureCount} notifications\`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.log(\`Failed token \${userTokens[idx]}: \${resp.error}\`);
          }
        });
      }
      
      return response;
    } catch (error) {
      console.error('Push notification error:', error);
      throw error;
    }
  }

  async subscribeToTopic(token, topic) {
    try {
      await admin.messaging().subscribeToTopic([token], topic);
      console.log(\`Subscribed token to topic: \${topic}\`);
    } catch (error) {
      console.error('Topic subscription error:', error);
      throw error;
    }
  }
}

module.exports = new PushNotificationService();
`
};

export default {
  NETOP_API_INTEGRATION,
  WEBHOOK_HANDLERS,
  PUSH_NOTIFICATIONS
};
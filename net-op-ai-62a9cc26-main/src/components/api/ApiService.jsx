import AuthService from '@/components/auth/AuthService'; // Assuming AuthService provides getAccessToken

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.netop.cloud/v1'; // Default to your production API
    // Auth0 related config is handled by AuthService
  }

  async _getAuthHeaders() {
    try {
      const accessToken = await AuthService.getAccessToken(); // Get token from Auth0 via AuthService
      if (!accessToken) {
        // This scenario should ideally be handled by AuthService redirecting to login
        // or the UI prompting for login if a token is required and missing.
        console.warn('Access token is not available. API calls may fail or be anonymous.');
        return {
          'Content-Type': 'application/json',
        };
      }
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };
    } catch (error) {
      console.error("Error getting access token for API headers:", error);
      // Fallback to Content-Type only if token retrieval fails critically
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async _request(method, endpoint, body = null) {
    const headers = await this._getAuthHeaders();
    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`API Error ${response.status}: ${errorData.message || response.statusText}`, errorData);
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      if (response.status === 204) { // No Content
        return null;
      }
      return response.json();
    } catch (error) {
      console.error(`Network or other error in API request to ${endpoint}:`, error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  // Incidents API
  async fetchIncidents(filters = {}) {
    // Example: /incidents?status=open&severity=critical&limit=20
    const queryParams = new URLSearchParams(filters).toString();
    return this._request('GET', `/incidents${queryParams ? `?${queryParams}` : ''}`);
  }

  async fetchIncidentDetails(incidentId) {
    return this._request('GET', `/incidents/${incidentId}`);
  }
  
  async updateIncidentStatus(incidentId, statusUpdate) { // e.g., { reviewed: true } or { status: "resolved" }
    return this._request('PUT', `/incidents/${incidentId}`, statusUpdate);
  }

  async markIncidentAsReviewed(incidentId) {
    return this._request('POST', `/incidents/${incidentId}/review`);
  }


  // Sites API
  async fetchSites() {
    return this._request('GET', `/sites`);
  }

  // Notification Preferences API
  async getNotificationPreferences() {
    return this._request('GET', `/users/me/notification-preferences`);
  }

  async updateNotificationPreferences(preferences) {
    return this._request('PUT', `/users/me/notification-preferences`, preferences);
  }

  // User App Settings API
  async getUserAppSettings() {
    // This might be part of a larger user profile endpoint or Auth0 custom claims
    // For now, let's assume a dedicated endpoint
    return this._request('GET', `/users/me/app-settings`);
  }

  async updateUserAppSettings(settings) {
    return this._request('PUT', `/users/me/app-settings`, settings);
  }

  // User Profile (could be part of Auth0 or a separate endpoint)
  async getUserProfile() {
    // This might be fetched directly using Auth0 SDK on frontend, 
    // or your backend might provide a /users/me endpoint that enriches Auth0 data.
    // For this example, let's assume AuthService handles direct Auth0 user profile fetching.
    try {
      return await AuthService.getCurrentUser(); // Relies on AuthService for user profile
    } catch (error) {
       console.error("Error fetching user profile via AuthService", error);
       throw error;
    }
  }

  async updateUserProfile(profileData) {
    // Updating Auth0 user profile often involves specific Auth0 Management API calls,
    // usually done from a secure backend. Frontend might update local app state
    // and backend handles Auth0 sync.
    // For this example, assuming a backend endpoint.
    return this._request('PUT', `/users/me/profile`, profileData); // Example endpoint
  }


  // Real-time WebSocket connection preparation
  initializeWebSocket(onMessageHandler) {
    // TODO: Connect to your WebSocket server for real-time incident updates
    // const socket = new WebSocket('wss://api.yournetopapp.com/ws');
    // socket.onopen = () => console.log('WebSocket connection established');
    // socket.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   onMessageHandler(message);
    // };
    // socket.onerror = (error) => console.error('WebSocket error:', error);
    // socket.onclose = () => console.log('WebSocket connection closed');
    // return socket; // Return socket instance for management (e.g., closing)
    console.log('WebSocket connection prepared for real-time incident updates. Implement with your WebSocket server.');
  }
}

export default new ApiService();
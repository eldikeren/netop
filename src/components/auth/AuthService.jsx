/**
 * Authentication Service for NetOp AI
 * Uses Auth0 for authentication
 */

import { createAuth0Client } from '@auth0/auth0-spa-js';

class AuthService {
  constructor() {
    this.auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
    this.auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    this.auth0RedirectUri = window.location.origin;
    this.auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.netop.cloud';
    this.auth0Client = null;
    this.isInitialized = false;
  }

  // Initialize Auth0 client
  async initialize() {
    if (this.isInitialized) return this.auth0Client;

    if (!this.auth0Domain || !this.auth0ClientId) {
      throw new Error('Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.');
    }

    console.log('Initializing Auth0 with:', {
      domain: this.auth0Domain,
      clientId: this.auth0ClientId,
      redirectUri: this.auth0RedirectUri,
      audience: this.auth0Audience
    });

    try {
      this.auth0Client = await createAuth0Client({
        domain: this.auth0Domain,
        clientId: this.auth0ClientId,
        redirectUri: this.auth0RedirectUri,
        audience: this.auth0Audience,
        scope: 'openid profile email read:incidents write:incidents',
        cacheLocation: 'localstorage',
        useRefreshTokens: true
      });

      // Handle the redirect callback
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        console.log('Handling Auth0 callback...');
        await this.auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      this.isInitialized = true;
      console.log('Auth0 initialized successfully');
      return this.auth0Client;
    } catch (error) {
      console.error('Failed to initialize Auth0:', error);
      throw new Error(`Auth0 initialization failed: ${error.message}`);
    }
  }

  // Login with Auth0
  async loginWithAuth0() {
    try {
      await this.initialize();
      console.log('Redirecting to Auth0 login...');
      await this.auth0Client.loginWithRedirect({
        screen_hint: 'login'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      await this.initialize();
      const user = await this.auth0Client.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      return this.mapAuth0UserToNetOpUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('User not authenticated');
    }
  }

  // Get access token
  async getAccessToken() {
    try {
      await this.initialize();
      const token = await this.auth0Client.getTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      await this.initialize();
      await this.auth0Client.logout({
        returnTo: window.location.origin
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      await this.initialize();
      return await this.auth0Client.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Map Auth0 user to NetOp user format
  mapAuth0UserToNetOpUser(auth0User) {
    return {
      id: auth0User.sub,
      email: auth0User.email,
      full_name: auth0User.name,
      role: auth0User['https://netop.cloud/roles']?.[0] || 'user',
      auth_provider: 'auth0',
      auth0_user: auth0User,
      picture: auth0User.picture
    };
  }

  // Handle Auth0 callback (called automatically during initialization)
  async handleAuth0Callback() {
    await this.initialize();
    // The callback is handled in the initialize method
  }

  // Get user profile
  async getUserProfile() {
    return await this.getCurrentUser();
  }

  // Update user profile (this would typically be done through Auth0 Management API from backend)
  async updateUserProfile(profileData) {
    // This is a placeholder - actual implementation would require backend integration
    console.warn('Profile updates should be handled through the backend Auth0 Management API');
    throw new Error('Profile updates not implemented - requires backend integration');
  }
}

export default new AuthService();
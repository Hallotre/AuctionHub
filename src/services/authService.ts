import api from './api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse
} from '../types/api';

export const authService = {
  // Register a new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // Store token and user data
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      // Create API key after successful registration
      await this.createApiKey();
    }
    
    return response.data;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      // Create API key after successful login
      await this.createApiKey();
    }
    
    return response.data;
  },

  // Create API key
  async createApiKey(): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await api.post('/auth/create-api-key', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.data?.key) {
        localStorage.setItem('apiKey', response.data.data.key);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      // Don't throw error - app can still work without API key for some endpoints
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('apiKey');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Get API key
  getApiKey(): string | null {
    return localStorage.getItem('apiKey');
  }
}; 
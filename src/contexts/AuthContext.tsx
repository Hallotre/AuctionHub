import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import type { LoginCredentials, RegisterData } from '../types/api';
import { AuthContext, type AuthContextType } from './AuthContextDefinition';

interface User {
  name: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
    alt: string;
  };
  banner?: {
    url: string;
    alt: string;
  };
  credits?: number;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    const apiKey = authService.getApiKey();
    
    if (currentUser && token) {
      setUser(currentUser);
      
      // If no API key exists, try to create one
      if (!apiKey) {
        authService.createApiKey().then(() => {
          // After creating API key, fetch profile
          fetchUserProfile(currentUser.name);
        });
      } else {
        // API key exists, fetch profile
        fetchUserProfile(currentUser.name);
      }
    } else if (currentUser && !token) {
      console.warn('User found but no token - this should not happen');
      // Clear invalid user data
      authService.logout();
    }
    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (username: string) => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        console.warn('No auth token available, skipping profile fetch');
        return;
      }
      
      const response = await profileService.getProfileByName(username);
      
      setUser(prevUser => ({
        ...prevUser!,
        credits: response.data.credits,
        bio: response.data.bio,
        avatar: response.data.avatar,
        banner: response.data.banner
      }));
      
    } catch (error: unknown) {
      // Handle 403 errors specifically
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 403) {
        console.warn('Profile API access forbidden - this is likely due to missing or invalid API key');
        console.warn('User will continue with default credits (1000)');
        
        // Set default credits if we can't fetch from API
        setUser(prevUser => ({
          ...prevUser!,
          credits: prevUser?.credits || 1000
        }));
        return;
      }
      // Handle other errors
      console.warn('Failed to fetch updated profile data:', error);
      
      // Set default credits on any error
      setUser(prevUser => ({
        ...prevUser!,
        credits: prevUser?.credits || 1000
      }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const userData = response.data;
      
      setUser(userData);
      
      // Fetch updated profile data after login
      await fetchUserProfile(userData.name);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      const newUser = response.data;
      
      setUser(newUser);
      
      // Fetch updated profile data after registration
      await fetchUserProfile(newUser.name);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserCredits = (newCredits: number) => {
    setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.name);
    }
  };

  const createApiKey = async () => {
    try {
      await authService.createApiKey();
      // Refresh profile after creating API key
      if (user) {
        await fetchUserProfile(user.name);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserCredits,
    refreshUserProfile,
    createApiKey,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
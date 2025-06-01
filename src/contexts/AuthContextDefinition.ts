import { createContext } from 'react';
import type { LoginCredentials, RegisterData } from '../types/api';

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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserCredits: (newCredits: number) => void;
  refreshUserProfile: () => Promise<void>;
  createApiKey: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 
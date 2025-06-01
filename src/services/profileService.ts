import api from './api';
import type { 
  Profile, 
  UpdateProfileData, 
  Listing,
  Bid,
  ApiResponse 
} from '../types/api';

export const profileService = {
  // Get all profiles
  async getAllProfiles(params?: {
    page?: number;
    limit?: number;
    _listings?: boolean;
    _wins?: boolean;
  }): Promise<ApiResponse<Profile[]>> {
    const response = await api.get<ApiResponse<Profile[]>>('/auction/profiles', {
      params
    });
    return response.data;
  },

  // Get single profile by name
  async getProfileByName(name: string, params?: {
    _listings?: boolean;
    _wins?: boolean;
  }): Promise<ApiResponse<Profile>> {
    const response = await api.get<ApiResponse<Profile>>(`/auction/profiles/${name}`, {
      params
    });
    return response.data;
  },

  // Update profile
  async updateProfile(name: string, profileData: UpdateProfileData): Promise<ApiResponse<Profile>> {
    const response = await api.put<ApiResponse<Profile>>(`/auction/profiles/${name}`, profileData);
    return response.data;
  },

  // Get listings by profile
  async getListingsByProfile(name: string, params?: {
    page?: number;
    limit?: number;
    _seller?: boolean;
    _bids?: boolean;
  }): Promise<ApiResponse<Listing[]>> {
    const response = await api.get<ApiResponse<Listing[]>>(`/auction/profiles/${name}/listings`, {
      params
    });
    return response.data;
  },

  // Get bids by profile
  async getBidsByProfile(name: string, params?: {
    page?: number;
    limit?: number;
    _listings?: boolean;
  }): Promise<ApiResponse<Bid[]>> {
    const response = await api.get<ApiResponse<Bid[]>>(`/auction/profiles/${name}/bids`, {
      params
    });
    return response.data;
  },

  // Get wins by profile
  async getWinsByProfile(name: string, params?: {
    page?: number;
    limit?: number;
    _seller?: boolean;
    _bids?: boolean;
  }): Promise<ApiResponse<Listing[]>> {
    const response = await api.get<ApiResponse<Listing[]>>(`/auction/profiles/${name}/wins`, {
      params
    });
    return response.data;
  },

  // Search profiles
  async searchProfiles(query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Profile[]>> {
    const response = await api.get<ApiResponse<Profile[]>>('/auction/profiles/search', {
      params: {
        q: query,
        ...params
      }
    });
    return response.data;
  }
}; 
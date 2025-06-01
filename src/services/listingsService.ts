import api from './api';
import type { 
  Listing, 
  CreateListingData, 
  CreateBidData, 
  ApiResponse 
} from '../types/api';

export const listingsService = {
  // Get all listings
  async getAllListings(params?: {
    page?: number;
    limit?: number;
    _seller?: boolean;
    _bids?: boolean;
    _active?: boolean;
    _tag?: string;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Listing[]>> {
    const response = await api.get<ApiResponse<Listing[]>>('/auction/listings', {
      params
    });
    return response.data;
  },

  // Get single listing by ID
  async getListingById(id: string, params?: {
    _seller?: boolean;
    _bids?: boolean;
  }): Promise<ApiResponse<Listing>> {
    const response = await api.get<ApiResponse<Listing>>(`/auction/listings/${id}`, {
      params
    });
    return response.data;
  },

  // Create new listing
  async createListing(listingData: CreateListingData): Promise<ApiResponse<Listing>> {
    const response = await api.post<ApiResponse<Listing>>('/auction/listings', listingData);
    return response.data;
  },

  // Update listing
  async updateListing(id: string, listingData: Partial<CreateListingData>): Promise<ApiResponse<Listing>> {
    const response = await api.put<ApiResponse<Listing>>(`/auction/listings/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    await api.delete(`/auction/listings/${id}`);
  },

  // Place bid on listing
  async placeBid(listingId: string, bidData: CreateBidData): Promise<ApiResponse<Listing>> {
    const response = await api.post<ApiResponse<Listing>>(`/auction/listings/${listingId}/bids`, bidData);
    return response.data;
  },

  // Search listings
  async searchListings(query: string, params?: {
    page?: number;
    limit?: number;
    _seller?: boolean;
    _bids?: boolean;
  }): Promise<ApiResponse<Listing[]>> {
    const response = await api.get<ApiResponse<Listing[]>>('/auction/listings/search', {
      params: {
        q: query,
        ...params
      }
    });
    return response.data;
  }
}; 
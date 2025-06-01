// Base API response structure
export interface ApiResponse<T> {
  data: T;
  meta: {
    isFirstPage?: boolean;
    isLastPage?: boolean;
    currentPage?: number;
    previousPage?: number | null;
    nextPage?: number | null;
    pageCount?: number;
    totalCount?: number;
  };
}

// Media object for images
export interface Media {
  url: string;
  alt: string;
}

// Profile model
export interface Profile {
  name: string;
  email: string;
  bio?: string;
  banner?: Media;
  avatar?: Media;
  credits: number;
  _count?: {
    listings: number;
    wins: number;
  };
  listings?: Listing[];
  wins?: Listing[];
}

// Listing model
export interface Listing {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  media?: Media[];
  created: string;
  updated: string;
  endsAt: string;
  _count?: {
    bids: number;
  };
  seller?: Profile;
  bids?: Bid[];
}

// Bid model
export interface Bid {
  id: string;
  amount: number;
  bidder: Profile;
  created: string;
}

// Auth models
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    name: string;
    email: string;
    bio?: string;
    avatar?: Media;
    banner?: Media;
    accessToken: string;
  };
  meta: Record<string, never>;
}

// Form data types
export interface CreateListingData {
  title: string;
  description?: string;
  tags?: string[];
  media?: Media[];
  endsAt: string;
}

export interface UpdateProfileData {
  bio?: string;
  avatar?: Media;
  banner?: Media;
}

export interface CreateBidData {
  amount: number;
}

// Error response
export interface ApiError {
  errors: Array<{
    message: string;
    code?: string;
  }>;
  status: string;
  statusCode: number;
} 
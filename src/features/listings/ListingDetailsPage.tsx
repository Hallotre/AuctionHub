import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listingsService } from '../../services/listingsService';
import type { Listing, CreateBidData } from '../../types/api';
import { 
  ClockIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isBidding, setIsBidding] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await listingsService.getListingById(id, {
          _seller: true,
          _bids: true
        });
        setListing(response.data);
      } catch {
        setError('Failed to load listing. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !isAuthenticated) return;

    if (isNaN(bidAmount) || bidAmount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }

    const highestBid = getHighestBid();
    if (bidAmount <= highestBid) {
      setBidError(`Bid must be higher than current highest bid (${highestBid} credits)`);
      return;
    }

    try {
      setIsBidding(true);
      setBidError(null);

      const bidData: CreateBidData = { amount: bidAmount };
      await listingsService.placeBid(id, bidData);
      
      // Refetch the complete listing data to ensure bid history is updated
      const updatedListing = await listingsService.getListingById(id, {
        _seller: true,
        _bids: true
      });
      setListing(updatedListing.data);
      setBidAmount(0);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' && err.response.data !== null &&
        'errors' in err.response.data && Array.isArray(err.response.data.errors) &&
        err.response.data.errors.length > 0 && typeof err.response.data.errors[0] === 'object' &&
        err.response.data.errors[0] !== null && 'message' in err.response.data.errors[0]
        ? err.response.data.errors[0].message
        : 'Failed to place bid. Please try again.';
      
      setBidError(errorMessage);
    } finally {
      setIsBidding(false);
    }
  };

  const formatTimeRemaining = (endsAt: string) => {
    const now = new Date();
    const endDate = new Date(endsAt);
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return 'Auction ended';
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const getHighestBid = () => {
    if (!listing?.bids || listing.bids.length === 0) {
      return 0;
    }
    return Math.max(...listing.bids.map(bid => bid.amount));
  };

  const isAuctionEnded = () => {
    if (!listing) return false;
    return new Date(listing.endsAt) <= new Date();
  };

  const getMinBidAmount = () => {
    const highestBid = getHighestBid();
    return highestBid + 1;
  };

  const formatTimeAgo = (created: string) => {
    const now = new Date();
    const createdDate = new Date(created);
    const timeDiff = now.getTime() - createdDate.getTime();

    if (timeDiff <= 0) {
      return 'just now';
    }

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          {listing.media && listing.media.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="aspect-w-16 aspect-h-12">
              <img
                  src={listing.media[selectedImageIndex].url}
                  alt={listing.media[selectedImageIndex].alt || listing.title}
                  className="object-cover w-full border border-gray-200 rounded-lg shadow-md h-96"
              />
              </div>
              
              {/* Image Thumbnails */}
              {listing.media.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-w-16 aspect-h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-emerald-500 ring-2 ring-emerald-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                      src={media.url}
                        alt={media.alt || listing.title}
                        className="object-cover w-full h-20"
                    />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full bg-gray-100 border border-gray-200 rounded-lg h-96">
              <div className="text-center">
                <PhotoIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div className="space-y-6">
          {/* Title and Basic Info */}
          <div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">{listing.title}</h1>
            
            {listing.description && (
              <p className="leading-relaxed text-gray-700">{listing.description}</p>
            )}
          </div>
            
          {/* Seller Info */}
            {listing.seller && (
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-medium text-gray-900">Seller</h3>
              <div className="flex items-center gap-3">
                {listing.seller.avatar?.url ? (
                  <img
                    src={listing.seller.avatar.url}
                    alt={listing.seller.avatar.alt || listing.seller.name}
                    className="object-cover w-10 h-10 border-2 rounded-full border-emerald-500"
                  />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <Link
                    to={`/profile/${listing.seller.name}`}
                    className="font-medium transition-colors text-emerald-600 hover:text-emerald-700"
                  >
                    {listing.seller.name}
                  </Link>
                  <p className="text-sm text-gray-600">{listing.seller.email}</p>
                </div>
              </div>
              </div>
            )}

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-900">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 text-sm text-purple-800 transition-colors bg-purple-100 rounded-full hover:bg-purple-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Current Bid and Time */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-sm text-gray-600">Current Highest Bid</p>
                <p className="flex items-center text-3xl font-bold text-emerald-600">
                  <CurrencyDollarIcon className="w-8 h-8 mr-2" />
                  {getHighestBid()}
                </p>
                <p className="mt-1 text-sm text-gray-600">{listing._count?.bids || 0} bids</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-600">Time Remaining</p>
                <p className="flex items-center text-2xl font-bold text-amber-600">
                  <ClockIcon className="w-6 h-6 mr-2" />
                  {formatTimeRemaining(listing.endsAt)}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Ends: {new Date(listing.endsAt).toLocaleDateString()} at {new Date(listing.endsAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Bidding Form */}
          {isAuthenticated && !isAuctionEnded() && (
            <form onSubmit={handlePlaceBid} className="p-6 border rounded-lg bg-emerald-50 border-emerald-200">
              <h3 className="mb-4 font-semibold text-emerald-900">Place Your Bid</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block mb-1 text-sm font-medium text-emerald-700">
                    Bid Amount (Credits)
                  </label>
                    <input
                    id="bidAmount"
                      type="number"
                    min={getMinBidAmount()}
                    value={bidAmount || ''}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 transition-colors bg-white border rounded-lg border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={`Minimum: ${getMinBidAmount()} credits`}
                      required
                    />
                  <p className="mt-1 text-xs text-emerald-600">
                    You have {user?.credits || 0} credits available
                  </p>
                </div>

                {bidError && (
                  <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                    {bidError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBidding || isAuctionEnded()}
                  className="flex items-center justify-center w-full px-6 py-3 font-semibold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBidding ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Placing Bid...
                    </>
                  ) : (
                    `Place Bid - ${bidAmount || 0} Credits`
                  )}
                </button>
              </div>
              </form>
          )}

          {/* Auction Ended Message */}
          {isAuctionEnded() && (
            <div className="p-6 text-center bg-gray-100 border border-gray-200 rounded-lg">
              <h3 className="mb-2 font-semibold text-gray-900">Auction Ended</h3>
              <p className="text-gray-600">This auction has concluded.</p>
              {getHighestBid() > 0 && (
                <p className="mt-2 font-medium text-emerald-600">
                  Final bid: {getHighestBid()} credits
                </p>
              )}
            </div>
          )}

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="p-6 text-center border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-semibold text-gray-900">Want to Bid?</h3>
              <p className="mb-4 text-gray-600">Sign in to place bids on this auction.</p>
              <div className="flex justify-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2 font-medium text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 font-medium text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid History */}
      <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Bid History</h2>
        
        {listing.bids && listing.bids.length > 0 ? (
          <div className="space-y-3">
            {listing.bids
              .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
              .map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {bid.bidder?.avatar?.url ? (
                      <img
                        src={bid.bidder.avatar.url}
                        alt={bid.bidder.avatar.alt || bid.bidder.name}
                        className="object-cover w-10 h-10 border-2 rounded-full border-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600">
                        <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {bid.bidder?.name || 'Anonymous'}
                        {index === 0 && (
                          <span className="px-2 py-1 ml-2 text-xs text-white rounded-full bg-emerald-600">
                            Highest Bid
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTimeAgo(bid.created)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      index === 0 ? 'text-emerald-600' : 'text-gray-700'
                    }`}>
                      {bid.amount} credits
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 text-gray-400">
              <ClockIcon className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">No bids yet. Be the first to bid!</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ListingDetailsPage; 
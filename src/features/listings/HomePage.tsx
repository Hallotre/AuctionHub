import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingsService } from '../../services/listingsService';
import type { Listing } from '../../types/api';
import { 
  ClockIcon, 
  EyeIcon, 
  FireIcon, 
  TrophyIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await listingsService.getAllListings({
          _seller: true,
          _bids: true,
          _active: true,
          limit: 8,
          sort: 'created',
          sortOrder: 'desc'
        });
        setListings(response.data);
      } catch {
        setError('Failed to load listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

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
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getHighestBid = (listing: Listing) => {
    if (!listing.bids || listing.bids.length === 0) {
      return 0;
    }
    return Math.max(...listing.bids.map(bid => bid.amount));
  };

  const categories = [
    { name: 'Electronics', icon: '📱', count: '250+ items' },
    { name: 'Art & Collectibles', icon: '🎨', count: '180+ items' },
    { name: 'Fashion', icon: '👗', count: '320+ items' },
    { name: 'Home & Garden', icon: '🏠', count: '150+ items' },
    { name: 'Sports', icon: '⚽', count: '90+ items' },
    { name: 'Books', icon: '📚', count: '200+ items' }
  ];

  const stats = [
    { label: 'Active Auctions', value: '1,234', icon: FireIcon },
    { label: 'Happy Bidders', value: '5,678', icon: UserGroupIcon },
    { label: 'Total Bids', value: '23,456', icon: ChartBarIcon },
    { label: 'Items Sold', value: '9,876', icon: TrophyIcon }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary bg-emerald-600 hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-800 text-white py-16 px-4 sm:px-6 rounded-xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Welcome to AuctionHub</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover <span className="text-emerald-400">Unique</span> Treasures
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-slate-200 max-w-2xl mx-auto">
            Join thousands of bidders in exciting auctions. Find rare items, great deals, and hidden gems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link 
              to="/search" 
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg"
            >
              Start Bidding
            </Link>
            <Link 
              to="/register" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Join Free - Get 1000 Credits
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our diverse range of auction categories and find exactly what you're looking for.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/search?tag=${encodeURIComponent(category.name)}`}
              className="group bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Auctions</h2>
            <p className="text-gray-600">Don't miss out on these trending auctions ending soon!</p>
          </div>
          <Link 
            to="/search" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
          >
            View all auctions
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 mb-6">No active auctions at the moment.</p>
            <Link to="/create-listing" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all">
              Create the first listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="group border border-transparent hover:border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
                {/* Image Container */}
                <div className="relative overflow-hidden flex-shrink-0">
                  {listing.media && listing.media.length > 0 ? (
                    <img
                      src={listing.media[0].url}
                      alt={listing.media[0].alt || listing.title}
                      className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <EyeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-500 text-sm font-medium">No Image Available</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      ✨ Featured
                    </div>
                  </div>

                  {/* Quick Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex justify-between items-center text-white text-sm">
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <UserGroupIcon className="w-4 h-4" />
                        <span className="font-semibold">{listing._count?.bids || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <ClockIcon className="w-4 h-4" />
                        <span className="font-semibold">{formatTimeRemaining(listing.endsAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* Title and Description */}
                  <div className="flex-shrink-0">
                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200 leading-tight min-h-[2.5rem]">
                      {listing.title}
                    </h3>
                    
                    <div className="h-10 mt-2">
                      {listing.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {listing.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 flex-shrink-0 h-6">
                    {listing.seller && (
                      <>
                        <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 truncate">
                          by <span className="font-semibold text-gray-800">{listing.seller.name}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price and Bid Info */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-3 rounded-xl flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Current Bid</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                          <span className="text-xl font-bold text-emerald-700">{getHighestBid(listing)}</span>
                          <span className="text-xs text-emerald-600 font-medium">credits</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Total Bids</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xl font-bold text-purple-700">{listing._count?.bids || 0}</span>
                          <TrophyIcon className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-amber-700 text-sm">{formatTimeRemaining(listing.endsAt)}</span>
                    <span className="text-xs text-amber-600">remaining</span>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-2">
                    <Link
                      to={`/listing/${listing.id}`}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View & Bid Now
                      <SparklesIcon className="w-3 h-3 ml-2 opacity-70" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-800 text-white py-12 px-6 rounded-xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Auction Journey?</h2>
          <p className="text-lg mb-8 text-slate-200">Join thousands of satisfied buyers and sellers. Start bidding or create your first listing today!</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/create-listing" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Sell Your Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
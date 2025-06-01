import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listingsService } from '../../services/listingsService';
import type { Listing } from '../../types/api';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon,
  UserGroupIcon,
  UserIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const itemsPerPage = 50;

  const fetchListings = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
      setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      let response;
      if (searchQuery.trim()) {
        response = await listingsService.searchListings(searchQuery, {
          _seller: true,
          _bids: true,
          limit: itemsPerPage,
          page: page
        });
      } else {
        response = await listingsService.getAllListings({
          _seller: true,
          _bids: true,
          _active: true,
          _tag: selectedTag || undefined,
          limit: itemsPerPage,
          page: page,
          sort: sortBy,
          sortOrder
        });
      }

      let filteredListings = response.data;

      // Apply tag filter for search results
      if (searchQuery.trim() && selectedTag) {
        filteredListings = filteredListings.filter(listing => 
          listing.tags?.includes(selectedTag)
        );
      }

      // Apply sorting for search results
      if (searchQuery.trim()) {
        filteredListings.sort((a, b) => {
          let aValue: string | Date, bValue: string | Date;
          
          switch (sortBy) {
            case 'created':
              aValue = new Date(a.created);
              bValue = new Date(b.created);
              break;
            case 'endsAt':
              aValue = new Date(a.endsAt);
              bValue = new Date(b.endsAt);
              break;
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            default:
              aValue = new Date(a.created);
              bValue = new Date(b.created);
          }

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      // Update listings based on whether we're appending or replacing
      if (append) {
        setListings(prev => [...prev, ...filteredListings]);
      } else {
      setListings(filteredListings);
      }

      // Check if there are more pages
      const hasMore = response.meta?.nextPage !== null && filteredListings.length === itemsPerPage;
      setHasMorePages(hasMore);

      // Extract unique tags from all current listings
      if (!append) {
        const tags = new Set<string>();
        filteredListings.forEach(listing => {
          listing.tags?.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags).sort());
      }

    } catch {
      setError('Failed to load listings. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    fetchListings(1, false);
  }, [fetchListings]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchListings(nextPage, true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (sortBy !== 'created') params.set('sort', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('created');
    setSortOrder('desc');
    setSelectedTag('');
    setCurrentPage(1);
    setHasMorePages(true);
    setSearchParams({});
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

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h`;
    }
  };

  const getHighestBid = (listing: Listing) => {
    if (!listing.bids || listing.bids.length === 0) {
      return 0;
    }
    return Math.max(...listing.bids.map(bid => bid.amount));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  } else if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => fetchListings(1, false)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Auctions</h1>
        <p className="text-gray-600">Discover and bid on exciting auction listings</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Search auctions..."
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-2 sm:gap-3">
            <button
              type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex-1 sm:flex-none"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
            </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="created">Date Created</option>
                    <option value="endsAt">End Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Categories</option>
                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={updateSearchParams}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex-1 sm:flex-none"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedTag || sortBy !== 'created' || sortOrder !== 'desc') && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-800 text-xs sm:text-sm rounded-full">
                <span className="truncate max-w-[120px] sm:max-w-none">Search: "{searchQuery}"</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    updateSearchParams();
                  }}
                  className="hover:text-emerald-600 flex-shrink-0"
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm rounded-full">
                <span className="truncate max-w-[100px] sm:max-w-none">Category: {selectedTag}</span>
                <button
                  onClick={() => {
                    setSelectedTag('');
                    updateSearchParams();
                  }}
                  className="hover:text-purple-600 flex-shrink-0"
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </span>
            )}
            {(sortBy !== 'created' || sortOrder !== 'desc') && (
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm rounded-full">
                Sort: {sortBy} ({sortOrder})
                <button
                  onClick={() => {
                    setSortBy('created');
                    setSortOrder('desc');
                    updateSearchParams();
                  }}
                  className="hover:text-amber-600 flex-shrink-0"
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
          {/* Results Count */}
          <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
            {hasMorePages && (
              <span className="text-gray-500"> (more available)</span>
            )}
            </p>
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No listings found matching your criteria.</p>
            <button onClick={clearFilters} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="group border border-transparent hover:border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative overflow-hidden flex-shrink-0">
                    {listing.media && listing.media.length > 0 ? (
                      <img
                        src={listing.media[0].url}
                        alt={listing.media[0].alt || listing.title}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                          <span className="text-gray-500 text-xs sm:text-sm font-medium">No Image Available</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Stats Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex justify-between items-center text-white text-xs sm:text-sm">
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-semibold">{listing._count?.bids || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-semibold">{formatTimeRemaining(listing.endsAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-3 space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
                    {/* Title and Description */}
                    <div className="flex-shrink-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200 leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
                        {listing.title}
                      </h3>
                      
                      <div className="h-8 sm:h-10 mt-1 sm:mt-2">
                        {listing.description && (
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                            {listing.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex-shrink-0 h-6">
                      {listing.tags && listing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {listing.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-medium truncate max-w-[60px] sm:max-w-[80px]"
                            >
                              {tag}
                            </span>
                          ))}
                          {listing.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              +{listing.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 flex-shrink-0 h-5">
                      {listing.seller && (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                            <UserIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 truncate">
                            by <span className="font-semibold text-gray-800">{listing.seller.name}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Price and Bid Info */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Current Bid</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <CurrencyDollarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            <span className="text-base sm:text-lg font-bold text-emerald-700">{getHighestBid(listing)}</span>
                            <span className="text-xs text-emerald-600 font-medium">credits</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">Bids</p>
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            <span className="text-base sm:text-lg font-bold text-purple-700">{listing._count?.bids || 0}</span>
                            <TrophyIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                      <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                      <span className="font-semibold text-amber-700 text-xs sm:text-sm">{formatTimeRemaining(listing.endsAt)}</span>
                      <span className="text-xs text-amber-600">remaining</span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-1 sm:pt-2">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 sm:py-3 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md text-xs sm:text-sm"
                      >
                        <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        View Details
                        <SparklesIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-2 opacity-70" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePages && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 inline-block mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Listings'
                  )}
                </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default SearchPage; 
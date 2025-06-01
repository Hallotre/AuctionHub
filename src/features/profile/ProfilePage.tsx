import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import type { Profile, UpdateProfileData, Listing, Bid } from '../../types/api';
import { 
  UserCircleIcon, 
  CreditCardIcon, 
  TrophyIcon, 
  ListBulletIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowUpIcon,
  Cog6ToothIcon,
  HomeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Extended Bid interface for when _listings is included
interface BidWithListing extends Bid {
  listing?: Listing;
}

type TabType = 'overview' | 'dashboard' | 'bids' | 'listings' | 'settings';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [userBids, setUserBids] = useState<BidWithListing[]>([]);
  const [userWins, setUserWins] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    avatarUrl: '',
    bannerUrl: ''
  });

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: HomeIcon },
    { id: 'dashboard' as TabType, name: 'Analytics', icon: ChartBarIcon },
    { id: 'bids' as TabType, name: 'Bid History', icon: BanknotesIcon },
    { id: 'listings' as TabType, name: 'My Listings', icon: ListBulletIcon },
    { id: 'settings' as TabType, name: 'Settings', icon: Cog6ToothIcon },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.name) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile data
        const profileResponse = await profileService.getProfileByName(user.name, {
          _listings: true,
          _wins: true
        });
        setProfile(profileResponse.data);
        setEditForm({
          bio: profileResponse.data.bio || '',
          avatarUrl: profileResponse.data.avatar?.url || '',
          bannerUrl: profileResponse.data.banner?.url || ''
        });

        // Fetch detailed listings data for analytics
        try {
          const listingsResponse = await profileService.getListingsByProfile(user.name, {
            limit: 50,
            _seller: true,
            _bids: true
          });
          setUserListings(listingsResponse.data);
        } catch (error) {
          console.warn('Failed to load user listings:', error);
        }

        // Fetch user bids for bidding analytics (with listing data)
        try {
          const bidsResponse = await profileService.getBidsByProfile(user.name, {
            limit: 50,
            _listings: true
          });
          setUserBids(bidsResponse.data as BidWithListing[]);
        } catch (error) {
          console.warn('Failed to load user bids:', error);
        }

        // Fetch user wins
        try {
          const winsResponse = await profileService.getWinsByProfile(user.name, {
            limit: 50,
            _seller: true,
            _bids: true
          });
          setUserWins(winsResponse.data);
        } catch (error) {
          console.warn('Failed to load user wins:', error);
        }

      } catch (error) {
        console.warn('Failed to load profile, using auth context data:', error);
        
        // Check if it's a 403 error (API access issue)
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 403) {
          setError('Profile data unavailable due to API access restrictions. Showing default values.');
          console.warn('Profile API access forbidden - this is likely due to missing API key');
          console.warn('User will continue with default credits and profile data');
        } else {
          setError('Failed to load profile data');
        }
        
        // Use user data from auth context as fallback
        if (user) {
          setProfile({
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
            banner: user.banner,
            credits: user.credits || 1000,
            _count: {
              listings: 0,
              wins: 0
            }
          });
          setEditForm({
            bio: user.bio || '',
            avatarUrl: user.avatar?.url || '',
            bannerUrl: user.banner?.url || ''
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.name, user]);

  const handleUpdateProfile = async () => {
    if (!user?.name) return;

    try {
      const updateData: UpdateProfileData = {
        bio: editForm.bio || undefined,
        avatar: editForm.avatarUrl ? { url: editForm.avatarUrl, alt: `${user.name}'s avatar` } : undefined,
        banner: editForm.bannerUrl ? { url: editForm.bannerUrl, alt: `${user.name}'s banner` } : undefined
      };

      const response = await profileService.updateProfile(user.name, updateData);
      setProfile(response.data);
      setIsEditing(false);
    } catch {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        bio: profile.bio || '',
        avatarUrl: profile.avatar?.url || '',
        bannerUrl: profile.banner?.url || ''
      });
    }
    setIsEditing(false);
  };

  // Dashboard Analytics Helper Functions
  const getActiveListingsCount = () => {
    const now = new Date();
    return userListings.filter(listing => new Date(listing.endsAt) > now).length;
  };

  const getExpiredListingsCount = () => {
    const now = new Date();
    return userListings.filter(listing => new Date(listing.endsAt) <= now).length;
  };

  const getTotalBidsReceived = () => {
    return userListings.reduce((total, listing) => total + (listing._count?.bids || 0), 0);
  };

  const getAverageBidsPerListing = () => {
    if (userListings.length === 0) return 0;
    return Math.round(getTotalBidsReceived() / userListings.length * 10) / 10;
  };

  const getTotalAmountBid = () => {
    return userBids.reduce((total, bid) => total + bid.amount, 0);
  };

  const getAverageBidAmount = () => {
    if (userBids.length === 0) return 0;
    return Math.round(getTotalAmountBid() / userBids.length);
  };

  const getSuccessRate = () => {
    if (userBids.length === 0) return 0;
    // Count unique listings that were won
    const uniqueWonListings = new Set(userWins.map(win => win.id));
    const uniqueBidListings = new Set(userBids.map(bid => bid.listing?.id).filter(Boolean));
    
    if (uniqueBidListings.size === 0) return 0;
    return Math.round((uniqueWonListings.size / uniqueBidListings.size) * 100);
  };

  const getRecentActivity = () => {
    const activities: Array<{ type: 'bid' | 'listing' | 'win'; data: Listing | BidWithListing; date: Date }> = [];
    
    // Add recent bids
    userBids.slice(0, 5).forEach(bid => {
      activities.push({
        type: 'bid',
        data: bid,
        date: new Date(bid.created)
      });
    });
    
    // Add recent listings
    userListings.slice(0, 3).forEach(listing => {
      activities.push({
        type: 'listing',
        data: listing,
        date: new Date(listing.created)
      });
    });
    
    // Add recent wins
    userWins.slice(0, 3).forEach(win => {
      activities.push({
        type: 'win',
        data: win,
        date: new Date(win.updated)
      });
    });
    
    // Sort by date and return recent 6
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const formatTimeRemaining = (endsAt: string) => {
    const now = new Date();
    const endDate = new Date(endsAt);
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return 'Ended';
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else {
      return `${hours}h left`;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found.</p>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 shadow-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 shadow-lg bg-gray-200 flex items-center justify-center">
                <UserCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            
            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <CreditCardIcon className="w-5 h-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">{profile.credits}</span>
                </div>
                <p className="text-sm text-gray-500">Credits</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <ListBulletIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-xl font-bold text-blue-600">{profile._count?.listings || 0}</span>
                </div>
                <p className="text-sm text-gray-500">Listings</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  <span className="text-xl font-bold text-yellow-600">{profile._count?.wins || 0}</span>
                </div>
                <p className="text-sm text-gray-500">Wins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
        {profile.bio ? (
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        ) : (
          <p className="text-gray-500 italic">No bio available.</p>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{getActiveListingsCount()}</div>
          <div className="text-sm text-gray-500">Active Auctions</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalBidsReceived()}</div>
          <div className="text-xs text-gray-500">avg {getAverageBidsPerListing()} per listing</div>
          <div className="text-sm font-medium text-gray-600">Bids Received</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{getTotalAmountBid()}</div>
          <div className="text-xs text-gray-500">avg {getAverageBidAmount()} per bid</div>
          <div className="text-sm font-medium text-gray-600">Amount Bid</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrophyIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{getSuccessRate()}%</div>
          <div className="text-xs text-gray-500">{userWins.length} wins from {userBids.length} bids</div>
          <div className="text-sm font-medium text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {getRecentActivity().length > 0 ? (
          <div className="space-y-3">
            {getRecentActivity().map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'bid' ? 'bg-blue-500' :
                  activity.type === 'win' ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}></div>
                
                <div className="flex-1 min-w-0">
                  {activity.type === 'bid' && (
                    <p className="text-sm text-gray-900">
                      Bid <span className="font-medium text-blue-600">{(activity.data as BidWithListing).amount} credits</span>
                      {(activity.data as BidWithListing).listing && (
                        <>
                          <span className="text-gray-500"> on </span>
                          <Link 
                            to={`/listing/${(activity.data as BidWithListing).listing!.id}`}
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            "{(activity.data as BidWithListing).listing!.title}"
                          </Link>
                        </>
                      )}
                      <span className="text-gray-500 text-xs ml-2">{formatTimeAgo((activity.data as BidWithListing).created)}</span>
                    </p>
                  )}
                  
                  {activity.type === 'listing' && (
                    <p className="text-sm text-gray-900">
                      Created <Link to={`/listing/${(activity.data as Listing).id}`} className="font-medium text-emerald-600 hover:underline">"{(activity.data as Listing).title}"</Link>
                      <span className="text-gray-500 text-xs ml-2">{formatTimeAgo((activity.data as Listing).created)}</span>
                    </p>
                  )}
                  
                  {activity.type === 'win' && (
                    <p className="text-sm text-gray-900">
                      Won <Link to={`/listing/${(activity.data as Listing).id}`} className="font-medium text-yellow-600 hover:underline">"{(activity.data as Listing).title}"</Link>
                      <span className="text-gray-500 text-xs ml-2">{formatTimeAgo((activity.data as Listing).updated)}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/create-listing"
            className="btn-primary flex items-center justify-center gap-2 py-3"
          >
            <PlusIcon className="w-4 h-4" />
            Create Listing
          </Link>
          <Link
            to="/search"
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            Browse Auctions
          </Link>
        </div>
      </div>
    </div>
  );

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ChartBarIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listing Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-orange-600" />
            Listing Performance
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Auctions</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-600">{getActiveListingsCount()}</span>
                <ClockIcon className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Auctions</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">{getExpiredListingsCount()}</span>
                <CheckIcon className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Bids per Listing</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{getAverageBidsPerListing()}</span>
                <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-600">Total Engagement</span>
              <span className="font-semibold text-purple-600">{getTotalBidsReceived()} bids</span>
            </div>
          </div>
        </div>

        {/* Bidding Analytics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            Bidding Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bids Placed</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{userBids.length}</span>
                <ArrowUpIcon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Bid Amount</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-600">{getAverageBidAmount()}</span>
                <CurrencyDollarIcon className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Successful Wins</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-yellow-600">{userWins.length}</span>
                <TrophyIcon className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-600">Success Rate</span>
              <span className={`font-semibold ${getSuccessRate() >= 50 ? 'text-emerald-600' : getSuccessRate() >= 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                {getSuccessRate()}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <ClockIcon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{getActiveListingsCount()}</div>
          <div className="text-xs text-gray-500">of {userListings.length} total</div>
          <div className="text-sm font-medium text-gray-600">Active Listings</div>
        </div>

        <div className="card text-center">
          <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{getTotalBidsReceived()}</div>
          <div className="text-xs text-gray-500">avg {getAverageBidsPerListing()} per listing</div>
          <div className="text-sm font-medium text-gray-600">Bids Received</div>
        </div>

        <div className="card text-center">
          <CurrencyDollarIcon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{getTotalAmountBid()}</div>
          <div className="text-xs text-gray-500">avg {getAverageBidAmount()} per bid</div>
          <div className="text-sm font-medium text-gray-600">Amount Bid</div>
        </div>

        <div className="card text-center">
          <TrophyIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{getSuccessRate()}%</div>
          <div className="text-xs text-gray-500">{userWins.length} wins from {userBids.length} bids</div>
          <div className="text-sm font-medium text-gray-600">Win Rate</div>
        </div>
      </div>
    </div>
  );

  const renderBidsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BanknotesIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Bid History</h2>
      </div>

      {userBids.length > 0 ? (
        <div className="space-y-4">
          {userBids
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            .map((bid) => (
              <div
                key={bid.id}
                className="card hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CurrencyDollarIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-blue-600">{bid.amount} credits</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatTimeAgo(bid.created)}</span>
                      </div>
                      
                      {bid.listing ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-600">Bid on</span>
                          <Link 
                            to={`/listing/${bid.listing.id}`}
                            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            "{bid.listing.title}"
                          </Link>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4" />
                            {formatTimeRemaining(bid.listing.endsAt)}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Listing details unavailable</p>
                      )}
                    </div>
                  </div>
                  
                  {bid.listing && (
                    <Link 
                      to={`/listing/${bid.listing.id}`}
                      className="ml-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Listing
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BanknotesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bids Yet</h3>
          <p className="text-gray-500 mb-6">You haven't placed any bids on auctions yet.</p>
          <Link
            to="/search"
            className="btn-primary inline-flex items-center gap-2"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            Browse Auctions
          </Link>
        </div>
      )}
    </div>
  );

  const renderListingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListBulletIcon className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{getActiveListingsCount()} active</span>
          <span>•</span>
          <span>{getExpiredListingsCount()} completed</span>
        </div>
      </div>

      {userListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="card hover:shadow-lg transition-all hover:border-emerald-300 group"
            >
              <div className="flex items-start gap-4">
                {listing.media && listing.media.length > 0 ? (
                  <img
                    src={listing.media[0].url}
                    alt={listing.media[0].alt || listing.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <EyeIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {listing.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {listing._count?.bids || 0} bids
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatTimeRemaining(listing.endsAt)}
                      </span>
                    </div>
                    
                    {getHighestBid(listing) > 0 && (
                      <div className="text-sm font-medium text-emerald-600">
                        High bid: {getHighestBid(listing)} credits
                      </div>
                    )}
                    
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      new Date(listing.endsAt) > new Date() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(listing.endsAt) > new Date() ? 'Active' : 'Ended'}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <ListBulletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Yet</h3>
          <p className="text-gray-500 mb-6">You haven't created any auction listings yet.</p>
          <Link
            to="/create-listing"
            className="btn-primary inline-flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Your First Listing
          </Link>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Cog6ToothIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      </div>

      {/* Profile Edit Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <PencilIcon className="w-4 h-4" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="input-field min-h-[120px]"
                rows={5}
                placeholder="Tell others about yourself..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={editForm.avatarUrl}
                onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner URL
              </label>
              <input
                type="url"
                value={editForm.bannerUrl}
                onChange={(e) => setEditForm({ ...editForm, bannerUrl: e.target.value })}
                className="input-field"
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdateProfile}
                className="btn-primary flex items-center gap-2"
              >
                <CheckIcon className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn-secondary flex items-center gap-2"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <p className="text-gray-900">{profile.bio || 'No bio available'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600">Member since</div>
            <div className="font-medium">Recently</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Credits</div>
            <div className="font-medium text-green-600">{profile.credits} credits</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Listings</div>
            <div className="font-medium">{profile._count?.listings || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Auctions Won</div>
            <div className="font-medium">{profile._count?.wins || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Banner */}
      <div className="relative h-32 sm:h-40 rounded-lg mb-8 overflow-hidden">
        {/* Background - always show gradient as fallback */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Banner Image - only show if URL exists and loads successfully */}
        {profile.banner?.url && (
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || 'Profile banner'}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          />
        )}
        
        {/* Text overlay with stronger background for readability */}
        <div className="absolute inset-0 flex items-end" style={{ zIndex: 2 }}>
          <div className="w-full bg-gradient-to-t from-black/50 to-transparent p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {profile.name}'s Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-0 overflow-hidden">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'bids' && renderBidsTab()}
          {activeTab === 'listings' && renderListingsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
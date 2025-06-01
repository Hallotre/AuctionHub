  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center gap-4">
            {profileData.avatar?.url ? (
              <img
                src={profileData.avatar.url}
                alt={profileData.avatar.alt || profileData.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
              </div>
            )}
            
            <div className="text-center sm:text-left lg:text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
              <p className="text-gray-600">{profileData.email}</p>
              
              {profileData.bio && (
                <p className="text-gray-700 mt-3 max-w-md">{profileData.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{profileData.credits || 0}</p>
                <p className="text-sm text-gray-600">Credits</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{profileData._count?.listings || 0}</p>
                <p className="text-sm text-gray-600">Listings</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{profileData._count?.wins || 0}</p>
                <p className="text-sm text-gray-600">Wins</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-600">{profileData._count?.bids || 0}</p>
                <p className="text-sm text-gray-600">Bids</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Profile
              </button>
              <Link
                to="/create-listing"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create Listing
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="editBio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="editBio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label htmlFor="editAvatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  id="editAvatarUrl"
                  type="url"
                  value={editData.avatarUrl}
                  onChange={(e) => setEditData({ ...editData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label htmlFor="editAvatarAlt" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar Description
                </label>
                <input
                  id="editAvatarAlt"
                  type="text"
                  value={editData.avatarAlt}
                  onChange={(e) => setEditData({ ...editData, avatarAlt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Description of your avatar"
                />
              </div>

              {updateError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {updateError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUpdateError(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User's Listings */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isOwnProfile ? 'My Listings' : `${profileData.name}'s Listings`}
              </h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {profileData.listings?.length || 0} items
              </span>
            </div>

            {profileData.listings && profileData.listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.listings.map((listing) => (
                  <div key={listing.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      {listing.media && listing.media.length > 0 ? (
                        <img
                          src={listing.media[0].url}
                          alt={listing.media[0].alt || listing.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/listing/${listing.id}`}
                          className="font-medium text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                        >
                          {listing.title}
                        </Link>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            {getHighestBid(listing)} credits
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {formatTimeRemaining(listing.endsAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isOwnProfile ? 'You haven\'t created any listings yet.' : 'No listings found.'}
                </p>
                {isOwnProfile && (
                  <Link
                    to="/create-listing"
                    className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    Create Your First Listing
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {isOwnProfile && (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/create-listing"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Listing
                </Link>
                <Link
                  to="/search"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Browse Auctions
                </Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            
            {profileData.bids && profileData.bids.length > 0 ? (
              <div className="space-y-3">
                {profileData.bids.slice(0, 5).map((bid) => (
                  <div key={bid.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        Bid <span className="font-medium text-emerald-600">{bid.amount} credits</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(bid.created)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
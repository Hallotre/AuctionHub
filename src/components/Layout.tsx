import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  HomeIcon, 
  PlusIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-lg border-b border-slate-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            
            {/* Logo Section - Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">AH</span>
                </div>
                <h1 className="text-xl font-bold text-white hidden sm:block">AuctionHub</h1>
              </Link>
            </div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden md:flex items-center justify-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
              >
                <HomeIcon className="w-4 h-4 mr-1.5" />
                Home
              </Link>
              <Link 
                to="/search" 
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-4 h-4 mr-1.5" />
                Browse
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/create-listing" 
                  className="flex items-center px-3 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-all duration-200 shadow-md"
                >
                  <PlusIcon className="w-4 h-4 mr-1.5" />
                  Create
                </Link>
              )}
            </div>

            {/* User Section - Right */}
            <div className="flex items-center justify-end space-x-3">
              
              {/* Credits Display (Desktop) */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-1 bg-amber-600 px-2.5 py-1.5 rounded-lg shadow-md">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">{user?.credits || 0}</span>
                </div>
              )}

              {/* Desktop User Actions */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-1.5">
                  <Link 
                    to="/profile" 
                    className="flex items-center lg:justify-start justify-center space-x-1.5 px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                  >
                    {user?.avatar?.url ? (
                      <img 
                        src={user.avatar.url} 
                        alt={user.avatar.alt || user.name}
                        className="w-6 h-6 rounded-full object-cover border-2 border-slate-500 flex-shrink-0"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-3 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-all duration-200 shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-600 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  Home
                </Link>
                <Link 
                  to="/search" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                  Browse Auctions
                </Link>
            </div>

              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  {/* User Info Card */}
                  <div className="bg-slate-700 rounded-lg p-4 my-4 border border-slate-600">
                    <div className="flex items-center space-x-3">
                      {user?.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.avatar.alt || user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-500"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-base font-semibold text-white">{user?.name}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <CurrencyDollarIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">{user?.credits || 0} credits</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="space-y-1">
                    <Link 
                      to="/create-listing" 
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-all shadow-md"
                    >
                      <PlusIcon className="w-5 h-5 mr-3" />
                      Create Listing
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                    >
                      <UserIcon className="w-5 h-5 mr-3" />
                      My Profile
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-4 border-t border-slate-600">
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-base font-medium text-center text-slate-200 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-base font-medium text-center bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-all shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 
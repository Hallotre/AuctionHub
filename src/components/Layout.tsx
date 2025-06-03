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
  CurrencyDollarIcon,
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
      {/* Warning Banner */}
      <div className="px-4 py-2 text-sm text-center text-white bg-amber-600">
        <div className="flex items-center justify-center gap-2 mx-auto max-w-7xl">
          <span>
            ⚠️ This site is a demonstration project and is not finished. It will not receive any further development work. ⚠️
          </span>
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b shadow-lg bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-slate-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center h-16 grid-cols-3">
            
            {/* Logo Section - Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-md bg-gradient-to-br from-emerald-500 to-teal-600">
                  <span className="text-sm font-bold text-white">AH</span>
                </div>
                <h1 className="hidden text-xl font-bold text-white sm:block">AuctionHub</h1>
              </Link>
            </div>

            {/* Desktop Navigation Links - Center */}
            <div className="items-center justify-center hidden space-x-6 md:flex">
              <Link 
                to="/" 
                className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
              >
                <HomeIcon className="w-4 h-4 mr-1.5" />
                Home
              </Link>
              <Link 
                to="/search" 
                className="flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
              >
                <MagnifyingGlassIcon className="w-4 h-4 mr-1.5" />
                Browse
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/create-listing" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700"
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
                        className="flex-shrink-0 object-cover w-6 h-6 border-2 rounded-full border-slate-500"
                      />
                    ) : (
                      <UserIcon className="flex-shrink-0 w-5 h-5" />
                    )}
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Link>
                </div>
              ) : (
                <div className="items-center hidden space-x-2 md:flex">
                  <Link 
                    to="/login" 
                    className="px-3 py-2 text-sm font-medium transition-colors rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 transition-colors rounded-lg md:hidden text-slate-200 hover:text-white hover:bg-slate-600/50"
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
          <div className="border-t shadow-xl md:hidden bg-slate-800 border-slate-600">
            <div className="px-4 py-4 space-y-2">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-base font-medium transition-all rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  Home
                </Link>
                <Link 
                  to="/search" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-base font-medium transition-all rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                  Browse Auctions
                </Link>
            </div>

              {/* Mobile User Section */}
              {isAuthenticated ? (
                <>
                  {/* User Info Card */}
                  <div className="p-4 my-4 border rounded-lg bg-slate-700 border-slate-600">
                    <div className="flex items-center space-x-3">
                      {user?.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.avatar.alt || user.name}
                          className="object-cover w-10 h-10 border-2 rounded-full border-slate-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-base font-semibold text-white">{user?.name}</p>
                        <div className="flex items-center mt-1 space-x-1">
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
                      className="flex items-center px-4 py-3 text-base font-medium text-white transition-all rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700"
                    >
                      <PlusIcon className="w-5 h-5 mr-3" />
                      Create Listing
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium transition-all rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
                    >
                      <UserIcon className="w-5 h-5 mr-3" />
                      My Profile
                    </Link>
                  </div>
                </>
              ) : (
                <div className="pt-4 space-y-2 border-t border-slate-600">
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-base font-medium text-center transition-all rounded-lg text-slate-200 hover:text-white hover:bg-slate-600/50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-base font-medium text-center text-white transition-all rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700"
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
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 
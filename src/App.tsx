import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './features/listings/HomePage';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import ProfilePage from './features/profile/ProfilePage';
import CreateListingPage from './features/listings/CreateListingPage';
import ListingDetailsPage from './features/listings/ListingDetailsPage';
import SearchPage from './features/listings/SearchPage';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      
      <Route path="/search" element={
        <Layout>
          <SearchPage />
        </Layout>
      } />

      <Route path="/listing/:id" element={
        <Layout>
          <ListingDetailsPage />
        </Layout>
      } />
      
      {/* Auth routes - redirect to home if already logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <RegisterForm />
        </PublicRoute>
      } />

      {/* Protected routes - require authentication */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/create-listing" element={
        <ProtectedRoute>
          <Layout>
            <CreateListingPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={
        <Layout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

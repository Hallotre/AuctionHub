# AuctionHub

A modern, elegant auction website built with React, TypeScript, and Tailwind CSS v4. Users can create listings, place bids, and manage their auction activities with a beautiful, responsive interface.

## Features

### 🔐 **Authentication & User Management**
- Register/login with stud.noroff.no email validation
- Protected routes with seamless authentication flow
- Automatic API key management for enhanced security

### 🏠 **Modern Homepage**
- Featured auction listings with elegant card designs
- Hero section with gradient backgrounds and modern typography
- Popular categories with visual icons
- Real-time auction statistics display
- Mobile-first responsive design

### 🔍 **Advanced Search & Browse**
- Powerful search with text and category filters
- Advanced sorting options (date, title, end time)
- Pagination with "Load More" functionality
- Real-time filter chips for active search terms
- Responsive grid layouts for all screen sizes

### 💰 **Credits & Financial Management**
- Users start with 1000 credits
- Real-time credit balance updates
- Credit transaction tracking
- Visual credit indicators throughout the interface

### 👤 **Enhanced Profile Management**
- Comprehensive profile dashboard with analytics
- Update avatar, banner, and bio with live preview
- Tabbed navigation (Overview, Analytics, Bid History, Listings, Settings)
- Personal auction statistics and performance metrics
- Responsive sidebar navigation (horizontal on mobile)

### 📊 **Profile Dashboard & Analytics**
- **Overview Tab**: Profile stats, recent activity feed, quick actions
- **Analytics Tab**: Detailed performance metrics with visual indicators
  - Active vs completed listings tracking
  - Bidding success rates and win statistics
  - Average bid amounts and listing engagement
- **Bid History**: Complete bidding timeline with status indicators
- **My Listings**: Listing management with performance data
- **Settings**: Profile customization and account management

### 📝 **Create & Manage Listings**
- Intuitive listing creation with image upload
- Tag management for better categorization
- Rich text descriptions with preview
- Auction duration settings
- Responsive form layouts

### 💸 **Advanced Bidding System**
- Place bids with real-time validation
- Comprehensive bid history with timestamps
- Winner announcements and notifications
- Bidding statistics and success tracking

### 🏆 **Auction Results & Achievements**
- View winners and completed auctions
- Personal win/loss tracking
- Success rate calculations
- Achievement badges and milestones

### 📱 **Responsive Design Excellence**
- Mobile-first approach with Tailwind CSS v4
- Consistent card layouts with uniform heights
- Hover effects and smooth animations
- Touch-friendly navigation on mobile
- Optimized typography scaling across devices

### 🎨 **Modern UI/UX Design**
- Clean, professional white navigation theme
- Gradient accents and modern color schemes
- Consistent spacing and visual hierarchy
- Loading states and error handling
- Elegant empty states with helpful messaging

### 🔒 **Security & Performance**
- Authentication-based access control
- Secure API key management
- Optimized API calls with error fallbacks
- Graceful error handling throughout the app

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (with Vite plugin)
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **API**: Noroff Auction House API v2

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- VS Code (recommended) with Tailwind CSS IntelliSense extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuctionHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Noroff API Configuration
   VITE_API_BASE_URL=https://v2.api.noroff.dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`


## Tailwind CSS v4 Setup

This project uses the latest Tailwind CSS v4 with the dedicated Vite plugin for optimal performance:

- **Installation**: `npm install tailwindcss@latest @tailwindcss/vite@latest`
- **Configuration**: Uses `@tailwindcss/vite` plugin in `vite.config.ts`
- **CSS Import**: Uses `@import "tailwindcss"` in `src/index.css`
- **No PostCSS**: PostCSS configuration is no longer needed




## User Stories Implemented

- ✅ **User Story 1**: A user with a stud.noroff.no email may register
- ✅ **User Story 2**: A registered user may login
- ✅ **User Story 3**: A registered user may logout
- ✅ **User Story 4**: A registered user may update their avatar
- ✅ **User Story 5**: A registered user may view their total credit
- ✅ **User Story 6**: A registered user may create a listing
- ✅ **User Story 7**: A registered user may add a bid to another user's listing
- ✅ **User Story 8**: A registered user may view bids made on a listing
- ✅ **User Story 9**: An unregistered user may search through listings

## Project Structure

```
AuctionHub/
├── public/                           # Static assets
│   └── vite.svg                     # Vite logo
├── src/                             # Source code
│   ├── assets/                      # Application assets
│   │   └── react.svg                # React logo
│   ├── components/                  # Shared UI components
│   │   └── Layout.tsx               # Main application layout with navigation
│   ├── contexts/                    # React contexts for state management
│   │   ├── AuthContext.tsx          # Authentication context provider
│   │   └── AuthContextDefinition.ts # Context type definitions
│   ├── features/                    # Feature-based modules
│   │   ├── auth/                    # Authentication components
│   │   │   ├── LoginForm.tsx        # User login form
│   │   │   └── RegisterForm.tsx     # User registration form
│   │   ├── listings/                # Auction listing components
│   │   │   ├── HomePage.tsx         # Homepage with featured listings
│   │   │   ├── SearchPage.tsx       # Search and browse listings
│   │   │   ├── ListingDetailsPage.tsx # Individual listing details
│   │   │   └── CreateListingPage.tsx # Create new auction listing
│   │   ├── profile/                 # User profile management
│   │   │   └── ProfilePage.tsx      # Enhanced profile with dashboard
│   │   └── profiles/                # Alternative profile components
│   │       └── ProfilePage.tsx      # Basic profile view
│   ├── hooks/                       # Custom React hooks
│   │   └── useAuth.ts               # Authentication hook
│   ├── services/                    # API service layer
│   │   ├── api.ts                   # Axios configuration and interceptors
│   │   ├── authService.ts           # Authentication API calls
│   │   ├── listingsService.ts       # Listings API calls
│   │   └── profileService.ts        # Profile API calls
│   ├── types/                       # TypeScript type definitions
│   │   └── api.ts                   # API response and data types
│   ├── utils/                       # Utility functions (currently empty)
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # Application-specific styles
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles and Tailwind imports
│   └── vite-env.d.ts                # Vite environment type definitions
├── .vscode/                         # VS Code configuration
├── dist/                            # Production build output
├── node_modules/                    # Dependencies
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template
├── LICENSE                          # MIT license
├── package.json                     # Project dependencies and scripts
├── package-lock.json                # Dependency lock file
├── README.md                        # Project documentation
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TypeScript config
├── tsconfig.node.json               # Node-specific TypeScript config
└── vite.config.ts                   # Vite build tool configuration
```

### Key Directories Explained

- **`src/features/`** - Organized by application features, each containing related components
- **`src/components/`** - Shared, reusable UI components used across features
- **`src/services/`** - API integration layer with service classes for different domains
- **`src/contexts/`** - React Context providers for global state management
- **`src/hooks/`** - Custom React hooks for reusable logic
- **`src/types/`** - TypeScript type definitions for API responses and data models

### Architecture Patterns

- **Feature-based organization** - Code grouped by business functionality
- **Service layer pattern** - Separation of API calls from UI components
- **Context pattern** - Global state management for authentication
- **Custom hooks** - Reusable stateful logic extraction
- **TypeScript-first** - Strong typing throughout the application

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Functional components with hooks
- Mobile-first responsive design
- Tailwind CSS v4 utility classes

## License

This project is licensed under the MIT License.

## Recent Improvements & Features

### 🎨 **UI/UX Enhancements**
- **Navigation Redesign**: Clean white navigation with professional styling
- **Card Uniformity**: All auction cards now have consistent heights and layouts
- **Responsive Cards**: Standardized content display with proper text truncation
- **Hover Effects**: Subtle animations and interactive elements
- **Mobile Optimization**: Touch-friendly interface with responsive breakpoints

### 📊 **Profile Dashboard**
- **Analytics Overview**: Key metrics cards showing auction performance
- **Activity Timeline**: Recent bids, listings, and wins in chronological order
- **Performance Metrics**: Success rates, averages, and engagement statistics
- **Tabbed Navigation**: Organized sections for different profile aspects

### 🔧 **Technical Improvements**
- **Authentication Fix**: Resolved token storage inconsistencies causing 401 errors
- **API Integration**: Improved error handling and fallback mechanisms
- **Loading States**: Enhanced user feedback during data fetching
- **Code Cleanup**: Removed debugging console logs for cleaner production code

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices with progressive enhancement
- **Consistent Spacing**: Uniform layouts across all screen sizes
- **Typography Scaling**: Proper text sizing for readability on all devices
- **Touch Targets**: Appropriately sized interactive elements for mobile

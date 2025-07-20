# Farmer Management System - Frontend

A modern React application built with Vite and Tailwind CSS for managing farmer data, CRP reports, and expert reviews.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ES6 Modules** - Modern JavaScript imports

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Welcome.jsx     # Welcome section
│   └── FeatureCard.jsx # Feature card component
├── pages/              # Page components
│   └── Home.jsx        # Home page
├── services/           # API services
│   └── api.js          # API functions for backend communication
├── utils/              # Utility functions and constants
│   └── constants.js    # App constants and configuration
├── App.jsx             # Main app component
└── index.css           # Global styles with Tailwind
```

## 🛠️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 API Integration

The frontend is configured to communicate with the backend API running on `http://localhost:3000`.

### Available API Services:
- **Farmer Management** - CRUD operations for farmers
- **CRP Reports** - Field executive report management
- **Expert Reviews** - Agricultural expert recommendations
- **Dashboard** - Analytics and aggregated data

## 🎨 Components

### Header Component
- Navigation menu
- Responsive design
- Mobile hamburger menu

### Feature Cards
- Reusable card component
- Hover effects
- Click handlers for navigation

### Welcome Section
- Interactive counter demo
- HMR testing functionality

## 🔧 Configuration

- **Port:** 5000 (configured in `vite.config.js`)
- **API Base URL:** `http://localhost:3000/api`
- **Tailwind CSS:** Configured for all `.jsx` files

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions

## 🚀 Development

- **Hot Module Replacement (HMR)** enabled
- **Fast refresh** for React components
- **ESLint** configuration for code quality
- **PostCSS** with Tailwind and Autoprefixer

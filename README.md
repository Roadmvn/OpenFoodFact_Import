# Supermarket Management System

This project consists of three main components:
- Web Application (Vue.js + Tailwind CSS)
- Mobile Application (React Native)
- Backend API (Node.js)

## Project Structure
```
.
├── backend/         # Node.js backend API
├── web-app/         # Vue.js web application
└── mobile-app/      # React Native mobile application
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native development environment
- MongoDB

### Installation

1. Clone the repository and install dependencies:
```bash
# Clone the repository
git clone <repository-url>
cd supermarket-management

# Install front-end dependencies
cd web-app
npm install

# Return to root directory
cd ..
```

2. Launch the front-end application:
```bash
# Navigate to web-app directory
cd web-app

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is already in use).

3. Follow the setup instructions in each component's directory for other components

## Components

### Backend API
- Node.js REST API
- JWT Authentication
- MongoDB Database
- OpenFood Facts API integration

### Web Application
- Vue.js 3
- Tailwind CSS
- Vuex for state management
- Vue Router

### Mobile Application
- React Native
- Tailwind CSS
- Redux for state management
- React Navigation

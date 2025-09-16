# Game Service Frontend

A modern web application for managing game collections built with React and Material-UI. This frontend application provides a comprehensive interface for game management, category administration, and multilingual content support.

## Project Overview

The Game Service Frontend is a React-based single-page application that serves as the user interface for a game management system. It provides intuitive tools for managing games, categories, and their associated metadata including multilingual naming support.

## Technology Stack

### Core Technologies
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **Vite 7.1.2** - Fast build tool and development server
- **Material-UI (MUI) 7.3.2** - React component library implementing Google's Material Design
- **React Router 7.9.1** - Declarative routing for React applications

### HTTP Client & Utilities
- **Axios 1.12.2** - Promise-based HTTP client for API communication
- **Emotion 11.14.0** - CSS-in-JS library for styling components

### Development Tools
- **ESLint 9.33.0** - JavaScript linting utility for code quality
- **Vite React Plugin 5.0.0** - Official Vite plugin for React development

## Features

### Game Management
- **Game Library**: Browse and view all games in a responsive grid layout
- **Game Creation**: Add new games with category selection and image upload
- **Game Editing**: Update existing game information and metadata
- **Bulk Operations**: Select and delete multiple games simultaneously
- **Search & Filter**: Find games by name or filter by category

### Category Management
- **Category Administration**: Full CRUD operations for game categories
- **Dynamic Categories**: Create, edit, and delete categories with real-time updates
- **Category Assignment**: Assign games to appropriate categories

### Multilingual Support
- **Multiple Languages**: Support for game names in different languages
- **Default Language**: Set primary language for each game
- **Language Management**: Add and manage game names across various languages

### User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Material Design**: Modern and intuitive user interface following Material Design principles
- **Navigation**: Fixed navigation bar with easy access to all major features
- **Visual Feedback**: Loading states, error handling, and success notifications

## Project Structure

```
src/
├── api/                    # API service layer
│   ├── axiosClient.js     # Axios configuration and interceptors
│   ├── categoryApi.js     # Category management endpoints
│   ├── gameApi.js         # Game management endpoints
│   ├── gameNameApi.js     # Game name management endpoints
│   └── languageApi.js     # Language management endpoints
├── components/            # Reusable UI components
│   ├── ErrorAlert.jsx    # Error display component
│   └── Navbar.jsx        # Navigation bar component
├── pages/                 # Main application pages
│   ├── CategoryManagement.jsx  # Category administration page
│   ├── GameForm.jsx       # Game creation and editing form
│   └── GameList.jsx       # Game library and listing page
├── App.jsx               # Main application component
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API server running on localhost:8080

### Installation

1. Clone the repository
```bash
git clone https://github.com/MinhAnh-IT/Game-Service---Smilegate-VN-UI.git
cd game-service-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## API Integration

The application communicates with a REST API backend through the following endpoints:

### Game Endpoints
- `GET /api/games` - Retrieve games with pagination and filtering
- `POST /api/games` - Create a new game
- `GET /api/games/{id}` - Get specific game details
- `PUT /api/games/{id}` - Update game information
- `DELETE /api/games/{id}` - Delete a single game
- `DELETE /api/games` - Delete multiple games

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/{id}` - Update category information
- `DELETE /api/categories/{id}` - Delete a category

### Game Name Endpoints
- `POST /api/games/{gameId}/names` - Add game name in specific language
- `PUT /api/games/{gameId}/names/{nameId}` - Update game name
- `DELETE /api/games/{gameId}/names/{nameId}` - Remove game name

### Language Endpoints
- `GET /api/languages` - Get all supported languages

## Configuration

### Environment Variables
The application uses the following default configuration:
- API Base URL: `http://localhost:8080/api`

### Axios Configuration
All API requests are configured through a centralized axios client with:
- Base URL configuration
- Request/response interceptors
- Error handling and response transformation

## Development Guidelines

### Code Style
- Follow ESLint configuration for consistent code formatting
- Use functional components with React Hooks
- Implement proper error handling for all API calls
- Maintain responsive design principles

### Component Structure
- Keep components focused and reusable
- Use Material-UI components consistently
- Implement proper prop validation
- Follow React best practices for state management

### API Integration
- Use the centralized API service layer
- Implement proper loading states
- Handle errors gracefully with user-friendly messages
- Validate data before sending requests

## Build and Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

### Build Optimization
- Code splitting for optimal loading performance
- Asset optimization and compression
- Tree shaking for reduced bundle size
- Modern JavaScript output for better performance

## Browser Support

The application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Lazy loading for optimal initial load time
- Efficient state management to minimize re-renders
- Optimized API calls with proper caching strategies
- Responsive images and assets

## Contributing

1. Follow the established code style and conventions
2. Write meaningful commit messages
3. Test thoroughly before submitting changes
4. Update documentation as needed
5. Ensure all ESLint rules pass

## License

This project is part of a mini project developed for Smilegate VN.

## Support

For technical support or questions about the application, please refer to the project documentation or contact the development team.

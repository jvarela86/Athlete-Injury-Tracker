# Athlete Injury Tracker

A modern React-based web application for managing athlete injury tracking data. This frontend application provides a user-friendly interface for managing athletes, injuries, and treatments with full CRUD operations and responsive design.

## 🚀 Features

- **Athlete Management**: View, add, edit, and delete athlete records
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Data**: Live updates with REST API integration
- **Interactive UI**: Bootstrap-powered components with smooth interactions
- **Form Validation**: Client-side validation for all user inputs
- **Search & Filter**: Find athletes quickly with search functionality
- **Professional Layout**: Clean, modern interface with intuitive navigation

## 🛠️ Technologies Used

- **React 18**: Frontend framework with hooks and functional components
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5**: CSS framework for responsive design
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing (if implemented)
- **CSS3**: Custom styling and animations
- **HTML5**: Semantic markup

## 📋 Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (version 14.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) for version control

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/jvarela86/Athlete-Injury-Tracker.git
cd Athlete-Injury-Tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Endpoint
Update the API base URL in your service files (typically in `src/services/api.js` or similar):
```javascript
const API_BASE_URL = 'http://localhost:5018/api';
```

### 4. Start the Development Server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## 🔧 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 📱 Application Structure

```
src/
├── components/
│   ├── athletes/
│   │   ├── AthleteList.js       # Display list of athletes
│   │   ├── AthleteForm.js       # Add/Edit athlete form
│   │   ├── AthleteDetails.js    # View athlete details
│   │   └── AthleteCard.js       # Individual athlete card
│   ├── layout/
│   │   ├── Navbar.js            # Navigation component
│   │   ├── Footer.js            # Footer component
│   │   └── Sidebar.js           # Sidebar navigation
│   └── common/
│       ├── LoadingSpinner.js    # Loading indicator
│       └── ErrorMessage.js      # Error display component
├── services/
│   └── api.js                   # API service functions
├── pages/
│   ├── Athletes.js              # Athletes page
│   ├── Injuries.js              # Injuries page (future)
│   ├── Treatments.js            # Treatments page (future)
│   └── Home.js                  # Home dashboard
├── styles/
│   └── custom.css               # Custom CSS styles
├── App.js                       # Main application component
├── App.css                      # Application styles
└── index.js                     # Application entry point
```

## 🎨 Key Features

### Athlete Management
- **View All Athletes**: Displays athletes in a responsive card layout
- **Add New Athlete**: Form with validation for creating new athlete records
- **Edit Athlete**: Update existing athlete information
- **Delete Athlete**: Remove athletes with confirmation dialog
- **Search Athletes**: Find athletes by name, sport, or team

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet & Desktop**: Scales beautifully to larger screens
- **Bootstrap Grid**: Responsive layout system
- **Touch-Friendly**: Large buttons and touch targets

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback
- **Success Messages**: Confirmation of successful actions

## 🔌 API Integration

The application connects to a .NET Core Web API backend:

- **Base URL**: `http://localhost:5018/api`
- **Athletes Endpoint**: `/athletes`
- **CORS Enabled**: Configured for cross-origin requests

### Example API Calls
```javascript
// Get all athletes
GET /api/athletes

// Get athlete by ID
GET /api/athletes/{id}

// Create new athlete
POST /api/athletes

// Update athlete
PUT /api/athletes/{id}

// Delete athlete
DELETE /api/athletes/{id}
```

## 🛠️ Development

### Adding New Features
1. Create components in appropriate folders
2. Update routing in `App.js`
3. Add API service functions
4. Update navigation in `Navbar.js`

### Styling Guidelines
- Use Bootstrap classes for layout and components
- Add custom styles in `src/styles/custom.css`
- Follow BEM methodology for custom CSS classes
- Maintain consistent spacing and typography

### Code Structure
- Use functional components with React hooks
- Keep components small and focused
- Separate business logic into custom hooks
- Use proper prop types for type checking

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build` folder can be deployed to:
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [AWS S3](https://aws.amazon.com/s3/)

### Environment Variables
Create a `.env` file for environment-specific settings:
```
REACT_APP_API_URL=http://localhost:5018/api
REACT_APP_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Errors**
- Ensure the backend API is running on `http://localhost:5018`
- Check CORS configuration in the API
- Verify API endpoint URLs in service files

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify Node.js and npm versions

**Styling Issues**
- Ensure Bootstrap CSS is properly imported
- Check for conflicting CSS rules
- Verify responsive breakpoints

## 🤝 Related Projects

- **Backend API**: [Athlete-Injury-Tracker-API](https://github.com/jvarela86/Athlete-Injury-Tracker-API) - .NET Core Web API

## 🚧 Future Enhancements

- [ ] Injury tracking functionality
- [ ] Treatment management
- [ ] Dashboard with analytics
- [ ] User authentication
- [ ] Advanced search and filtering
- [ ] Data visualization charts
- [ ] Export functionality
- [ ] Mobile app version

## 📄 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Julian Varela** - [jvarela86](https://github.com/jvarela86)

## 🙏 Acknowledgments

- React team for the amazing framework
- Bootstrap team for the CSS framework
- Create React App for the project setup

---

⭐ If you found this project helpful, please give it a star on GitHub!

## 📷 Screenshots

*Add screenshots of your application here to showcase the UI*

---

### 🔗 Quick Links
- [Live Demo](#) (Add when deployed)
- [API Documentation](https://github.com/jvarela86/Athlete-Injury-Tracker-API)
- [Issues](https://github.com/jvarela86/Athlete-Injury-Tracker/issues)
- [Contributing Guidelines](#contributing)
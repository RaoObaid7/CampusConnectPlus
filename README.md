# CampusConnect+ 🎓

A comprehensive React Native mobile application designed to connect university students with campus events, activities, and communities.

## 📱 Features

### 🔐 Authentication System
- **University Email Validation**: Supports multiple university domains (@iqra.edu.pk, @comsats.edu.pk, @pu.edu.pk, @lums.edu.pk, @nust.edu.pk, etc.)
- **Secure Registration**: Student ID verification and department selection
- **Enhanced Login/Signup**: Crystal clear inline feedback for all scenarios (web-optimized)
- **Profile Management**: Update profile information and preferences

### 🎯 Event Management
- **Event Discovery**: Browse and search campus events
- **Smart Filtering**: Filter by category, date, popularity, and availability
- **Event Registration**: QR code generation for event check-ins
- **Real-time Updates**: Live event information and capacity tracking

### 🤖 AI-Powered Recommendations
- **Personalized Suggestions**: AI-driven event recommendations based on user preferences
- **Smart Categories**: Automatic categorization of events
- **Preference Learning**: System learns from registration patterns

### 💬 Social Features
- **Campus Activity Feed**: Share thoughts and experiences
- **Event Comments**: Discuss events with other students
- **Reactions**: Like, love, and react to posts
- **Community Building**: Connect with fellow students

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Optimized for both mobile and web platforms
- **Intuitive Navigation**: Easy-to-use interface with smooth transitions
- **Accessibility**: Clear feedback and user-friendly design

## 🚀 Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom themed components
- **Platform Support**: iOS, Android, and Web

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CampusConnectPlus.git
   cd CampusConnectPlus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   - **Web**: Press `w` in the terminal or visit `http://localhost:8081`
   - **iOS**: Press `i` (requires iOS simulator)
   - **Android**: Press `a` (requires Android emulator or device)
   - **Mobile**: Scan QR code with Expo Go app

## 🏗️ Project Structure

```
CampusConnectPlus/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EventCard.js
│   │   ├── EventList.js
│   │   ├── AIRecommendations.js
│   │   ├── EventComments.js
│   │   └── SearchFilterBar.js
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── HomeScreen.js
│   │   ├── EventDetailsScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SocialFeedScreen.js
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── data/               # Mock data and constants
│   │   └── mockEvents.js
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js
│   └── utils/              # Utility functions
│       ├── storage.js
│       └── aiRecommendations.js
├── assets/                 # Images and static files
├── App.js                  # Main application component
└── package.json
```

## 🎨 Key Features Implemented

### Enhanced User Feedback System
- ✅ **Inline Validation**: Real-time form validation with visual feedback
- ✅ **Error Handling**: Comprehensive error messages for all scenarios
- ✅ **Success States**: Clear success feedback with progress indicators
- ✅ **Web Optimization**: No popup alerts, all feedback is inline

### Virtual List Optimization
- ✅ **Performance Fix**: Resolved VirtualizedList nesting issues
- ✅ **Smooth Scrolling**: Optimized scroll performance for all lists
- ✅ **Memory Efficiency**: Proper virtualization for large data sets

### Modern Authentication
- ✅ **Multi-University Support**: Flexible email domain validation
- ✅ **Secure Storage**: Encrypted local storage for user data
- ✅ **Session Management**: Persistent login sessions

## 🎯 University Email Domains Supported

- Iqra University: `@iqra.edu.pk`
- COMSATS: `@comsats.edu.pk`
- Punjab University: `@pu.edu.pk`
- LUMS: `@lums.edu.pk`
- NUST: `@nust.edu.pk`
- And other verified university domains

## 🐛 Known Issues & Solutions

### Fixed Issues
- ✅ **VirtualizedList Warnings**: Replaced nested ScrollViews with proper FlatList implementation
- ✅ **Web Login Feedback**: Replaced Alert dialogs with inline feedback for better web UX
- ✅ **Real-time Validation**: Added comprehensive form validation with instant feedback

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Rao Obaid** - *Initial work* - [YourGitHub](https://github.com/RaoObaid7)


---

**Built with ❤️ for university students everywhere**

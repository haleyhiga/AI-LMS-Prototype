# Dynamic Active LMS - K-12 Learning Management System

## 🚀 Overview
Dynamic Active LMS is an AI-powered Learning Management System designed specifically for K-12 education. It leverages machine learning to provide personalized learning paths, automated grading, and predictive analytics to improve educational outcomes with a focus on dynamic, active learning methodologies.

## ✨ Key Features

### Authentication & Security
- **Complete Authentication System**: Login and signup with Supabase
- **Role-based Access Control**: Support for students, teachers, and administrators
- **Secure User Management**: Protected routes and user context
- **Email Verification**: Built-in email confirmation system

### AI-Powered Features
- **Personalized Learning Paths**: Automatically assigns students to appropriate learning tracks
- **Automated Grading**: Instant AI-powered assessment grading
- **Smart Recommendations**: Content suggestions based on individual student needs
- **Predictive Analytics**: Early identification of at-risk students
- **Learning Style Analysis**: Identifies optimal learning methods for each student

### Core Functionality
- Comprehensive dashboard with real-time insights
- Course creation and management
- Student progress tracking
- Assignment distribution and auto-grading
- Advanced analytics and reporting
- Interactive AI insights panel

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or extract the project**
   ```bash
   cd dynamic-active-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   
   a. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   b. Edit `.env.local` with your actual API keys:
   ```bash
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=your_supabase_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # OpenAI Configuration (Optional - for AI features)
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   c. Get your Supabase credentials:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from the dashboard
   
   d. Get your OpenAI API key (optional):
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create an API key from the dashboard
   - Add it to `.env.local` for AI-powered features
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication Setup

The application includes a complete authentication system. After setting up Supabase:

1. **First-time users** will see the signup form
2. **Existing users** can log in with their credentials
3. **User roles** are supported (student, teacher, administrator)
4. **Email verification** is handled by Supabase

### User Registration
- Students can select their grade level
- Teachers and administrators have full system access
- All users can specify their school (optional)

### Database Schema
For extended functionality, you may want to set up additional tables in Supabase. See `SETUP.md` for detailed database schema instructions.

## 📁 Project Structure
```
dynamic-active-lms/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Login.js        # Login form component
│   │   ├── Signup.js       # Signup form component
│   │   └── ProtectedRoute.js # Route protection wrapper
│   ├── contexts/           # React context providers
│   │   └── AuthContext.js  # Authentication context
│   ├── services/           # API and service functions
│   │   └── authService.js  # Authentication service
│   ├── utils/              # Utility functions
│   │   └── supabase.ts     # Supabase client configuration
│   ├── App.js              # Main application component with auth
│   ├── LMSPrototype.js     # LMS dashboard component
│   ├── index.js            # React entry point
│   └── index.css           # Tailwind imports
├── utils/
│   └── supabase.ts         # Supabase configuration
├── package.json
├── tailwind.config.js
├── SETUP.md               # Detailed setup instructions
├── README.md
└── .gitignore
```

## 🎨 Customization

### Changing Colors
The LMS uses a purple/indigo theme. To change colors, modify the Tailwind classes in `App.js`:
- Primary: `purple-600`, `indigo-600`
- Secondary: `purple-500`, `indigo-500`
- Accent: `cyan-400`

### Adding Features
The component structure is modular. Each view (Dashboard, Courses, Students, etc.) is a separate function component that can be easily extended.

### AI Configuration
AI features are currently simulated with mock data. To integrate real AI:
1. Replace mock data with API calls to your AI service
2. Update the recommendation engine logic
3. Connect to your grading system API

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `build/` directory.

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
MIT License - feel free to use this project for educational or commercial purposes.

## 🆘 Support
For issues or questions, please create an issue in the project repository.

## 🙏 Acknowledgments
- Built with React and Tailwind CSS
- Icons from Lucide React
- Designed for modern K-12 education

---
**Version**: 1.0.0  
**Last Updated**: November 2024
# Dynamic Active LMS - K-12 Learning Management System

## Overview
Dynamic Active LMS is an AI-powered Learning Management System designed specifically for K-12 education.

## Key Features

### Authentication & Security
- **Complete Authentication System**: Login and signup with Supabase
- **Role-based Access Control**: Support for students, teachers, and administrators
- **Secure User Management**: Protected routes and user context
- **Email Verification**: Built-in email confirmation system

### AI-Powered Features
- **TeacherHelper Bot**: Chatbot assists teachers with any help they need.
- **AI Generated Quizzes**: Instant AI generated quizzes for teachers to use.  Also provides the answers to the quizzes.

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

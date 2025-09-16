import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import LMSPrototype from './LMSPrototype';

// Main App component with authentication
const AppWithAuth = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
  }

  if (!user) {
    return showSignup ? (
      <Signup 
        onSwitchToLogin={() => setShowSignup(false)}
        onSignupSuccess={() => setShowSignup(false)}
      />
    ) : (
      <Login 
        onSwitchToSignup={() => setShowSignup(true)}
        onLoginSuccess={() => {}} // Will be handled by auth context
      />
    );
  }

  return (
    <ProtectedRoute>
      <LMSPrototype />
    </ProtectedRoute>
  );
};

// Root App component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
};

export default App;


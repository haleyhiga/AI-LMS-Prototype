import React, { useState, useEffect } from 'react';
import { MessageCircle, X, HelpCircle, Sparkles } from 'lucide-react';

const HelpToast = ({ onOpenChatbot, isVisible = true }) => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the toast before
    const wasDismissed = localStorage.getItem('help-toast-dismissed');
    if (!wasDismissed && isVisible) {
      // Show toast after a delay
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    // Remember that user dismissed it
    localStorage.setItem('help-toast-dismissed', 'true');
  };

  const handleGetHelp = () => {
    onOpenChatbot();
    handleDismiss();
  };

  const handleResetToast = () => {
    localStorage.removeItem('help-toast-dismissed');
    setDismissed(false);
    setShow(true);
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 transform transition-all duration-500 ease-out animate-pulse">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Need Help?</h3>
              <p className="text-xs text-gray-500">I'm here to assist you!</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-3">
            I can help you with lesson planning, classroom management, student assessment, and more!
          </p>
          
          {/* Quick help options */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
              Lesson planning & curriculum design
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
              Classroom management strategies
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
              Student assessment & feedback
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleGetHelp}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Get Help</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Powered by <span className="text-red-600 font-medium">AI Assistant</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpToast;

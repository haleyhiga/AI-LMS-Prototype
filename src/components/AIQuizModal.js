import React, { useState, useEffect } from 'react';
import { X, Brain, Sparkles, Clock, Target, BookOpen, Zap, CheckCircle, AlertCircle } from 'lucide-react';

const AIQuizModal = ({ isOpen, onClose, onGenerate, courses = [] }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    topic: '',
    subject: '',
    gradeLevel: '',
    difficulty: 'medium',
    questionCount: 5,
    questionTypes: ['multiple-choice', 'true-false']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        courseId: '',
        topic: '',
        subject: '',
        gradeLevel: '',
        difficulty: 'medium',
        questionCount: 5,
        questionTypes: ['multiple-choice', 'true-false']
      });
      setError('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // Load suggestions when subject changes
  useEffect(() => {
    if (formData.subject && formData.subject !== '') {
      loadSuggestions(formData.subject);
    }
  }, [formData.subject]);

  const loadSuggestions = async (subject) => {
    try {
      const { aiQuizService } = await import('../services/aiQuizService');
      const result = await aiQuizService.getQuizSuggestions('', '', subject);
      if (result.success) {
        setSuggestions(result.data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Error loading suggestions:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleQuestionTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      topic: suggestion
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Please enter a topic for the quiz');
      return;
    }

    if (formData.questionTypes.length === 0) {
      setError('Please select at least one question type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { aiQuizService } = await import('../services/aiQuizService');
      const result = await aiQuizService.generateQuiz(formData);
      
      if (result.success) {
        onGenerate(result.data);
        onClose();
      } else {
        setError(result.error || 'Failed to generate quiz');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError('An error occurred while generating the quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === formData.courseId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Quiz Generator</h2>
              <p className="text-sm text-gray-600">Generate intelligent quizzes with AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course (Optional)
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select subject...</option>
              <option value="Math">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Topic *
            </label>
            <div className="relative">
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Enter quiz topic (e.g., 'Algebra Basics', 'Photosynthesis')"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              AI will generate questions based on this topic
            </p>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select grade level...</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                <option key={grade} value={grade.toString()}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'easy', label: 'Easy', color: 'green' },
                { value: 'medium', label: 'Medium', color: 'yellow' },
                { value: 'hard', label: 'Hard', color: 'red' }
              ].map(level => (
                <label
                  key={level.value}
                  className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.difficulty === level.value
                      ? `border-${level.color}-500 bg-${level.color}-50`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level.value}
                    checked={formData.difficulty === level.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose between 1-20 questions
            </p>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Types
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'multiple-choice', label: 'Multiple Choice', icon: '○' },
                { value: 'true-false', label: 'True/False', icon: '✓' },
                { value: 'short-answer', label: 'Short Answer', icon: '✎' },
                { value: 'fill-in-blank', label: 'Fill in Blank', icon: '___' }
              ].map(type => (
                <label
                  key={type.value}
                  className={`relative flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.questionTypes.includes(type.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.questionTypes.includes(type.value)}
                    onChange={() => handleQuestionTypeChange(type.value)}
                    className="sr-only"
                  />
                  <span className="text-lg">{type.icon}</span>
                  <span className="font-medium text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedCourse && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Quiz Preview</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Course:</strong> {selectedCourse.name}</p>
                <p><strong>Topic:</strong> {formData.topic || 'Not specified'}</p>
                <p><strong>Subject:</strong> {formData.subject || 'Not specified'}</p>
                <p><strong>Grade Level:</strong> {formData.gradeLevel || 'Not specified'}</p>
                <p><strong>Difficulty:</strong> {formData.difficulty}</p>
                <p><strong>Questions:</strong> {formData.questionCount}</p>
                <p><strong>Types:</strong> {formData.questionTypes.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIQuizModal;


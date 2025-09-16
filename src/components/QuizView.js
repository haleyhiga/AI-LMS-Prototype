import React, { useState } from 'react';
import { X, Brain, Clock, Target, BookOpen, CheckCircle, XCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

const QuizView = ({ quiz, isOpen, onClose }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!isOpen || !quiz) return null;

  const { questions = [], title, description, topic, subject, gradeLevel, difficulty, questionCount, totalPoints, estimatedTime } = quiz;

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'multiple-choice':
        return '○';
      case 'true-false':
        return '✓';
      case 'short-answer':
        return '✎';
      case 'fill-in-blank':
        return '___';
      default:
        return '?';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderQuestion = (question, index) => {
    return (
      <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
              {index + 1}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getQuestionIcon(question.type)}</span>
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {question.type.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500">• {question.points} points</span>
              </div>
            </div>
          </div>
          {showAnswers && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Answer Key</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Question Content */}
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options?.map((option, optionIndex) => {
              const isCorrect = showAnswers && optionIndex === question.correctAnswer;
              return (
                <div
                  key={optionIndex}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {isCorrect && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                    <span>{option}</span>
                    {isCorrect && (
                      <span className="ml-auto text-green-600 font-medium">Correct Answer</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3">
            {[true, false].map((value, index) => {
              const isCorrect = showAnswers && value === question.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {isCorrect && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="font-medium">{value ? 'True' : 'False'}</span>
                    {isCorrect && (
                      <span className="ml-auto text-green-600 font-medium">Correct Answer</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(question.type === 'short-answer' || question.type === 'fill-in-blank') && (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-600">Sample Answer:</span>
              </div>
              <p className="text-gray-700 italic">
                {showAnswers ? question.correctAnswer : 'Answer will be shown when viewing answer key'}
              </p>
            </div>
          </div>
        )}

        {/* Explanation */}
        {showAnswers && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                <p className="text-sm text-blue-700">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {title}
                <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Generated
                </span>
              </h2>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quiz Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium text-gray-800">{subject}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Topic</p>
                <p className="font-medium text-gray-800">{topic}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Est. Time</p>
                <p className="font-medium text-gray-800">{estimatedTime} min</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-medium text-gray-800 capitalize">{difficulty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{questions.length}</span> questions • 
                <span className="font-medium ml-1">{totalPoints}</span> total points
              </div>
              {gradeLevel && (
                <div className="text-sm text-gray-600">
                  Grade <span className="font-medium">{gradeLevel}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showAnswers
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showAnswers ? 'Hide Answers' : 'Show Answers'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="p-6 overflow-y-auto max-h-96">
          {questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question, index) => renderQuestion(question, index))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Questions Generated</h3>
              <p className="text-gray-500">This quiz doesn't have any questions yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Generated by AI • {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Future: Add export functionality
                  console.log('Export quiz:', quiz);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Export Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
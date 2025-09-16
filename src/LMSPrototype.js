import React, { useState } from 'react';
import { BookOpen, Users, FileText, CheckCircle, Clock, TrendingUp, Star, Menu, X, Home, LogOut, Bell, Search, Filter, Plus, Edit, Trash2, Eye, AlertCircle, RefreshCw, Sparkles, Zap, Play, MessageCircle } from 'lucide-react';
import { useLMSData } from './hooks/useLMSData';
import { useAuth } from './contexts/AuthContext';
import AIQuizModal from './components/AIQuizModal';
import QuizView from './components/QuizView';
import DALogo from './components/DALogo';
import TeacherChatbot from './components/TeacherChatbot';
import HelpToast from './components/HelpToast';

const LMSPrototype = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);
  // Create Course modal state
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [createCourseLoading, setCreateCourseLoading] = useState(false);
  const [createCourseError, setCreateCourseError] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    grade_level: '',
    subject: ''
  });

  // AI Quiz modal state
  const [isAIQuizModalOpen, setIsAIQuizModalOpen] = useState(false);
  
  // Quiz view state
  const [isQuizViewOpen, setIsQuizViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Get real data from Supabase
  const { user, signOut, forceLogout } = useAuth();
  const {
    courses,
    students,
    assignments,
    analytics,
    aiRecommendations,
    studentProgress,
    loading,
    error,
    refreshData,
    createCourse,
    fetchCourses,
    generateAIQuiz
  } = useLMSData();

  // Get user role from profile
  const userRole = user?.user_metadata?.role || 'teacher';

  const canCreateCourses = userRole === 'teacher' || userRole === 'admin';

  const handleLogout = async () => {
    try {
      // First try the normal signOut
      const result = await signOut();
      if (result.error) {
        console.error('SignOut error:', result.error);
        // If signOut fails, use forceLogout as backup
        forceLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // If anything fails, use forceLogout as backup
      forceLogout();
    }
  };

  const openCreateCourse = () => {
    setCreateCourseError('');
    setNewCourse({ name: '', description: '', grade_level: '', subject: '' });
    setIsCreateCourseOpen(true);
  };

  const handleCreateCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
    if (createCourseError) setCreateCourseError('');
  };

  const submitCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name.trim()) {
      setCreateCourseError('Course name is required');
      return;
    }
    setCreateCourseLoading(true);
    setCreateCourseError('');
    try {
      const result = await createCourse({
        name: newCourse.name.trim(),
        description: newCourse.description.trim() || null,
        grade_level: newCourse.grade_level || null,
        subject: newCourse.subject || null
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to create course');
      }
      await fetchCourses();
      setIsCreateCourseOpen(false);
    } catch (err) {
      setCreateCourseError(err.message);
    } finally {
      setCreateCourseLoading(false);
    }
  };

  // AI Quiz handlers
  const handleGenerateAIQuiz = async (quizData) => {
    try {
      const result = await generateAIQuiz(quizData);
      if (result.success) {
        console.log('AI Quiz generated successfully:', result.data);
        // The quiz will be automatically added to assignments
      } else {
        console.error('Failed to generate AI quiz:', result.error);
      }
    } catch (error) {
      console.error('Error generating AI quiz:', error);
    }
  };

  // Quiz view handlers
  const handleViewQuiz = (assignment) => {
    if (assignment.quiz_data) {
      setSelectedQuiz(assignment.quiz_data);
      setIsQuizViewOpen(true);
    } else {
      console.error('No quiz data available for this assignment');
    }
  };

  // Chatbot handlers
  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Sidebar components
  const NavigationSidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <DALogo className="w-8 h-8" variant="black" />
            {sidebarOpen && <span className="text-xl font-bold text-gray-900">Dynamic Active</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-3">
          <NavItem icon={<Home />} label="Dashboard" view="dashboard" />
          <NavItem icon={<BookOpen />} label="Courses" view="courses" />
          <NavItem icon={<Users />} label="Students" view="students" />
          <NavItem icon={<FileText />} label="Assignments" view="assignments" />
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <NavItem icon={<LogOut />} label="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );

  const NavItem = ({ icon, label, view, onClick }) => (
    <button
      onClick={onClick || (() => setActiveView(view))}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeView === view ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  const TopBar = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <DALogo className="w-10 h-10" variant="black" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-500">Dynamic Active LMS</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          
          <button 
            onClick={handleOpenChatbot}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Teacher Assistant"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
              {userRole === 'teacher' ? 'T' : 'S'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {userRole === 'teacher' ? 'Ms. FakeTeacher' : 'Student'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard components
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Recent Assignments and Student Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Assignments</h2>
          <div className="space-y-3">
            {assignments.length > 0 ? (
              assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">{assignment.courses?.name || 'Unknown Course'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{assignment.submissions?.[0]?.count || 0} submissions</p>
                    <p className="text-xs text-gray-500">
                      Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No assignments yet</p>
                <p className="text-sm">Create your first assignment to get started</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Student Performance Overview</h2>
          <div className="space-y-4">
            {Object.keys(studentProgress).length > 0 ? (
              Object.entries(studentProgress).map(([subject, progress]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium text-gray-700">{subject}</span>
                    <span className="text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progress >= 80 ? 'bg-green-500' : progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No performance data available yet</p>
                <p className="text-sm">Performance data will appear as students complete assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Courses
  const CoursesView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
        {canCreateCourses && (
          <button onClick={openCreateCourse} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.course_enrollments?.[0]?.count || 0} students enrolled
                  </p>
                  {course.subject && (
                    <p className="text-xs text-gray-400 mt-1">{course.subject}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {course.grade_level || 'All Grades'}
                  </span>
                </div>
              </div>

              {course.description && (
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Created: {new Date(course.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-4">Create your first course to get started</p>
            {canCreateCourses && (
              <button onClick={openCreateCourse} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Create Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Students
  const StudentsView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Learning Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map(student => {
                // Generate a random score for each student for demo purposes
                const avgScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
                
                const performance = avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : 'Needs Support';
                const riskLevel = avgScore >= 70 ? 'low' : avgScore >= 50 ? 'medium' : 'high';
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                          {student.full_name?.split(' ').map(n => n[0]).join('') || 'S'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.full_name || 'Unknown Student'}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.grade ? `Grade ${student.grade}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                        performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {performance} ({avgScore}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Star className="w-4 h-4 mr-1 text-gray-900" />
                        {avgScore >= 80 ? 'Advanced' : avgScore >= 60 ? 'Standard' : 'Remedial'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-gray-900 hover:text-gray-700 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No students enrolled</h3>
                  <p className="text-gray-500">Students will appear here once they enroll in your courses</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Assignments
  const AssignmentsView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Assignments & Assessments</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAIQuizModalOpen(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate Quiz
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium">All Assignments</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Pending Review</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Upcoming</button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        {assignment.title}
                        {assignment.ai_generated && (
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {assignment.courses?.name || 'Unknown Course'} • 
                        Due {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                      {assignment.description && (
                        <p className="text-xs text-gray-500 mt-1">{assignment.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {assignment.submissions?.[0]?.count || 0}
                      </p>
                      <p className="text-xs text-gray-500">Submitted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-400">
                        {assignment.points || 100}
                      </p>
                      <p className="text-xs text-gray-500">Points</p>
                    </div>
                    {assignment.ai_generated && assignment.quiz_data ? (
                      <button 
                        onClick={() => handleViewQuiz(assignment)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>View Quiz</span>
                      </button>
                    ) : (
                      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Review
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span className="text-gray-600">
                        Type: <span className="font-medium text-gray-900 capitalize">{assignment.assignment_type || 'homework'}</span>
                      </span>
                      <span className="text-gray-600">
                        Created: <span className="font-medium text-gray-900">{new Date(assignment.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-900">Analytics</button>
                      <span className="text-gray-300">•</span>
                      <button className="text-gray-600 hover:text-gray-900">Export</button>
                      <span className="text-gray-300">•</span>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No assignments yet</h3>
              <p className="text-gray-500 mb-4">Create your first assignment to get started</p>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${change.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <DashboardView />;
      case 'courses': return <CoursesView />;
      case 'students': return <StudentsView />;
      case 'assignments': return <AssignmentsView />;
      default: return <DashboardView />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TopBar />
        
        <div className="p-6">
          {renderView()}
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateCourseOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Create New Course</h3>
              <button onClick={() => setIsCreateCourseOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createCourseError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {createCourseError}
              </div>
            )}

            <form onSubmit={submitCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  name="name"
                  value={newCourse.name}
                  onChange={handleCreateCourseChange}
                  placeholder="e.g., Mathematics Grade 7"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleCreateCourseChange}
                  rows="3"
                  placeholder="Brief description of the course"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select
                    name="grade_level"
                    value={newCourse.grade_level}
                    onChange={handleCreateCourseChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select grade</option>
                    <option value="K">Kindergarten</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={String(g)}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={newCourse.subject}
                    onChange={handleCreateCourseChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select subject</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="PE">Physical Education</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCourseOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCourseLoading}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {createCourseLoading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Quiz Generation Modal */}
      <AIQuizModal
        isOpen={isAIQuizModalOpen}
        onClose={() => setIsAIQuizModalOpen(false)}
        onGenerate={handleGenerateAIQuiz}
        courses={courses}
      />

      {/* Quiz View Modal */}
      <QuizView
        quiz={selectedQuiz}
        isOpen={isQuizViewOpen}
        onClose={() => {
          setIsQuizViewOpen(false);
          setSelectedQuiz(null);
        }}
      />

      {/* Teacher Chatbot */}
      <TeacherChatbot
        isOpen={isChatbotOpen}
        onClose={handleCloseChatbot}
        currentView={activeView}
      />

      {/* Help Toast */}
      <HelpToast
        onOpenChatbot={handleOpenChatbot}
        isVisible={!isChatbotOpen}
      />
    </div>
  );
};

export default LMSPrototype;
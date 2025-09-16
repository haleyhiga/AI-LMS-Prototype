import React, { useState } from 'react';
import { BookOpen, Users, Brain, FileText, CheckCircle, Clock, TrendingUp, Star, Menu, X, Home, LogOut, Bell, Search, Filter, Plus, Edit, Trash2, Eye, AlertCircle, RefreshCw, Sparkles, Zap, Play } from 'lucide-react';
import { useLMSData } from './hooks/useLMSData';
import { useAuth } from './contexts/AuthContext';
import AIQuizModal from './components/AIQuizModal';
import QuizView from './components/QuizView';
import DALogo from './components/DALogo';

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

// end of generated data


// Sidebar components
  const NavigationSidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <DALogo className="w-8 h-8" variant="white" />
            {sidebarOpen && <span className="text-xl font-bold">Dynamic Active</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white/10 p-2 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-2">
          <NavItem icon={<Home />} label="Dashboard" view="dashboard" />
          <NavItem icon={<BookOpen />} label="Courses" view="courses" />
          <NavItem icon={<Users />} label="Students" view="students" />
          <NavItem icon={<FileText />} label="Assignments" view="assignments" />
          <NavItem icon={<Brain />} label="AI Insights" view="ai-insights" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
   
          <NavItem icon={<LogOut />} label="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );

  const NavItem = ({ icon, label, view, onClick }) => (
    <button
      onClick={onClick || (() => setActiveView(view))}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeView === view ? 'bg-red-600 shadow-lg text-white' : 'hover:bg-red-600/20 text-gray-300 hover:text-white'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  const TopBar = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <DALogo className="w-10 h-10" variant="default" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-500">Dynamic Active LMS</p>
            </div>
          </div>
          <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            <Brain className="w-4 h-4 mr-1" />
            AI-Enhanced
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {userRole === 'teacher' ? 'T' : 'S'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {userRole === 'teacher' ? 'Ms. Johnson' : 'Student'}
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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Students" 
          value={analytics.totalStudents || 0} 
          change="+5%" 
          icon={<Users />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Courses" 
          value={analytics.totalCourses || 0} 
          change="+1" 
          icon={<BookOpen />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Avg Performance" 
          value={`${analytics.avgPerformance || 0}%`} 
          change="+3%" 
          icon={<TrendingUp />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="AI Insights" 
          value={aiRecommendations.length || 0} 
          change="New" 
          icon={<Brain />} 
          color="bg-pink-500" 
        />
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-red-600" />
            AI-Powered Recommendations
          </h2>
          <button className="text-red-600 hover:text-red-800 text-sm font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiRecommendations.map(rec => (
            <div key={rec.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {rec.priority} priority
                </span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{rec.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{rec.subject}</p>
              <p className="text-xs text-gray-500">{rec.reason}</p>
                <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Apply Recommendation
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Assignments</h2>
          <div className="space-y-3">
            {assignments.map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    assignment.autoGraded ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {assignment.autoGraded ? <CheckCircle className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{assignment.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{assignment.submitted}/{assignment.total}</p>
                  <p className="text-xs text-gray-500">Due: {assignment.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Performance Overview</h2>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        {canCreateCourses && (
          <button onClick={openCreateCourse} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.course_enrollments?.[0]?.count || 0} students enrolled
                  </p>
                  {course.subject && (
                    <p className="text-xs text-gray-400 mt-1">{course.subject}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
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
              <button onClick={openCreateCourse} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
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
                        <Brain className="w-4 h-4 mr-1 text-purple-500" />
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
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
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


  // AI Insights
  const AIInsightsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">AI-Powered Insights Dashboard</h2>
        <p className="text-red-100 mb-6">Leverage machine learning to optimize learning outcomes and identify at-risk students</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100">Predicted Pass Rate</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">87%</p>
            <p className="text-sm text-red-100 mt-1">+5% from last term</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100">At-Risk Students</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-red-100 mt-1">Requires intervention</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100">Learning Efficiency</span>
              <Brain className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">92%</p>
            <p className="text-sm text-red-100 mt-1">AI optimization active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Personalized Learning Paths</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">Advanced Track (15 students)</p>
              <p className="text-sm text-gray-600">Accelerated curriculum with enrichment activities</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">+23% progress</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">High engagement</span>
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">Standard Track (78 students)</p>
              <p className="text-sm text-gray-600">Grade-level appropriate pacing and content</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">On track</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Stable progress</span>
              </div>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">Support Track (17 students)</p>
              <p className="text-sm text-gray-600">Additional scaffolding and remediation</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Needs attention</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Improving</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">AI Recommendations This Week</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Urgent: Schedule intervention for 3 students</p>
                <p className="text-sm text-gray-600 mt-1">Math performance declining for 2+ weeks</p>
                <button className="mt-2 text-sm text-red-600 font-medium hover:text-red-800">Take Action →</button>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Adjust pacing for Science Unit 3</p>
                <p className="text-sm text-gray-600 mt-1">65% of students need more time on concepts</p>
                <button className="mt-2 text-sm text-yellow-600 font-medium hover:text-yellow-800">Review Details →</button>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">5 students ready for advanced content</p>
                <p className="text-sm text-gray-600 mt-1">Consistently scoring 95%+ on assessments</p>
                <button className="mt-2 text-sm text-green-600 font-medium hover:text-green-800">Assign Content →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${change.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <DashboardView />;
      case 'courses': return <CoursesView />;
      case 'students': return <StudentsView />;
      case 'ai-insights': return <AIInsightsView />;
      case 'assignments': return <AssignmentsView />;
      default: return <DashboardView />;
    }
  };

// Assignments
  const AssignmentsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assignments & Assessments</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAIQuizModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate Quiz
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-green-600" />
            AI Auto-Grading Active
          </h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            12 assignments graded today
          </span>
        </div>
        <p className="text-gray-600">Automated grading has saved you <span className="font-bold text-green-600">4.5 hours</span> this week</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">All Assignments</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Pending Review</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Auto-Graded</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Upcoming</button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {assignments.length > 0 ? (
            assignments.map(assignment => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      assignment.auto_graded ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {assignment.auto_graded ? 
                        <Brain className="w-6 h-6 text-green-600" /> : 
                        <FileText className="w-6 h-6 text-blue-600" />
                      }
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        {assignment.title}
                        {assignment.auto_graded && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">AI Graded</span>
                        )}
                        {assignment.ai_generated && (
                          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded text-xs flex items-center">
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
                      <p className="text-2xl font-bold text-gray-800">
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
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>View Quiz</span>
                      </button>
                    ) : (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Review
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span className="text-gray-600">
                        Type: <span className="font-medium text-gray-800 capitalize">{assignment.assignment_type || 'homework'}</span>
                      </span>
                      <span className="text-gray-600">
                        Created: <span className="font-medium text-gray-800">{new Date(assignment.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-800">Analytics</button>
                      <span className="text-gray-300">•</span>
                      <button className="text-gray-600 hover:text-gray-800">Export</button>
                      <span className="text-gray-300">•</span>
                      <button className="text-gray-600 hover:text-gray-800">Edit</button>
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
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select
                    name="grade_level"
                    value={newCourse.grade_level}
                    onChange={handleCreateCourseChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
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
    </div>
  );
};

export default LMSPrototype;

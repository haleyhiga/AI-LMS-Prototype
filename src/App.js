import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Award, BarChart3, Brain, Calendar, MessageSquare, FileText, PlayCircle, CheckCircle, Clock, TrendingUp, Star, ChevronRight, Menu, X, Home, User, Settings, LogOut, Bell, Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';


const LMSPrototype = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [userRole, setUserRole] = useState('teacher');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notifications, setNotifications] = useState(3);

  // Simulated AI-generated data
  const [studentProgress, setStudentProgress] = useState({
    math: 78,
    science: 85,
    english: 72,
    history: 90
  });

  const [aiRecommendations] = useState([
    { id: 1, type: 'content', title: 'Interactive Fraction Tutorial', subject: 'Math', reason: 'Based on recent quiz performance', priority: 'high' },
    { id: 2, type: 'practice', title: 'Grammar Exercises', subject: 'English', reason: 'Reinforce weak areas', priority: 'medium' },
    { id: 3, type: 'enrichment', title: 'Advanced Science Lab', subject: 'Science', reason: 'Student showing mastery', priority: 'low' }
  ]);

  const [courses] = useState([
    { id: 1, name: 'Mathematics Grade 7', students: 28, completion: 65, nextClass: 'Today 10:00 AM', aiScore: 82 },
    { id: 2, name: 'Science Grade 7', students: 25, completion: 72, nextClass: 'Today 2:00 PM', aiScore: 88 },
    { id: 3, name: 'English Literature', students: 30, completion: 58, nextClass: 'Tomorrow 9:00 AM', aiScore: 75 },
    { id: 4, name: 'World History', students: 27, completion: 80, nextClass: 'Tomorrow 1:00 PM', aiScore: 91 }
  ]);

  const [assignments] = useState([
    { id: 1, title: 'Algebra Quiz', course: 'Mathematics', dueDate: '2024-11-20', submitted: 22, total: 28, autoGraded: true },
    { id: 2, title: 'Essay: Climate Change', course: 'Science', dueDate: '2024-11-22', submitted: 18, total: 25, autoGraded: false },
    { id: 3, title: 'Poetry Analysis', course: 'English', dueDate: '2024-11-23', submitted: 15, total: 30, autoGraded: false }
  ]);

  const [students] = useState([
    { id: 1, name: 'Emma Wilson', grade: 7, performance: 'Excellent', aiPath: 'Advanced', riskLevel: 'low', lastActive: '2 hours ago' },
    { id: 2, name: 'James Chen', grade: 7, performance: 'Good', aiPath: 'Standard', riskLevel: 'low', lastActive: '1 day ago' },
    { id: 3, name: 'Sofia Rodriguez', grade: 7, performance: 'Needs Support', aiPath: 'Remedial', riskLevel: 'high', lastActive: '3 hours ago' },
    { id: 4, name: 'Marcus Johnson', grade: 7, performance: 'Good', aiPath: 'Standard', riskLevel: 'medium', lastActive: '5 hours ago' }
  ]);

// end of generated data


// Sidebar components
  const NavigationSidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-cyan-400" />
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
          <NavItem icon={<BarChart3 />} label="Analytics" view="analytics" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
   
          <NavItem icon={<LogOut />} label="Logout" view="logout" />
        </div>
      </div>
    </div>
  );

  const NavItem = ({ icon, label, view }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeView === view ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
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
          <h1 className="text-2xl font-bold text-gray-800">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace('-', ' ')}
          </h1>
          <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
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
        <StatCard title="Active Students" value="110" change="+5%" icon={<Users />} color="bg-blue-500" />
        <StatCard title="Courses" value="4" change="+1" icon={<BookOpen />} color="bg-green-500" />
        <StatCard title="Avg Performance" value="78%" change="+3%" icon={<TrendingUp />} color="bg-purple-500" />
        <StatCard title="AI Insights" value="12" change="New" icon={<Brain />} color="bg-pink-500" />
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            AI-Powered Recommendations
          </h2>
          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">View All</button>
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
              <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
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
            {Object.entries(studentProgress).map(([subject, progress]) => (
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
            ))}
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
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.students} students enrolled</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  AI Score: {course.aiScore}%
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Course Progress</span>
                <span className="font-medium">{course.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course.completion}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                Next: {course.nextClass}
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
        ))}
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
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Grade {student.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                    student.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.performance}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Brain className="w-4 h-4 mr-1 text-purple-500" />
                    {student.aiPath}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                  <button className="text-gray-600 hover:text-gray-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  // AI Insights
  const AIInsightsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">AI-Powered Insights Dashboard</h2>
        <p className="text-purple-100 mb-6">Leverage machine learning to optimize learning outcomes and identify at-risk students</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Predicted Pass Rate</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">87%</p>
            <p className="text-sm text-purple-100 mt-1">+5% from last term</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">At-Risk Students</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-purple-100 mt-1">Requires intervention</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Learning Efficiency</span>
              <Brain className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">92%</p>
            <p className="text-sm text-purple-100 mt-1">AI optimization active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Personalized Learning Paths</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">Advanced Track (15 students)</p>
              <p className="text-sm text-gray-600">Accelerated curriculum with enrichment activities</p>
              <div className="mt-2 flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">+23% progress</span>
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
      case 'analytics': return <AnalyticsView />;
      default: return <DashboardView />;
    }
  };

// Assignments
  const AssignmentsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Assignments & Assessments</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </button>
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
          {assignments.map(assignment => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    assignment.autoGraded ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {assignment.autoGraded ? 
                      <Brain className="w-6 h-6 text-green-600" /> : 
                      <FileText className="w-6 h-6 text-blue-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      {assignment.title}
                      {assignment.autoGraded && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">AI Graded</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{assignment.course} • Due {assignment.dueDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{assignment.submitted}</p>
                    <p className="text-xs text-gray-500">Submitted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{assignment.total - assignment.submitted}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Review
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex space-x-4">
                    <span className="text-gray-600">Avg Score: <span className="font-medium text-gray-800">82%</span></span>
                    <span className="text-gray-600">Time Saved: <span className="font-medium text-green-600">45 min</span></span>
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
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics
  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Performance Analytics</h2>
        <p className="text-indigo-100 mb-6">Data-driven insights powered by machine learning algorithms</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-indigo-100 text-sm mb-1">Class Average</p>
            <p className="text-3xl font-bold">78.5%</p>
            <p className="text-xs text-indigo-200 mt-1">↑ 3.2% this month</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-indigo-100 text-sm mb-1">Engagement Rate</p>
            <p className="text-3xl font-bold">92%</p>
            <p className="text-xs text-indigo-200 mt-1">↑ 5% this month</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-indigo-100 text-sm mb-1">Completion Rate</p>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-xs text-indigo-200 mt-1">↑ 2% this month</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-indigo-100 text-sm mb-1">AI Accuracy</p>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-xs text-indigo-200 mt-1">Prediction confidence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Subject Performance Trends</h3>
          <div className="space-y-4">
            {Object.entries(studentProgress).map(([subject, score]) => (
              <div key={subject}>
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-medium text-gray-700">{subject}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{score}%</span>
                    <TrendingUp className={`w-4 h-4 ${score >= 80 ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                </div>
                <div className="flex space-x-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 flex-1 rounded ${
                        i < Math.floor(score / 10) 
                          ? score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>AI Insight:</strong> Math scores show opportunity for improvement. Consider implementing targeted practice sessions.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Style Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Visual Learners</p>
                  <p className="text-sm text-gray-600">Best with diagrams & videos</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">42%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Kinesthetic Learners</p>
                  <p className="text-sm text-gray-600">Learn by doing & practice</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">31%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">Reading/Writing</p>
                  <p className="text-sm text-gray-600">Prefer text-based content</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">27%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Engagement Heatmap</h3>
        <div className="grid grid-cols-8 gap-2">
          <div></div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm text-gray-600 font-medium">{day}</div>
          ))}
          
          {['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'].map(time => (
            <React.Fragment key={time}>
              <div className="text-sm text-gray-600 text-right pr-2">{time}</div>
              {[...Array(7)].map((_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className={`h-8 rounded ${
                      intensity > 0.7 ? 'bg-purple-600' :
                      intensity > 0.5 ? 'bg-purple-400' :
                      intensity > 0.3 ? 'bg-purple-300' :
                      intensity > 0.1 ? 'bg-purple-200' :
                      'bg-gray-100'
                    }`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">Peak engagement: <span className="font-medium">Weekdays 10AM-12PM</span></p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center"><span className="w-3 h-3 bg-gray-100 rounded mr-1"></span> Low</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-purple-300 rounded mr-1"></span> Medium</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-purple-600 rounded mr-1"></span> High</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TopBar />
        
        <div className="p-6">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default LMSPrototype;
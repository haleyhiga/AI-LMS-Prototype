import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLMSData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hardcoded data
  const [courses, setCourses] = useState([
    {
      id: '1',
      name: 'Mathematics Grade 7',
      description: 'Advanced mathematics course covering algebra, geometry, and statistics',
      grade_level: '7',
      subject: 'Math',
      teacher_id: user?.id || 'teacher-1',
      created_at: '2024-01-15T10:00:00Z',
      course_enrollments: [{ count: 24 }]
    },
    {
      id: '2',
      name: 'Science Discovery',
      description: 'Exploring the wonders of science through hands-on experiments',
      grade_level: '6',
      subject: 'Science',
      teacher_id: user?.id || 'teacher-1',
      created_at: '2024-01-20T14:30:00Z',
      course_enrollments: [{ count: 18 }]
    },
    {
      id: '3',
      name: 'Creative Writing Workshop',
      description: 'Developing creative writing skills and storytelling techniques',
      grade_level: '8',
      subject: 'English',
      teacher_id: user?.id || 'teacher-1',
      created_at: '2024-02-01T09:15:00Z',
      course_enrollments: [{ count: 15 }]
    }
  ]);

  const [students, setStudents] = useState([
    {
      id: '1',
      full_name: 'Emma Johnson',
      email: 'emma.johnson@student.edu',
      grade: '7',
      school: 'Lincoln Middle School',
      created_at: '2024-01-10T08:00:00Z'
    },
    {
      id: '2',
      full_name: 'Michael Chen',
      email: 'michael.chen@student.edu',
      grade: '7',
      school: 'Lincoln Middle School',
      created_at: '2024-01-12T10:30:00Z'
    },
    {
      id: '3',
      full_name: 'Sarah Williams',
      email: 'sarah.williams@student.edu',
      grade: '6',
      school: 'Lincoln Middle School',
      created_at: '2024-01-15T14:20:00Z'
    },
    {
      id: '4',
      full_name: 'David Rodriguez',
      email: 'david.rodriguez@student.edu',
      grade: '8',
      school: 'Lincoln Middle School',
      created_at: '2024-01-18T11:45:00Z'
    },
    {
      id: '5',
      full_name: 'Lisa Thompson',
      email: 'lisa.thompson@student.edu',
      grade: '7',
      school: 'Lincoln Middle School',
      created_at: '2024-01-22T16:10:00Z'
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: '1',
      title: 'Algebra Fundamentals Quiz',
      description: 'Test your understanding of basic algebraic concepts',
      course_id: '1',
      courses: { name: 'Mathematics Grade 7' },
      due_date: '2024-02-15T23:59:00Z',
      points: 100,
      assignment_type: 'quiz',
      auto_graded: true,
      created_at: '2024-01-25T09:00:00Z',
      submissions: [{ count: 20 }]
    },
    {
      id: '2',
      title: 'Science Experiment Report',
      description: 'Write a detailed report on your plant growth experiment',
      course_id: '2',
      courses: { name: 'Science Discovery' },
      due_date: '2024-02-20T23:59:00Z',
      points: 150,
      assignment_type: 'project',
      auto_graded: false,
      created_at: '2024-01-28T14:30:00Z',
      submissions: [{ count: 15 }]
    },
    {
      id: '3',
      title: 'Creative Short Story',
      description: 'Write a 1000-word creative short story',
      course_id: '3',
      courses: { name: 'Creative Writing Workshop' },
      due_date: '2024-02-25T23:59:00Z',
      points: 200,
      assignment_type: 'essay',
      auto_graded: false,
      created_at: '2024-02-01T11:15:00Z',
      submissions: [{ count: 12 }]
    }
  ]);

  const [analytics, setAnalytics] = useState({
    totalStudents: 5,
    totalCourses: 3,
    totalAssignments: 3,
    avgPerformance: 87,
    totalSubmissions: 47
  });

  const [aiRecommendations, setAIRecommendations] = useState([
    {
      id: '1',
      title: 'Implement Peer Review Sessions',
      subject: 'Creative Writing',
      priority: 'high',
      reason: 'Students show 23% improvement when collaborating on writing projects'
    },
    {
      id: '2',
      title: 'Add Visual Learning Materials',
      subject: 'Mathematics',
      priority: 'medium',
      reason: 'Visual learners in your class would benefit from more diagrams and charts'
    },
    {
      id: '3',
      title: 'Schedule Office Hours',
      subject: 'Science',
      priority: 'low',
      reason: 'Students struggling with lab reports need additional support'
    }
  ]);

  const [studentProgress, setStudentProgress] = useState({
    math: 87,
    science: 89,
    english: 88
  });

  const [aiQuizzes, setAiQuizzes] = useState([]);

  // Simulate data loading
  const fetchAllData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading(false);
  }, [user]);

  // Individual data fetch functions (simplified for hardcoded data)
  const fetchCourses = useCallback(async () => {
    // Data is already loaded, just simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  }, []);

  const fetchStudents = useCallback(async () => {
    // Data is already loaded, just simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  }, []);

  const fetchAssignments = useCallback(async () => {
    // Data is already loaded, just simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
  }, []);

  // CRUD operations (simplified for hardcoded data)
  const createCourse = useCallback(async (courseData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      teacher_id: user.id,
      created_at: new Date().toISOString(),
      course_enrollments: [{ count: 0 }]
    };
    
    setCourses(prev => [newCourse, ...prev]);
    return { success: true, data: newCourse };
  }, [user]);

  const updateCourse = useCallback(async (courseId, updates) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    ));
    return { success: true };
  }, []);

  const deleteCourse = useCallback(async (courseId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCourses(prev => prev.filter(course => course.id !== courseId));
    return { success: true };
  }, []);

  const createAssignment = useCallback(async (assignmentData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      created_at: new Date().toISOString(),
      submissions: [{ count: 0 }]
    };
    
    setAssignments(prev => [newAssignment, ...prev]);
    return { success: true, data: newAssignment };
  }, []);

  const updateAssignment = useCallback(async (assignmentId, updates) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, ...updates } : assignment
    ));
    return { success: true };
  }, []);

  const deleteAssignment = useCallback(async (assignmentId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    return { success: true };
  }, []);

  const enrollStudent = useCallback(async (courseId, studentId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update enrollment count
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            course_enrollments: [{ count: (course.course_enrollments?.[0]?.count || 0) + 1 }] 
          }
        : course
    ));
    return { success: true };
  }, []);

  const unenrollStudent = useCallback(async (courseId, studentId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update enrollment count
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            course_enrollments: [{ count: Math.max(0, (course.course_enrollments?.[0]?.count || 0) - 1) }] 
          }
        : course
    ));
    return { success: true };
  }, []);

  // AI Quiz Generation
  const generateAIQuiz = useCallback(async (quizParameters) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    try {
      const { aiQuizService } = await import('../services/aiQuizService');
      const result = await aiQuizService.generateQuiz(quizParameters);
      
      if (result.success) {
        // Convert AI quiz to assignment format
        const assignment = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          course_id: quizParameters.courseId || null,
          courses: { name: courses.find(c => c.id === quizParameters.courseId)?.name || 'AI Generated Quiz' },
          due_date: null,
          points: result.data.totalPoints,
          assignment_type: 'quiz',
          auto_graded: true,
          ai_generated: true,
          created_at: result.data.createdAt,
          submissions: [{ count: 0 }],
          quiz_data: result.data
        };
        
        setAssignments(prev => [assignment, ...prev]);
        setAiQuizzes(prev => [result.data, ...prev]);
      }
      
      return result;
    } catch (error) {
      console.error('AI Quiz generation error:', error);
      return { success: false, error: error.message };
    }
  }, [user, courses]);

  const getQuizSuggestions = useCallback(async (subject) => {
    try {
      const { aiQuizService } = await import('../services/aiQuizService');
      return await aiQuizService.getQuizSuggestions('', '', subject);
    } catch (error) {
      console.error('Quiz suggestions error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setLoading(false);
      // Keep hardcoded data even when not logged in for demo purposes
    }
  }, [user, fetchAllData]);

  return {
    // Data
    courses,
    students,
    assignments,
    analytics,
    aiRecommendations,
    studentProgress,
    aiQuizzes,
    
    // State
    loading,
    error,
    
    // Actions
    refreshData,
    fetchCourses,
    fetchStudents,
    fetchAssignments,
    createCourse,
    updateCourse,
    deleteCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    enrollStudent,
    unenrollStudent,
    
    // AI Quiz Functions
    generateAIQuiz,
    getQuizSuggestions
  };
};

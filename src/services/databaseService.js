import { supabase } from '../utils/supabase';

export const databaseService = {
  // Profile operations
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  // Course operations
  async getCourses(teacherId = null) {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey(full_name, role),
          course_enrollments(count)
        `)
        .order('created_at', { ascending: false });

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async createCourse(courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select(`
          *,
          profiles!courses_teacher_id_fkey(full_name, role)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async updateCourse(courseId, updates) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .select(`
          *,
          profiles!courses_teacher_id_fkey(full_name, role)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async deleteCourse(courseId) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Student operations
  async getStudents(teacherId = null) {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name');

      if (teacherId) {
        // Get students enrolled in teacher's courses
        const { data: courseIds } = await supabase
          .from('courses')
          .select('id')
          .eq('teacher_id', teacherId);

        if (courseIds && courseIds.length > 0) {
          const { data: enrollments } = await supabase
            .from('course_enrollments')
            .select('student_id')
            .in('course_id', courseIds.map(c => c.id));

          if (enrollments && enrollments.length > 0) {
            query = query.in('id', enrollments.map(e => e.student_id));
          }
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async getStudentProgress(studentId) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          score,
          assignments!inner(
            course_id,
            points,
            courses!inner(name, subject)
          )
        `)
        .eq('student_id', studentId)
        .eq('status', 'graded');
      
      if (error) throw error;
      
      // Calculate progress by subject
      const progress = {};
      data.forEach(submission => {
        const subject = submission.assignments.courses.subject || 'general';
        if (!progress[subject]) {
          progress[subject] = { total: 0, earned: 0 };
        }
        progress[subject].total += submission.assignments.points;
        progress[subject].earned += submission.score || 0;
      });

      // Convert to percentages
      Object.keys(progress).forEach(subject => {
        const { total, earned } = progress[subject];
        progress[subject] = total > 0 ? Math.round((earned / total) * 100) : 0;
      });

      return { success: true, data: progress, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  // Assignment operations
  async getAssignments(courseId = null) {
    try {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          courses!inner(name, subject),
          submissions(count)
        `)
        .order('due_date', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async createAssignment(assignmentData) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select(`
          *,
          courses!inner(name, subject)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async updateAssignment(assignmentId, updates) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select(`
          *,
          courses!inner(name, subject)
        `)
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async deleteAssignment(assignmentId) {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Course enrollment operations
  async enrollStudent(courseId, studentId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([{ course_id: courseId, student_id: studentId }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  async unenrollStudent(courseId, studentId) {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('course_id', courseId)
        .eq('student_id', studentId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Analytics and insights
  async getAnalytics(teacherId = null) {
    try {
      const [coursesResult, assignmentsResult, studentsResult] = await Promise.all([
        this.getCourses(teacherId),
        this.getAssignments(),
        this.getStudents(teacherId)
      ]);

      if (!coursesResult.success || !assignmentsResult.success || !studentsResult.success) {
        throw new Error('Failed to fetch analytics data');
      }

      const analytics = {
        totalCourses: coursesResult.data?.length || 0,
        totalStudents: studentsResult.data?.length || 0,
        totalAssignments: assignmentsResult.data?.length || 0,
        avgPerformance: 0,
        recentActivity: []
      };

      // Calculate average performance
      if (assignmentsResult.data?.length > 0) {
        const totalPoints = assignmentsResult.data.reduce((sum, assignment) => sum + (assignment.points || 0), 0);
        const totalSubmissions = assignmentsResult.data.reduce((sum, assignment) => sum + (assignment.submissions?.[0]?.count || 0), 0);
        analytics.avgPerformance = totalSubmissions > 0 ? Math.round((totalSubmissions / totalPoints) * 100) : 0;
      }

      return { success: true, data: analytics, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },

  // AI recommendations (placeholder for future AI integration)
  async getAIRecommendations(teacherId) {
    try {
      // This would integrate with your AI service
      // For now, return mock data that could be replaced with real AI
      const recommendations = [
        {
          id: 1,
          type: 'content',
          title: 'Interactive Fraction Tutorial',
          subject: 'Math',
          reason: 'Based on recent quiz performance',
          priority: 'high'
        },
        {
          id: 2,
          type: 'practice',
          title: 'Grammar Exercises',
          subject: 'English',
          reason: 'Reinforce weak areas',
          priority: 'medium'
        },
        {
          id: 3,
          type: 'enrichment',
          title: 'Advanced Science Lab',
          subject: 'Science',
          reason: 'Student showing mastery',
          priority: 'low'
        }
      ];

      return { success: true, data: recommendations, error: null };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }
};


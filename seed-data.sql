-- Sample data for Dynamic Active LMS
-- Run this after setting up the main database schema

-- Insert sample courses (replace 'your-teacher-id' with actual teacher UUID)
INSERT INTO public.courses (name, description, teacher_id, grade_level, subject) VALUES
('Mathematics Grade 7', 'Introduction to algebra and geometry concepts', 'f1d842c2-3dae-4216-b8d5-fbb261ad84f4', '7', 'Math'),
('Science Grade 7', 'Life sciences and basic chemistry', 'your-teacher-id', '7', 'Science'),
('English Literature', 'Reading comprehension and creative writing', 'your-teacher-id', '7', 'English'),
('World History', 'Ancient civilizations and world events', 'your-teacher-id', '7', 'History');

-- Insert sample assignments (replace course IDs with actual ones from above)
INSERT INTO public.assignments (course_id, title, description, due_date, points, assignment_type, auto_graded) VALUES
-- Math assignments
((SELECT id FROM public.courses WHERE name = 'Mathematics Grade 7' LIMIT 1), 
 'Algebra Quiz', 'Basic algebraic equations and problem solving', 
 NOW() + INTERVAL '3 days', 100, 'quiz', true),

((SELECT id FROM public.courses WHERE name = 'Mathematics Grade 7' LIMIT 1), 
 'Geometry Worksheet', 'Area and perimeter calculations', 
 NOW() + INTERVAL '5 days', 50, 'homework', false),

-- Science assignments
((SELECT id FROM public.courses WHERE name = 'Science Grade 7' LIMIT 1), 
 'Cell Structure Lab', 'Microscope observation and cell identification', 
 NOW() + INTERVAL '2 days', 100, 'project', false),

((SELECT id FROM public.courses WHERE name = 'Science Grade 7' LIMIT 1), 
 'Chemistry Quiz', 'Elements and compounds identification', 
 NOW() + INTERVAL '4 days', 75, 'quiz', true),

-- English assignments
((SELECT id FROM public.courses WHERE name = 'English Literature' LIMIT 1), 
 'Poetry Analysis', 'Analyze themes and literary devices in selected poems', 
 NOW() + INTERVAL '6 days', 100, 'homework', false),

((SELECT id FROM public.courses WHERE name = 'English Literature' LIMIT 1), 
 'Creative Writing', 'Write a short story using descriptive language', 
 NOW() + INTERVAL '7 days', 100, 'project', false),

-- History assignments
((SELECT id FROM public.courses WHERE name = 'World History' LIMIT 1), 
 'Ancient Egypt Research', 'Research project on Egyptian civilization', 
 NOW() + INTERVAL '10 days', 150, 'project', false),

((SELECT id FROM public.courses WHERE name = 'World History' LIMIT 1), 
 'Timeline Quiz', 'Important dates and events in world history', 
 NOW() + INTERVAL '5 days', 50, 'quiz', true);

-- Note: Student enrollments and submissions will be created automatically
-- when students sign up and submit assignments through the application

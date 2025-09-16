# Dynamic Active LMS - Complete Setup Instructions

## 🚀 Quick Start

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (IMPORTANT!)
Run the complete database setup script in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to execute all the commands

This will create:
- ✅ **profiles** table (extends auth.users)
- ✅ **courses** table
- ✅ **course_enrollments** table
- ✅ **assignments** table
- ✅ **submissions** table
- ✅ **Row Level Security (RLS)** policies
- ✅ **Triggers** for automatic profile creation
- ✅ **Indexes** for performance

### 4. Authentication Settings
In your Supabase dashboard:
1. Go to **Authentication > Settings**
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs as needed
4. Enable email confirmations if desired

### 5. Run the Application
```bash
npm start
```

## 📊 Database Schema Overview

### Core Tables

#### `profiles` (extends auth.users)
- Stores additional user information
- Links to auth.users via UUID
- Includes role, grade, school, etc.

#### `courses`
- Course information and metadata
- Linked to teacher profiles
- Supports grade levels and subjects

#### `course_enrollments`
- Many-to-many relationship between students and courses
- Tracks enrollment status and dates

#### `assignments`
- Assignment details and due dates
- Supports auto-grading flags
- Linked to courses

#### `submissions`
- Student submissions for assignments
- Includes scores, feedback, and status
- Supports file uploads

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** (students, teachers, admins)
- **Automatic profile creation** on user signup
- **Secure data isolation** between users

## 🔧 Advanced Configuration

### Customizing User Roles
You can add more roles by modifying the CHECK constraint:

```sql
ALTER TABLE public.profiles 
DROP CONSTRAINT profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'teacher', 'admin', 'parent', 'principal'));
```

### Adding Custom Fields
To add custom fields to profiles:

```sql
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN emergency_contact TEXT,
ADD COLUMN parent_email TEXT;
```

### Email Templates
Customize email templates in **Authentication > Email Templates**:
- Confirm signup
- Reset password
- Magic link
- Change email address

## 🚨 Troubleshooting

### Common Issues

1. **"relation does not exist" error**
   - Make sure you ran the complete `database-setup.sql` script
   - Check that all tables were created successfully

2. **Permission denied errors**
   - Verify RLS policies are correctly set up
   - Check that the user has the correct role

3. **Profile not created on signup**
   - Ensure the trigger function `handle_new_user()` exists
   - Check that the trigger `on_auth_user_created` is active

### Testing the Setup

1. **Test user registration** - Sign up with different roles
2. **Test profile creation** - Verify profiles are created automatically
3. **Test role-based access** - Ensure users only see appropriate data
4. **Test course creation** - Teachers should be able to create courses

## 📈 Next Steps

After setting up the database:

1. **Test the authentication flow**
2. **Create sample courses and assignments**
3. **Enroll test students in courses**
4. **Test the assignment submission system**
5. **Customize the UI based on user roles**

The application now has a complete, production-ready database schema with proper security and relationships!
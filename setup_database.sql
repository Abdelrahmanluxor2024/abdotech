-- ==============================================================================
-- 🛠️ SUPABASE COMPLETE DATABASE SETUP SCRIPT
-- ==============================================================================
-- This script sets up the user profiles trigger, comments (guestbook),
-- and contact messages for starting conversations.
--
-- Instructions:
-- 1. Go to your Supabase Dashboard (https://supabase.com)
-- 2. Open your project
-- 3. Go to the "SQL Editor" section on the left menu
-- 4. Click "New Query"
-- 5. Copy and paste this entire script and click "Run"
-- ==============================================================================

-- 1️⃣ Enable UUID Generation Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2️⃣ User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    phone TEXT,
    country TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.user_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger Function: Create user profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql 
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url, username, phone, country)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'country', 'Egypt')
    );
    RETURN NEW;
END;
$$;

-- Bind Trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3️⃣ Comments Table (Guestbook)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;

-- Create Policies for comments
CREATE POLICY "Anyone can view comments" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4️⃣ Contact Messages Table (Start Conversation Form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    project_idea TEXT NOT NULL,
    recipient_email TEXT DEFAULT 'assioutytech@gmail.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;

-- Create Policy: Anyone can insert messages, but they cannot read them (kept secure)
CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- 5️⃣ Auto-Confirm Existing Users (Optional: helpful for testing)
UPDATE auth.users 
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{email_verified}',
        'true'
    )
WHERE email_confirmed_at IS NULL;

-- SPON Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('fan', 'athlete')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athletes table (additional info for athlete users)
CREATE TABLE public.athletes (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  sport TEXT NOT NULL,
  region TEXT NOT NULL,
  team TEXT,
  tags TEXT[] DEFAULT '{}',
  follower_count INT DEFAULT 0,
  supporter_count INT DEFAULT 0,
  total_support INT DEFAULT 0,
  social_links JSONB DEFAULT '{}'
);

-- Posts table
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'supporters')),
  like_count INT DEFAULT 0,
  support_count INT DEFAULT 0,
  total_support_amount INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_best_shot BOOLEAN DEFAULT FALSE,
  like_count INT DEFAULT 0,
  support_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table (BeReal-like)
CREATE TABLE public.stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'supporters')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follows table
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, athlete_id)
);

-- Supports (donations) table
CREATE TABLE public.supports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  amount INT NOT NULL CHECK (amount >= 100),
  purpose TEXT NOT NULL CHECK (purpose IN ('travel', 'equipment', 'food', 'transport', 'coaching', 'other')),
  message TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypay', 'credit', 'convenience')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Board posts table
CREATE TABLE public.board_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections (saved photos)
CREATE TABLE public.collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, photo_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Athletes: Anyone can read
CREATE POLICY "Athletes are viewable by everyone" ON public.athletes FOR SELECT USING (true);
CREATE POLICY "Athletes can update own profile" ON public.athletes FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Athletes can insert own profile" ON public.athletes FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Public posts viewable by all, visibility-restricted for followers/supporters
CREATE POLICY "Public posts viewable by all" ON public.posts FOR SELECT USING (visibility = 'public' OR athlete_id = auth.uid());
CREATE POLICY "Athletes can manage own posts" ON public.posts FOR ALL USING (athlete_id = auth.uid());

-- Photos: Similar to posts
CREATE POLICY "Photos viewable by all" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Athletes can manage own photos" ON public.photos FOR ALL USING (athlete_id = auth.uid());

-- Stories: Check visibility and expiry
CREATE POLICY "Non-expired stories viewable" ON public.stories FOR SELECT USING (expires_at > NOW() AND (visibility = 'public' OR athlete_id = auth.uid()));
CREATE POLICY "Athletes can manage own stories" ON public.stories FOR ALL USING (athlete_id = auth.uid());

-- Follows: Users can manage their own follows
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (follower_id = auth.uid());

-- Supports: Users can view their own and athletes can view supports to them
CREATE POLICY "Users can view own supports" ON public.supports FOR SELECT USING (fan_id = auth.uid() OR athlete_id = auth.uid());
CREATE POLICY "Users can insert supports" ON public.supports FOR INSERT WITH CHECK (fan_id = auth.uid());

-- Board posts: All can read, supporters can post
CREATE POLICY "Board posts are viewable" ON public.board_posts FOR SELECT USING (is_deleted = FALSE);
CREATE POLICY "Users can insert board posts" ON public.board_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors and athletes can delete" ON public.board_posts FOR UPDATE USING (author_id = auth.uid());

-- Collections: Users can manage their own
CREATE POLICY "Users can view own collections" ON public.collections FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own collections" ON public.collections FOR ALL USING (user_id = auth.uid());

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'fan')
  );
  
  -- If user is athlete, also create athlete record
  IF NEW.raw_user_meta_data->>'user_type' = 'athlete' THEN
    INSERT INTO public.athletes (id, sport, region)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'sport', 'その他'),
      COALESCE(NEW.raw_user_meta_data->>'region', '未設定')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export type DbProfile = {
    id: string
    email: string
    name: string
    user_type: 'fan' | 'athlete'
    avatar_url: string | null
    bio: string | null
    created_at: string
    updated_at: string
}

export type DbAthlete = {
    id: string
    sport: string
    region: string
    team: string | null
    tags: string[]
    follower_count: number
    supporter_count: number
    total_support: number
    social_links: Record<string, string>
}

export type DbPost = {
    id: string
    athlete_id: string
    caption: string | null
    visibility: 'public' | 'followers' | 'supporters'
    like_count: number
    support_count: number
    total_support_amount: number
    created_at: string
}

export type DbPhoto = {
    id: string
    athlete_id: string
    post_id: string | null
    url: string
    caption: string | null
    is_best_shot: boolean
    like_count: number
    support_count: number
    created_at: string
}

export type DbSupport = {
    id: string
    fan_id: string
    athlete_id: string
    post_id: string | null
    amount: number
    purpose: 'travel' | 'equipment' | 'food' | 'transport' | 'coaching' | 'other'
    message: string | null
    payment_method: 'paypay' | 'credit' | 'convenience'
    created_at: string
}

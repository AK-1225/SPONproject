import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, UserType } from '@/types'
import { useAthleteStore } from '@/stores/athleteStore'

// Generate a random user handle
const generateUserHandle = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `@${result}`
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (email: string, password: string, name: string, userType: UserType) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    updateProfile: (updates: Partial<User>) => Promise<void>
    checkSession: () => Promise<void>
    checkHandleAvailable: (handle: string) => Promise<boolean>
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            checkSession: async () => {
                set({ isLoading: true })
                try {
                    const { data: { session } } = await supabase.auth.getSession()

                    if (session?.user) {
                        // Fetch profile from database
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()

                        if (profile) {
                            const user: User = {
                                id: profile.id,
                                email: profile.email,
                                name: profile.name,
                                userType: profile.user_type,
                                userHandle: profile.user_handle || generateUserHandle(),
                                avatarUrl: profile.avatar_url,
                                bio: profile.bio,
                                createdAt: profile.created_at,
                            }
                            set({ user, isAuthenticated: true })
                        }
                    }
                } catch (error) {
                    console.error('Session check error:', error)
                } finally {
                    set({ isLoading: false })
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true })

                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (error) {
                        set({ isLoading: false })
                        return { success: false, error: error.message }
                    }

                    if (data.user) {
                        // Fetch profile from database
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()

                        if (profile) {
                            const user: User = {
                                id: profile.id,
                                email: profile.email,
                                name: profile.name,
                                userType: profile.user_type,
                                userHandle: profile.user_handle || generateUserHandle(),
                                avatarUrl: profile.avatar_url,
                                bio: profile.bio,
                                createdAt: profile.created_at,
                            }
                            set({ user, isAuthenticated: true, isLoading: false })
                            return { success: true }
                        }
                    }

                    set({ isLoading: false })
                    return { success: false, error: 'プロフィールの取得に失敗しました' }
                } catch (error) {
                    set({ isLoading: false })
                    return { success: false, error: 'ログインに失敗しました' }
                }
            },

            register: async (email: string, password: string, name: string, userType: UserType) => {
                set({ isLoading: true })

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                name,
                                user_type: userType,
                            },
                        },
                    })

                    if (error) {
                        set({ isLoading: false })
                        return { success: false, error: error.message }
                    }

                    if (data.user) {
                        const userHandle = generateUserHandle()
                        const user: User = {
                            id: data.user.id,
                            email,
                            name,
                            userType,
                            userHandle,
                            createdAt: new Date().toISOString(),
                        }
                        set({ user, isAuthenticated: true, isLoading: false })

                        // If registering as athlete, sync with athleteStore
                        if (userType === 'athlete') {
                            useAthleteStore.getState().registerAthlete({
                                id: data.user.id,
                                email,
                                name,
                                userHandle,
                            })
                        }

                        return { success: true }
                    }

                    set({ isLoading: false })
                    return { success: false, error: '登録に失敗しました' }
                } catch (error) {
                    set({ isLoading: false })
                    return { success: false, error: '登録に失敗しました' }
                }
            },

            logout: async () => {
                await supabase.auth.signOut()
                set({ user: null, isAuthenticated: false })
            },

            updateProfile: async (updates: Partial<User>) => {
                const { user } = get()
                if (!user) return

                // Update local state immediately (don't wait for Supabase)
                const updatedUser = { ...user, ...updates }
                set({ user: updatedUser })

                // Sync to athleteStore for athletes
                if (user.userType === 'athlete') {
                    useAthleteStore.getState().updateAthleteProfile(user.id, {
                        name: updates.name,
                        avatarUrl: updates.avatarUrl,
                        bio: updates.bio,
                        sport: updates.sport,
                        region: updates.region,
                        team: updates.team,
                    })
                }

                // Fire-and-forget: Sync to Supabase in background (no await)
                supabase
                    .from('profiles')
                    .update({
                        name: updates.name,
                        avatar_url: updates.avatarUrl,
                        bio: updates.bio,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id)
                    .then(({ error }) => {
                        if (error) {
                            console.warn('Supabase profile update failed:', error.message)
                        }
                    })
            },

            // Check if a user handle is available
            checkHandleAvailable: async (_handle: string): Promise<boolean> => {
                // In production, check against database
                // For now, always return true (mock)
                return true
            },

            // Send password reset email
            resetPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                    })

                    if (error) {
                        return { success: false, error: error.message }
                    }

                    return { success: true }
                } catch (error) {
                    return { success: false, error: 'パスワードリセットメールの送信に失敗しました' }
                }
            },
        }),
        {
            name: 'spon-auth',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)

// Listen to auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
        useAuthStore.setState({ user: null, isAuthenticated: false })
    } else if (event === 'SIGNED_IN' && session?.user) {
        // Refresh profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

        if (profile) {
            const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                userType: profile.user_type,
                userHandle: profile.user_handle || `@${profile.id.slice(0, 8)}`,
                avatarUrl: profile.avatar_url,
                bio: profile.bio,
                createdAt: profile.created_at,
            }
            useAuthStore.setState({ user, isAuthenticated: true })
        }
    }
})

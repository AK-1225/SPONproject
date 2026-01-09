import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { Support, SupportPurpose, PaymentMethod, UserTier } from '@/types'

interface SupportState {
    supportHistory: Support[]
    athleteSupports: Record<string, number>
    isLoading: boolean
    // Actions
    addSupport: (support: Omit<Support, 'id' | 'createdAt'>) => Promise<boolean>
    fetchSupportHistory: (fanId: string) => Promise<void>
    getTierForAthlete: (athleteId: string, isFollowing: boolean) => UserTier
    getTotalForAthlete: (athleteId: string) => number
}

export const useSupportStore = create<SupportState>()(
    persist(
        (set, get) => ({
            supportHistory: [],
            athleteSupports: {},
            isLoading: false,

            addSupport: async (supportData) => {
                set({ isLoading: true })

                try {
                    // Insert into Supabase
                    const { data, error } = await supabase
                        .from('supports')
                        .insert({
                            fan_id: supportData.fanId,
                            athlete_id: supportData.athleteId,
                            post_id: supportData.postId || null,
                            amount: supportData.amount,
                            purpose: supportData.purpose,
                            message: supportData.message || null,
                            payment_method: supportData.paymentMethod,
                        })
                        .select()
                        .single()

                    if (error) {
                        console.error('Support insert error:', error)
                        // Fall back to local storage if DB fails
                        const support: Support = {
                            ...supportData,
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                        }

                        set(state => {
                            const currentAmount = state.athleteSupports[supportData.athleteId] || 0
                            return {
                                supportHistory: [...state.supportHistory, support],
                                athleteSupports: {
                                    ...state.athleteSupports,
                                    [supportData.athleteId]: currentAmount + supportData.amount
                                },
                                isLoading: false
                            }
                        })
                        return true
                    }

                    if (data) {
                        const support: Support = {
                            id: data.id,
                            fanId: data.fan_id,
                            athleteId: data.athlete_id,
                            postId: data.post_id,
                            amount: data.amount,
                            purpose: data.purpose,
                            message: data.message,
                            paymentMethod: data.payment_method,
                            createdAt: data.created_at,
                        }

                        set(state => {
                            const currentAmount = state.athleteSupports[supportData.athleteId] || 0
                            return {
                                supportHistory: [...state.supportHistory, support],
                                athleteSupports: {
                                    ...state.athleteSupports,
                                    [supportData.athleteId]: currentAmount + supportData.amount
                                },
                                isLoading: false
                            }
                        })
                        return true
                    }

                    set({ isLoading: false })
                    return false
                } catch (error) {
                    console.error('Support error:', error)
                    set({ isLoading: false })
                    return false
                }
            },

            fetchSupportHistory: async (fanId: string) => {
                try {
                    const { data, error } = await supabase
                        .from('supports')
                        .select('*')
                        .eq('fan_id', fanId)
                        .order('created_at', { ascending: false })

                    if (!error && data) {
                        const supports: Support[] = data.map(s => ({
                            id: s.id,
                            fanId: s.fan_id,
                            athleteId: s.athlete_id,
                            postId: s.post_id,
                            amount: s.amount,
                            purpose: s.purpose,
                            message: s.message,
                            paymentMethod: s.payment_method,
                            createdAt: s.created_at,
                        }))

                        const athleteSupports: Record<string, number> = {}
                        supports.forEach(s => {
                            athleteSupports[s.athleteId] = (athleteSupports[s.athleteId] || 0) + s.amount
                        })

                        set({ supportHistory: supports, athleteSupports })
                    }
                } catch (error) {
                    console.error('Fetch support history error:', error)
                }
            },

            getTierForAthlete: (athleteId: string, isFollowing: boolean) => {
                const totalSupport = get().athleteSupports[athleteId] || 0
                if (totalSupport >= 100) return 'supporter'
                if (isFollowing) return 'follower'
                return 'general'
            },

            getTotalForAthlete: (athleteId: string) => {
                return get().athleteSupports[athleteId] || 0
            },
        }),
        {
            name: 'spon-support',
        }
    )
)

// Support purpose labels
export const supportPurposeLabels: Record<SupportPurpose, string> = {
    travel: '遠征費',
    equipment: '用具代',
    food: '食費',
    transport: '交通費',
    coaching: 'コーチング費',
    other: 'その他',
}

// Payment method labels
export const paymentMethodLabels: Record<PaymentMethod, string> = {
    paypay: 'PayPay',
    credit: 'クレジットカード',
    convenience: 'コンビニ払い',
}

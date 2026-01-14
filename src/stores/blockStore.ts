import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BlockState {
    blockedUsers: Record<string, string[]> // athleteId -> array of blocked userIds
    // Actions
    blockUser: (athleteId: string, userId: string) => void
    unblockUser: (athleteId: string, userId: string) => void
    isBlocked: (athleteId: string, userId: string) => boolean
    getBlockedUsers: (athleteId: string) => string[]
}

export const useBlockStore = create<BlockState>()(
    persist(
        (set, get) => ({
            blockedUsers: {},

            blockUser: (athleteId: string, userId: string) => {
                set(state => {
                    const currentBlocked = state.blockedUsers[athleteId] || []
                    if (currentBlocked.includes(userId)) return state
                    return {
                        blockedUsers: {
                            ...state.blockedUsers,
                            [athleteId]: [...currentBlocked, userId]
                        }
                    }
                })
            },

            unblockUser: (athleteId: string, userId: string) => {
                set(state => {
                    const currentBlocked = state.blockedUsers[athleteId] || []
                    return {
                        blockedUsers: {
                            ...state.blockedUsers,
                            [athleteId]: currentBlocked.filter(id => id !== userId)
                        }
                    }
                })
            },

            isBlocked: (athleteId: string, userId: string) => {
                const blocked = get().blockedUsers[athleteId] || []
                return blocked.includes(userId)
            },

            getBlockedUsers: (athleteId: string) => {
                return get().blockedUsers[athleteId] || []
            },
        }),
        {
            name: 'spon-blocks',
        }
    )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LikesState {
    // Post ID -> liked status
    likedPosts: Record<string, boolean>
    // Post ID -> bookmark status
    bookmarkedPosts: Record<string, boolean>
    // Actions
    toggleLike: (postId: string) => void
    toggleBookmark: (postId: string) => void
    isLiked: (postId: string) => boolean
    isBookmarked: (postId: string) => boolean
}

export const useLikesStore = create<LikesState>()(
    persist(
        (set, get) => ({
            likedPosts: {},
            bookmarkedPosts: {},

            toggleLike: (postId: string) => {
                set(state => ({
                    likedPosts: {
                        ...state.likedPosts,
                        [postId]: !state.likedPosts[postId]
                    }
                }))
            },

            toggleBookmark: (postId: string) => {
                set(state => ({
                    bookmarkedPosts: {
                        ...state.bookmarkedPosts,
                        [postId]: !state.bookmarkedPosts[postId]
                    }
                }))
            },

            isLiked: (postId: string) => {
                return get().likedPosts[postId] || false
            },

            isBookmarked: (postId: string) => {
                return get().bookmarkedPosts[postId] || false
            },
        }),
        {
            name: 'spon-likes',
        }
    )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Comment {
    id: string
    postId: string
    authorId: string
    authorName: string
    authorAvatarUrl?: string
    content: string
    createdAt: string
}

interface CommentStore {
    comments: Comment[]
    addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
    getCommentsForPost: (postId: string) => Comment[]
    deleteComment: (commentId: string) => void
}

export const useCommentStore = create<CommentStore>()(
    persist(
        (set, get) => ({
            comments: [],

            addComment: (comment) => {
                const newComment: Comment = {
                    ...comment,
                    id: `comment-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                }
                set((state) => ({
                    comments: [...state.comments, newComment],
                }))
            },

            getCommentsForPost: (postId) => {
                return get().comments.filter(c => c.postId === postId)
            },

            deleteComment: (commentId) => {
                set((state) => ({
                    comments: state.comments.filter(c => c.id !== commentId),
                }))
            },
        }),
        {
            name: 'spon-comments',
        }
    )
)

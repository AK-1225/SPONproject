import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Post, Story, Photo, Athlete } from '@/types'
import { mockAthletes, mockPosts, mockStories } from '@/data/mockData'

interface NewPostInput {
    athleteId: string
    caption: string
    tags: string[]
    imageUrl?: string
    isBestShot?: boolean
}

interface AthleteState {
    athletes: Athlete[]
    posts: Post[]
    stories: Story[]
    following: string[]
    collection: Photo[]
    // Actions
    followAthlete: (athleteId: string) => void
    unfollowAthlete: (athleteId: string) => void
    isFollowing: (athleteId: string) => boolean
    addToCollection: (photo: Photo) => void
    removeFromCollection: (photoId: string) => void
    getAthlete: (athleteId: string) => Athlete | undefined
    getPostsForAthlete: (athleteId: string) => Post[]
    getStoriesForAthlete: (athleteId: string) => Story[]
    addPost: (input: NewPostInput) => void
}

export const useAthleteStore = create<AthleteState>()(
    persist(
        (set, get) => ({
            athletes: mockAthletes,
            posts: mockPosts,
            stories: mockStories,
            following: [],
            collection: [],

            followAthlete: (athleteId: string) => {
                set(state => ({
                    following: [...state.following, athleteId]
                }))
            },

            unfollowAthlete: (athleteId: string) => {
                set(state => ({
                    following: state.following.filter(id => id !== athleteId)
                }))
            },

            isFollowing: (athleteId: string) => {
                return get().following.includes(athleteId)
            },

            addToCollection: (photo: Photo) => {
                set(state => ({
                    collection: [...state.collection, photo]
                }))
            },

            removeFromCollection: (photoId: string) => {
                set(state => ({
                    collection: state.collection.filter(p => p.id !== photoId)
                }))
            },

            getAthlete: (athleteId: string) => {
                return get().athletes.find(a => a.id === athleteId)
            },

            getPostsForAthlete: (athleteId: string) => {
                return get().posts.filter(p => p.athleteId === athleteId)
            },

            getStoriesForAthlete: (athleteId: string) => {
                return get().stories.filter(s => s.athleteId === athleteId)
            },

            addPost: (input: NewPostInput) => {
                const postId = `post-${Date.now()}`
                const now = new Date().toISOString()

                const photo: Photo = {
                    id: `photo-${postId}`,
                    athleteId: input.athleteId,
                    postId,
                    url: input.imageUrl || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop',
                    caption: input.caption,
                    isBestShot: input.isBestShot || false,
                    likeCount: 0,
                    supportCount: 0,
                    createdAt: now,
                }

                const newPost: Post = {
                    id: postId,
                    athleteId: input.athleteId,
                    photos: [photo],
                    caption: input.caption,
                    visibility: 'public',
                    tags: input.tags,
                    likeCount: 0,
                    supportCount: 0,
                    totalSupportAmount: 0,
                    createdAt: now,
                }

                set(state => ({
                    posts: [newPost, ...state.posts],
                    // If it's a best shot, also add to athlete's best shots
                    athletes: input.isBestShot
                        ? state.athletes.map(a =>
                            a.id === input.athleteId
                                ? { ...a, bestShots: [photo, ...a.bestShots].slice(0, 6) }
                                : a
                        )
                        : state.athletes
                }))
            },
        }),
        {
            name: 'spon-athlete',
            partialize: (state) => ({
                following: state.following,
                collection: state.collection,
                posts: state.posts,
            }),
        }
    )
)

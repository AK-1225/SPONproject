import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Post, Story, Photo, Athlete } from '@/types'
import { mockAthletes, mockPosts, mockStories } from '@/data/mockData'

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
        }),
        {
            name: 'spon-athlete',
            partialize: (state) => ({
                following: state.following,
                collection: state.collection
            }),
        }
    )
)

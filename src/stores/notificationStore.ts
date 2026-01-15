import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType =
    | 'like'
    | 'comment'
    | 'support'
    | 'follow'
    | 'new_post'
    | 'thank_you'
    | 'reply'

export interface Notification {
    id: string
    type: NotificationType
    userId: string // Who this notification is for
    fromUserId: string
    fromUserName: string
    fromUserAvatar?: string
    message: string
    postId?: string
    amount?: number
    isRead: boolean
    createdAt: string
}

interface NotificationState {
    notifications: Notification[]
    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void
    markAsRead: (notificationId: string) => void
    markAllAsRead: (userId: string) => void
    getUnreadCount: (userId: string) => number
    getNotificationsForUser: (userId: string) => Notification[]
    clearNotifications: (userId: string) => void
}

// Notification message templates
export const getNotificationMessage = (
    type: NotificationType,
    fromName: string,
    extra?: { amount?: number; comment?: string }
): string => {
    switch (type) {
        case 'like':
            return `${fromName}さんがあなたの投稿にいいねしました`
        case 'comment':
            return `${fromName}さんがコメントしました${extra?.comment ? `: "${extra.comment.slice(0, 30)}..."` : ''}`
        case 'support':
            return `${fromName}さんから¥${extra?.amount?.toLocaleString() || 0}円の支援を受け取りました`
        case 'follow':
            return `${fromName}さんにフォローされました`
        case 'new_post':
            return `フォロー中の${fromName}さんが新しい投稿をしました`
        case 'thank_you':
            return `${fromName}選手からお礼メッセージが届きました`
        case 'reply':
            return `${fromName}さんがあなたのコメントに返信しました`
        default:
            return '通知があります'
    }
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],

            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: `notif-${Date.now()}`,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 100) // Keep last 100
                }))
            },

            markAsRead: (notificationId) => {
                set(state => ({
                    notifications: state.notifications.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                }))
            },

            markAllAsRead: (userId) => {
                set(state => ({
                    notifications: state.notifications.map(n =>
                        n.userId === userId ? { ...n, isRead: true } : n
                    )
                }))
            },

            getUnreadCount: (userId) => {
                return get().notifications.filter(n => n.userId === userId && !n.isRead).length
            },

            getNotificationsForUser: (userId) => {
                return get().notifications.filter(n => n.userId === userId)
            },

            clearNotifications: (userId) => {
                set(state => ({
                    notifications: state.notifications.filter(n => n.userId !== userId)
                }))
            },
        }),
        {
            name: 'spon-notifications',
        }
    )
)

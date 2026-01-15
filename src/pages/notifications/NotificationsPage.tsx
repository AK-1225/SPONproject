import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCheck, Bell, Heart, MessageCircle, Gift, UserPlus, Image } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore, NotificationType } from '@/stores/notificationStore'
import { formatDistanceToNow } from '@/utils/formatDate'
import './notifications.css'

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'like':
            return <Heart className="notif-icon like" size={18} />
        case 'comment':
        case 'reply':
            return <MessageCircle className="notif-icon comment" size={18} />
        case 'support':
            return <Gift className="notif-icon support" size={18} />
        case 'follow':
            return <UserPlus className="notif-icon follow" size={18} />
        case 'new_post':
            return <Image className="notif-icon post" size={18} />
        case 'thank_you':
            return <Heart className="notif-icon thanks" size={18} />
        default:
            return <Bell className="notif-icon" size={18} />
    }
}

export default function NotificationsPage() {
    const { user, isAuthenticated } = useAuthStore()
    const { getNotificationsForUser, markAsRead, markAllAsRead, getUnreadCount } = useNotificationStore()

    if (!isAuthenticated || !user) {
        return (
            <div className="empty-state">
                <div className="icon">🔔</div>
                <h3>ログインしてください</h3>
                <p>通知を見るにはログインが必要です</p>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    ログイン
                </Link>
            </div>
        )
    }

    const notifications = getNotificationsForUser(user.id)
    const unreadCount = getUnreadCount(user.id)

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <Link to="/" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1>通知</h1>
                {unreadCount > 0 && (
                    <button
                        className="mark-all-read"
                        onClick={() => markAllAsRead(user.id)}
                    >
                        <CheckCheck size={18} />
                        すべて既読
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🔔</div>
                    <h3>通知はありません</h3>
                    <p>いいねやコメントなどの反応があると、ここに表示されます</p>
                </div>
            ) : (
                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="notification-icon-wrapper">
                                {notification.fromUserAvatar ? (
                                    <img
                                        src={notification.fromUserAvatar}
                                        alt=""
                                        className="notification-avatar"
                                    />
                                ) : (
                                    <div className="notification-avatar-placeholder">👤</div>
                                )}
                                <div className="notification-type-icon">
                                    {getNotificationIcon(notification.type)}
                                </div>
                            </div>
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">
                                    {formatDistanceToNow(notification.createdAt)}
                                </span>
                            </div>
                            {!notification.isRead && (
                                <div className="unread-dot" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

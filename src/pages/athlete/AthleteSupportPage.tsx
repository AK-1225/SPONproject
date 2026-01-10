import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Gift, TrendingUp, Users, ChevronRight, X, Send } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSupportStore, supportPurposeLabels } from '@/stores/supportStore'
import { formatCurrency, formatDistanceToNow } from '@/utils/formatDate'
import './athlete-support.css'

interface UnconfirmedSupport {
    id: string
    fanId: string
    fanName: string
    fanAvatarUrl?: string
    amount: number
    purpose: string
    message?: string
    createdAt: string
    confirmed: boolean
}

export default function AthleteSupportPage() {
    const { user } = useAuthStore()
    const { supportHistory } = useSupportStore()

    const [showNotifications, setShowNotifications] = useState(false)
    const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
    const [thankYouMessage, setThankYouMessage] = useState('')
    const [swipeStart, setSwipeStart] = useState<number | null>(null)
    const [swipeOffset, setSwipeOffset] = useState(0)

    // Get supports received by this athlete
    const receivedSupports = useMemo(() => {
        if (!user) return []
        return supportHistory
            .filter(s => s.athleteId === user.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [supportHistory, user])

    // Mock unconfirmed supports (in real app, would come from DB)
    const unconfirmedSupports: UnconfirmedSupport[] = useMemo(() => {
        return receivedSupports
            .filter(s => !confirmedIds.has(s.id))
            .slice(0, 5)
            .map(s => ({
                ...s,
                fanName: `サポーター${s.fanId.slice(-4)}`,
                fanAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                confirmed: false,
            }))
    }, [receivedSupports, confirmedIds])

    // Stats
    const stats = useMemo(() => {
        const total = receivedSupports.reduce((sum, s) => sum + s.amount, 0)
        const byPurpose: Record<string, number> = {}
        receivedSupports.forEach(s => {
            byPurpose[s.purpose] = (byPurpose[s.purpose] || 0) + s.amount
        })
        return { total, byPurpose, count: receivedSupports.length }
    }, [receivedSupports])

    const currentNotification = unconfirmedSupports[currentNotificationIndex]

    const handleConfirm = () => {
        if (!currentNotification) return

        setConfirmedIds(prev => new Set([...prev, currentNotification.id]))

        if (currentNotificationIndex < unconfirmedSupports.length - 1) {
            setCurrentNotificationIndex(prev => prev + 1)
        } else {
            setShowNotifications(false)
            setCurrentNotificationIndex(0)
        }
        setThankYouMessage('')
    }

    const handleSendThankYou = () => {
        // In real app, would send message to supporter
        console.log('Thank you message:', thankYouMessage)
        handleConfirm()
    }

    // Swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setSwipeStart(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (swipeStart === null) return
        const diff = e.touches[0].clientX - swipeStart
        setSwipeOffset(diff)
    }

    const handleTouchEnd = () => {
        if (Math.abs(swipeOffset) > 100) {
            handleConfirm()
        }
        setSwipeStart(null)
        setSwipeOffset(0)
    }

    if (!user) return null

    return (
        <div className="athlete-support-page">
            {/* Header */}
            <div className="support-header">
                <Link to="/mypage" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <h1>支援確認</h1>
                <div style={{ width: 24 }} />
            </div>

            {/* Unconfirmed Notification Button */}
            {unconfirmedSupports.length > 0 && (
                <button
                    className="unconfirmed-btn"
                    onClick={() => setShowNotifications(true)}
                >
                    <Gift size={20} />
                    <span>未確認の支援が{unconfirmedSupports.length}件あります</span>
                    <ChevronRight size={20} />
                </button>
            )}

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-value">{formatCurrency(stats.total)}</div>
                    <div className="stat-label">累計支援額</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-value">{stats.count}件</div>
                    <div className="stat-label">支援回数</div>
                </div>
            </div>

            {/* Purpose Breakdown */}
            <div className="breakdown-section">
                <h2>用途別内訳</h2>
                <div className="breakdown-list">
                    {Object.entries(stats.byPurpose).map(([purpose, amount]) => (
                        <div key={purpose} className="breakdown-item">
                            <span className="purpose-label">
                                {supportPurposeLabels[purpose as keyof typeof supportPurposeLabels] || purpose}
                            </span>
                            <span className="purpose-amount">{formatCurrency(amount)}</span>
                        </div>
                    ))}
                    {Object.keys(stats.byPurpose).length === 0 && (
                        <p className="empty-text">まだ支援がありません</p>
                    )}
                </div>
            </div>

            {/* Support History */}
            <div className="history-section">
                <h2>支援履歴</h2>
                <div className="history-list">
                    {receivedSupports.slice(0, 20).map(support => (
                        <div key={support.id} className="history-item">
                            <div className="history-info">
                                <span className="history-amount">{formatCurrency(support.amount)}</span>
                                <span className="history-purpose">
                                    {supportPurposeLabels[support.purpose as keyof typeof supportPurposeLabels] || support.purpose}
                                </span>
                            </div>
                            <span className="history-time">{formatDistanceToNow(support.createdAt)}</span>
                        </div>
                    ))}
                    {receivedSupports.length === 0 && (
                        <p className="empty-text">まだ支援がありません</p>
                    )}
                </div>
            </div>

            {/* Withdrawal Link */}
            <Link to="/withdrawal" className="withdrawal-link">
                <span>💰 引き出し申請</span>
                <ChevronRight size={20} />
            </Link>

            {/* Notification Popup (Flashcard Style) */}
            {showNotifications && currentNotification && (
                <div className="notification-overlay" onClick={() => setShowNotifications(false)}>
                    <div
                        className="notification-card"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ transform: `translateX(${swipeOffset}px)` }}
                    >
                        <button className="close-btn" onClick={() => setShowNotifications(false)}>
                            <X size={24} />
                        </button>

                        <div className="notification-count">
                            {currentNotificationIndex + 1} / {unconfirmedSupports.length}
                        </div>

                        <div className="notification-content">
                            <img
                                src={currentNotification.fanAvatarUrl}
                                alt=""
                                className="fan-avatar"
                            />
                            <h3>{currentNotification.fanName}さんから</h3>
                            <p className="notification-amount">
                                {formatCurrency(currentNotification.amount)}
                            </p>
                            <p className="notification-purpose">
                                {supportPurposeLabels[currentNotification.purpose as keyof typeof supportPurposeLabels] || '応援'}として
                            </p>
                            {currentNotification.message && (
                                <p className="notification-message">
                                    「{currentNotification.message}」
                                </p>
                            )}
                        </div>

                        <div className="thank-you-section">
                            <input
                                type="text"
                                value={thankYouMessage}
                                onChange={(e) => setThankYouMessage(e.target.value)}
                                placeholder="お礼メッセージ（任意）"
                            />
                            {thankYouMessage && (
                                <button className="send-btn" onClick={handleSendThankYou}>
                                    <Send size={16} />
                                </button>
                            )}
                        </div>

                        <div className="notification-actions">
                            <button className="confirm-btn" onClick={handleConfirm}>
                                確認しました
                            </button>
                            <p className="swipe-hint">← スワイプで次へ →</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

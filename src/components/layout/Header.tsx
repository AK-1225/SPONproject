import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import './layout.css'

export default function Header() {
    const { isAuthenticated, user } = useAuthStore()
    const { getUnreadCount } = useNotificationStore()
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const unreadCount = user ? getUnreadCount(user.id) : 0

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/search')
        }
    }

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                SPON
            </Link>

            <form className="header-search" onSubmit={handleSearch}>
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="スポーツのカテゴリ・選手名を検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <div className="header-actions">
                {isAuthenticated ? (
                    <>
                        <Link to="/notifications" className="header-btn notification-btn" aria-label="通知">
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/mypage" className="header-btn" aria-label="マイページ">
                            <User size={22} />
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        ログイン
                    </Link>
                )}
            </div>
        </header>
    )
}

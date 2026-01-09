import { Link, useNavigate } from 'react-router-dom'
import { Heart, History, Settings, HelpCircle, ChevronRight, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSupportStore } from '@/stores/supportStore'
import { formatCurrency } from '@/utils/formatDate'
import './mypage.css'

export default function MyPage() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const { supportHistory } = useSupportStore()
    const navigate = useNavigate()

    if (!isAuthenticated || !user) {
        return (
            <div className="empty-state">
                <div className="icon">🔐</div>
                <h3>ログインしてください</h3>
                <p>マイページを見るにはログインが必要です</p>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    ログイン
                </Link>
            </div>
        )
    }

    const totalSupported = supportHistory.reduce((sum, s) => sum + s.amount, 0)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="mypage">
            {/* Header */}
            <div className="mypage-header">
                <div className="mypage-avatar">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                        '👤'
                    )}
                </div>
                <h1 className="mypage-name">{user.name}</h1>
                <p className="mypage-email">{user.email}</p>
                <div style={{ marginTop: '12px' }}>
                    <span className="badge badge-primary">
                        {user.userType === 'athlete' ? '🏃 選手' : '👋 ファン'}
                    </span>
                </div>
            </div>

            {/* Support Stats */}
            <div className="mypage-section">
                <div className="mypage-section-title">あなたの応援</div>
                <div className="menu-list">
                    <div className="menu-item">
                        <span className="icon">💰</span>
                        <span className="label">累計支援額</span>
                        <span className="value">{formatCurrency(totalSupported)}</span>
                    </div>
                    <div className="menu-item">
                        <span className="icon">🎁</span>
                        <span className="label">支援回数</span>
                        <span className="value">{supportHistory.length}回</span>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="mypage-section">
                <div className="mypage-section-title">メニュー</div>
                <div className="menu-list">
                    <Link to="/mypage/collection" className="menu-item">
                        <Heart size={20} className="icon" />
                        <span className="label">コレクション</span>
                        <ChevronRight size={20} className="arrow" />
                    </Link>
                    <Link to="/mypage/history" className="menu-item">
                        <History size={20} className="icon" />
                        <span className="label">支援履歴</span>
                        <ChevronRight size={20} className="arrow" />
                    </Link>
                    <Link to="/mypage/settings" className="menu-item">
                        <Settings size={20} className="icon" />
                        <span className="label">設定</span>
                        <ChevronRight size={20} className="arrow" />
                    </Link>
                    <div className="menu-item">
                        <HelpCircle size={20} className="icon" />
                        <span className="label">ヘルプ</span>
                        <ChevronRight size={20} className="arrow" />
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="menu-list">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    ログアウト
                </button>
            </div>
        </div>
    )
}

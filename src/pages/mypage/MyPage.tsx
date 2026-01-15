import { Link, useNavigate } from 'react-router-dom'
import { History, Settings, HelpCircle, ChevronRight, LogOut, Edit, Bookmark, Eye } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useSupportStore } from '@/stores/supportStore'
import { useLikesStore } from '@/stores/likesStore'
import { formatCurrency } from '@/utils/formatDate'
import './mypage.css'

export default function MyPage() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const { supportHistory } = useSupportStore()
    const { bookmarkedPosts } = useLikesStore()
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
    const bookmarkCount = Object.values(bookmarkedPosts).filter(Boolean).length
    const isAthlete = user.userType === 'athlete'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="mypage">
            {/* Header with Edit Button */}
            <div className="mypage-header">
                <Link to="/mypage/edit" className="edit-btn">
                    <Edit size={18} />
                </Link>
                <div className="mypage-avatar">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                        '👤'
                    )}
                </div>
                <h1 className="mypage-name">{user.name}</h1>
                <p className="mypage-email">{user.email}</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-primary">
                        {isAthlete ? '🏃 選手' : '👋 ファン'}
                    </span>
                    {isAthlete && (
                        <Link to={`/athlete/${user.id}`} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={14} />
                            プロフィールを見る
                        </Link>
                    )}
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
                        <Bookmark size={20} className="icon" />
                        <span className="label">コレクション</span>
                        <span className="value">{bookmarkCount}件</span>
                        <ChevronRight size={20} className="arrow" />
                    </Link>
                    <Link to="/mypage/history" className="menu-item">
                        <History size={20} className="icon" />
                        <span className="label">支援履歴</span>
                        <ChevronRight size={20} className="arrow" />
                    </Link>
                    {user.userType === 'athlete' && (
                        <>
                            <Link to="/mypage/supporters" className="menu-item">
                                <span className="icon">👥</span>
                                <span className="label">ファン・サポーター</span>
                                <ChevronRight size={20} className="arrow" />
                            </Link>
                            <Link to="/withdrawal" className="menu-item">
                                <span className="icon">💰</span>
                                <span className="label">引き出し申請</span>
                                <ChevronRight size={20} className="arrow" />
                            </Link>
                        </>
                    )}
                    <Link to="/mypage/edit" className="menu-item">
                        <Edit size={20} className="icon" />
                        <span className="label">プロフィール編集</span>
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

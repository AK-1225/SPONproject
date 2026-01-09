import { Link } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import './layout.css'

export default function Header() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                SPON
            </Link>

            <div className="header-actions">
                <Link to="/search" className="header-btn" aria-label="検索">
                    <Search size={22} />
                </Link>

                {isAuthenticated ? (
                    <>
                        <button className="header-btn" aria-label="通知">
                            <Bell size={22} />
                        </button>
                        <Link to="/mypage" className="header-btn" aria-label="マイページ">
                            <User size={22} />
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        ログイン
                    </Link>
                )}
            </div>
        </header>
    )
}

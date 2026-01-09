import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import './layout.css'

export default function Header() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

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
                        <button className="header-btn" aria-label="通知">
                            <Bell size={22} />
                        </button>
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

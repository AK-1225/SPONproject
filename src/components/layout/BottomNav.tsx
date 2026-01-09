import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Users, User } from 'lucide-react'
import './layout.css'

const navItems = [
    { path: '/', icon: Home, label: 'ホーム' },
    { path: '/search', icon: Search, label: '検索' },
    { path: '/following', icon: Users, label: '応援中' },
    { path: '/mypage', icon: User, label: 'マイページ' },
]

export default function BottomNav() {
    const location = useLocation()

    return (
        <nav className="bottom-nav">
            {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path ||
                    (path !== '/' && location.pathname.startsWith(path))

                return (
                    <Link
                        key={path}
                        to={path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={24} />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Users, User, Gift } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import './layout.css'

export default function BottomNav() {
    const location = useLocation()
    const { user } = useAuthStore()

    const isAthlete = user?.userType === 'athlete'

    // Different nav items for athletes vs fans
    const navItems = isAthlete
        ? [
            { path: '/', icon: Home, label: 'ホーム' },
            { path: '/search', icon: Search, label: '検索' },
            { path: '/athlete-support', icon: Gift, label: '支援' },
            { path: '/mypage', icon: User, label: 'マイページ' },
        ]
        : [
            { path: '/', icon: Home, label: 'ホーム' },
            { path: '/search', icon: Search, label: '検索' },
            { path: '/following', icon: Users, label: '応援中' },
            { path: '/mypage', icon: User, label: 'マイページ' },
        ]

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

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Star } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAthleteStore } from '@/stores/athleteStore'
import { useSupportStore } from '@/stores/supportStore'
import { formatCurrency } from '@/utils/formatDate'
import './mypage.css'

type TabType = 'followers' | 'supporters'

export default function SupportersPage() {
    const { user } = useAuthStore()
    const { athletes } = useAthleteStore()
    const { supportHistory } = useSupportStore()
    const [activeTab, setActiveTab] = useState<TabType>('followers')

    // Get current athlete data
    const currentAthlete = athletes.find(a => a.id === user?.id || a.email === user?.email)

    // Get followers (mock - in real app would query DB)
    const followers = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            id: `fan-${i + 1}`,
            name: `ファン${i + 1}`,
            avatarUrl: `https://i.pravatar.cc/100?img=${i + 10}`,
        }))
    }, [])

    // Get supporters with amounts
    const supporters = useMemo(() => {
        if (!user) return []

        const supportByFan: Record<string, number> = {}
        supportHistory
            .filter(s => s.athleteId === user.id)
            .forEach(s => {
                supportByFan[s.fanId] = (supportByFan[s.fanId] || 0) + s.amount
            })

        return Object.entries(supportByFan)
            .map(([fanId, amount]) => ({
                id: fanId,
                name: `サポーター${fanId.slice(-4)}`,
                avatarUrl: `https://i.pravatar.cc/100?img=${parseInt(fanId.slice(-2)) || 1}`,
                amount,
            }))
            .sort((a, b) => b.amount - a.amount)
    }, [supportHistory, user])

    if (!user) return null

    return (
        <div className="supporters-page">
            <div className="edit-header">
                <Link to="/mypage" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <h1>ファン・サポーター</h1>
                <div style={{ width: 24 }} />
            </div>

            <div className="supporter-stats">
                <div className="stat-item">
                    <Users size={20} />
                    <span>{currentAthlete?.followerCount || followers.length}人</span>
                    <label>フォロワー</label>
                </div>
                <div className="stat-item highlight">
                    <Star size={20} />
                    <span>{supporters.length}人</span>
                    <label>サポーター</label>
                </div>
            </div>

            <div className="tab-nav supporter-tabs">
                <button
                    className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('followers')}
                >
                    <Users size={16} />
                    フォロワー
                </button>
                <button
                    className={`tab-btn ${activeTab === 'supporters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('supporters')}
                >
                    <Star size={16} />
                    サポーター
                </button>
            </div>

            <div className="fan-list">
                {activeTab === 'followers' && (
                    <>
                        {followers.map(fan => (
                            <div key={fan.id} className="fan-item">
                                <img src={fan.avatarUrl} alt="" className="avatar" />
                                <span className="name">{fan.name}</span>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'supporters' && (
                    <>
                        {supporters.length > 0 ? (
                            supporters.map((supporter, index) => (
                                <div key={supporter.id} className="fan-item supporter">
                                    <div className="rank">
                                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}`}
                                    </div>
                                    <img src={supporter.avatarUrl} alt="" className="avatar" />
                                    <span className="name">{supporter.name}</span>
                                    <span className="amount">{formatCurrency(supporter.amount)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>まだサポーターがいません</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

import { Link } from 'react-router-dom'
import { useAthleteStore } from '@/stores/athleteStore'
import { useSupportStore } from '@/stores/supportStore'
import { formatCurrency } from '@/utils/formatDate'
import './following.css'

export default function FollowingPage() {
    const { athletes, following } = useAthleteStore()
    const { athleteSupports } = useSupportStore()

    // Get followed athletes with support info
    const followedAthletes = athletes.filter(a => following.includes(a.id))

    // Get supported athletes (those with support amount > 0)
    const supportedAthleteIds = Object.keys(athleteSupports).filter(id => athleteSupports[id] > 0)
    const supportedAthletes = athletes.filter(a => supportedAthleteIds.includes(a.id))

    return (
        <div className="following-page">
            <h1 className="page-title">応援中の選手</h1>

            {/* Supported Athletes Section */}
            {supportedAthletes.length > 0 && (
                <section className="following-section">
                    <h2 className="section-title">
                        💝 支援中 <span className="count">{supportedAthletes.length}人</span>
                    </h2>
                    <div className="athlete-list">
                        {supportedAthletes.map(athlete => (
                            <Link
                                key={athlete.id}
                                to={`/athlete/${athlete.id}`}
                                className="athlete-row"
                            >
                                <img
                                    src={athlete.avatarUrl || '/default-avatar.png'}
                                    alt={athlete.name}
                                    className="athlete-avatar"
                                />
                                <div className="athlete-info">
                                    <span className="athlete-name">{athlete.name}</span>
                                    <span className="athlete-sport">{athlete.sport}</span>
                                </div>
                                <div className="athlete-support">
                                    <span className="support-amount">
                                        {formatCurrency(athleteSupports[athlete.id] || 0)}
                                    </span>
                                    <span className="support-label">累計支援</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Following Athletes Section */}
            <section className="following-section">
                <h2 className="section-title">
                    👋 フォロー中 <span className="count">{followedAthletes.length}人</span>
                </h2>
                {followedAthletes.length > 0 ? (
                    <div className="athlete-list">
                        {followedAthletes.map(athlete => {
                            const supportAmount = athleteSupports[athlete.id] || 0
                            const isSupporter = supportAmount >= 100

                            return (
                                <Link
                                    key={athlete.id}
                                    to={`/athlete/${athlete.id}`}
                                    className="athlete-row"
                                >
                                    <img
                                        src={athlete.avatarUrl || '/default-avatar.png'}
                                        alt={athlete.name}
                                        className="athlete-avatar"
                                    />
                                    <div className="athlete-info">
                                        <div className="name-row">
                                            <span className="athlete-name">{athlete.name}</span>
                                            {isSupporter && (
                                                <span className="supporter-badge">⭐ サポーター</span>
                                            )}
                                        </div>
                                        <span className="athlete-sport">{athlete.sport} • {athlete.region}</span>
                                    </div>
                                    <div className="athlete-actions">
                                        <Link
                                            to={`/athlete/${athlete.id}/board`}
                                            className="action-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            💬
                                        </Link>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="icon">👀</div>
                        <h3>まだ誰もフォローしていません</h3>
                        <p>選手を見つけてフォローしましょう</p>
                        <Link to="/search" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            選手を探す
                        </Link>
                    </div>
                )}
            </section>
        </div>
    )
}

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Grid, MessageSquare, ShoppingBag, Radio, Star } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import { useSupportStore } from '@/stores/supportStore'
import PostCard from '@/components/athlete/PostCard'
import PaymentModal from '@/components/support/PaymentModal'
import { formatCurrency } from '@/utils/formatDate'
import './athlete.css'

type TabType = 'posts' | 'best' | 'board' | 'shop'

export default function AthleteProfilePage() {
    const { id } = useParams<{ id: string }>()
    const [activeTab, setActiveTab] = useState<TabType>('posts')
    const [showSupportModal, setShowSupportModal] = useState(false)

    const { getAthlete, getPostsForAthlete, isFollowing, followAthlete, unfollowAthlete } = useAthleteStore()
    const getTierForAthlete = useSupportStore(state => state.getTierForAthlete)

    const athlete = getAthlete(id!)
    const posts = getPostsForAthlete(id!)
    const following = isFollowing(id!)
    const tier = getTierForAthlete(id!, following)

    if (!athlete) {
        return (
            <div className="empty-state">
                <div className="icon">😕</div>
                <h3>選手が見つかりません</h3>
                <Link to="/search" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    選手を探す
                </Link>
            </div>
        )
    }

    const handleFollowClick = () => {
        if (following) {
            unfollowAthlete(athlete.id)
        } else {
            followAthlete(athlete.id)
        }
    }

    return (
        <div className="athlete-profile">
            {/* Profile Header */}
            <div className="profile-header">
                <img
                    src={athlete.avatarUrl || '/default-avatar.png'}
                    alt={athlete.name}
                    className="profile-avatar"
                />
                <h1 className="profile-name">{athlete.name}</h1>
                <div className="profile-sport">{athlete.sport}</div>
                <div className="profile-region">📍 {athlete.region}</div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{athlete.followerCount}</div>
                        <div className="stat-label">フォロワー</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{athlete.supporterCount}</div>
                        <div className="stat-label">サポーター</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{formatCurrency(athlete.totalSupport)}</div>
                        <div className="stat-label">累計支援</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                    <button
                        className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={handleFollowClick}
                    >
                        {following ? 'フォロー中' : 'フォローする'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowSupportModal(true)}
                    >
                        🎁 応援する
                    </button>
                </div>

                {/* Tier Badge */}
                {tier !== 'general' && (
                    <div style={{ marginTop: '12px' }}>
                        <span className={`badge ${tier === 'supporter' ? 'badge-success' : 'badge-primary'}`}>
                            {tier === 'supporter' ? '⭐ サポーター' : '👋 フォロワー'}
                        </span>
                    </div>
                )}
            </div>

            {/* Bio */}
            <p className="profile-bio">{athlete.bio}</p>

            {/* Tags */}
            <div className="profile-tags">
                {athlete.tags.map(tag => (
                    <span key={tag} className="tag tag-primary">#{tag}</span>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="profile-nav">
                <button
                    className={`profile-nav-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <Grid size={20} />
                    <span>投稿</span>
                </button>
                <button
                    className={`profile-nav-btn ${activeTab === 'best' ? 'active' : ''}`}
                    onClick={() => setActiveTab('best')}
                >
                    <Star size={20} />
                    <span>ベストショット</span>
                </button>
                <button
                    className={`profile-nav-btn ${activeTab === 'board' ? 'active' : ''}`}
                    onClick={() => setActiveTab('board')}
                >
                    <MessageSquare size={20} />
                    <span>掲示板</span>
                </button>
                <button
                    className={`profile-nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shop')}
                >
                    <ShoppingBag size={20} />
                    <span>ショップ</span>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' && (
                <div>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} athlete={athlete} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="icon">📷</div>
                            <h3>投稿はまだありません</h3>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'best' && (
                <div className="best-shots">
                    <div className="best-shots-header">
                        <Star size={20} color="var(--color-primary-500)" />
                        <h3>ベストショット</h3>
                    </div>
                    {athlete.bestShots.length > 0 ? (
                        <div className="best-shots-grid">
                            {athlete.bestShots.map(photo => (
                                <Link
                                    key={photo.id}
                                    to={`/athlete/${athlete.id}/best-shot/${photo.id}`}
                                    className="best-shot-item"
                                >
                                    <img src={photo.url} alt={photo.caption || 'ベストショット'} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="icon">⭐</div>
                            <h3>ベストショットはまだありません</h3>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'board' && (
                <Link to={`/athlete/${athlete.id}/board`} className="support-banner">
                    <h3>💬 掲示板</h3>
                    <p>ファン同士で交流しましょう</p>
                    <button className="support-banner-btn">掲示板を開く</button>
                </Link>
            )}

            {activeTab === 'shop' && (
                <div className="support-banner">
                    <h3>🛍️ グッズショップ</h3>
                    <p>準備中です。もうしばらくお待ちください。</p>
                    <button className="support-banner-btn" disabled>Coming Soon</button>
                </div>
            )}

            {/* Live Button (Dummy) */}
            <div style={{
                position: 'fixed',
                bottom: '80px',
                right: '16px',
                zIndex: 50
            }}>
                <button
                    className="btn btn-primary"
                    style={{
                        borderRadius: '50%',
                        width: '56px',
                        height: '56px',
                        padding: 0,
                        opacity: 0.5
                    }}
                    title="ライブ配信（準備中）"
                    disabled
                >
                    <Radio size={24} />
                </button>
            </div>

            {/* Support Modal */}
            {showSupportModal && (
                <PaymentModal
                    athleteId={athlete.id}
                    athleteName={athlete.name}
                    onClose={() => setShowSupportModal(false)}
                />
            )}
        </div>
    )
}

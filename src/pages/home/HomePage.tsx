import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAthleteStore } from '@/stores/athleteStore'
import PostCard from '@/components/athlete/PostCard'
import '@/components/athlete/athlete.css'
import './home.css'

type TabType = 'all' | 'following'

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const { athletes, posts, stories, following } = useAthleteStore()

    // Filter posts based on tab
    const filteredPosts = activeTab === 'all'
        ? posts
        : posts.filter(p => following.includes(p.athleteId))

    // Get athletes with active stories
    const athletesWithStories = athletes.filter(a =>
        stories.some(s => s.athleteId === a.id)
    )

    return (
        <div className="home-page">
            {/* Stories Section */}
            <div className="stories-section">
                <div className="stories-list">
                    {athletesWithStories.map(athlete => (
                        <Link
                            key={athlete.id}
                            to={`/athlete/${athlete.id}`}
                            className="story-circle"
                        >
                            <div className="story-ring">
                                <img
                                    src={athlete.avatarUrl || '/default-avatar.png'}
                                    alt={athlete.name}
                                />
                            </div>
                            <span className="story-name">{athlete.name.split(' ')[0]}</span>
                        </Link>
                    ))}
                    {athletesWithStories.length === 0 && (
                        <div style={{ color: 'var(--color-gray-400)', fontSize: '14px', padding: '8px' }}>
                            ストーリーはまだありません
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-nav">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    すべて
                </button>
                <button
                    className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
                    onClick={() => setActiveTab('following')}
                >
                    フォロー中
                </button>
            </div>

            {/* Posts Feed */}
            <div className="feed-section">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => {
                        const athlete = athletes.find(a => a.id === post.athleteId)
                        return (
                            <PostCard
                                key={post.id}
                                post={post}
                                athlete={athlete}
                            />
                        )
                    })
                ) : (
                    <div className="empty-state">
                        <div className="icon">👀</div>
                        <h3>投稿がありません</h3>
                        <p>
                            {activeTab === 'following'
                                ? '選手をフォローすると、ここに投稿が表示されます'
                                : '投稿がまだありません'}
                        </p>
                        <Link to="/search" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            選手を探す
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAthleteStore } from '@/stores/athleteStore'
import { tagCategories } from '@/data/mockData'
import PostCard from '@/components/athlete/PostCard'
import '@/components/athlete/athlete.css'
import './home.css'

type TabType = 'all' | 'following'
const POSTS_PER_PAGE = 10

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE)

    const { athletes, posts, stories, following } = useAthleteStore()

    // Filter stories to show followed athletes with stories
    const followedAthletesWithStories = useMemo(() => {
        return athletes.filter(a =>
            following.includes(a.id) && stories.some(s => s.athleteId === a.id)
        )
    }, [athletes, following, stories])

    // Filter posts based on tab and category
    const filteredPosts = useMemo(() => {
        let filtered = posts

        // Tab filter
        if (activeTab === 'following') {
            filtered = filtered.filter(p => following.includes(p.athleteId))
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(p =>
                p.tags?.includes(selectedCategory) ||
                athletes.find(a => a.id === p.athleteId)?.sport === selectedCategory ||
                athletes.find(a => a.id === p.athleteId)?.tags.includes(selectedCategory)
            )
        }

        return filtered
    }, [posts, activeTab, following, selectedCategory, athletes])

    // Posts to display (with load more)
    const displayedPosts = filteredPosts.slice(0, displayCount)
    const hasMore = displayCount < filteredPosts.length

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + POSTS_PER_PAGE)
    }

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(prev => prev === categoryId ? null : categoryId)
        setDisplayCount(POSTS_PER_PAGE) // Reset when changing category
    }

    return (
        <div className="home-page">
            {/* Category Discovery Tags - Above tabs */}
            <div className="category-section">
                <div className="category-list">
                    {tagCategories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.id)}
                            style={{
                                '--chip-color': cat.color,
                                '--chip-bg': `${cat.color}15`
                            } as React.CSSProperties}
                        >
                            <span className="category-emoji">{cat.emoji}</span>
                            <span className="category-label">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-nav">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('all'); setDisplayCount(POSTS_PER_PAGE); }}
                >
                    すべて
                </button>
                <button
                    className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('following'); setDisplayCount(POSTS_PER_PAGE); }}
                >
                    フォロー中
                </button>
            </div>

            {/* Stories Section - Only show for followed athletes */}
            {followedAthletesWithStories.length > 0 && (
                <div className="stories-section">
                    <div className="stories-list">
                        {followedAthletesWithStories.map(athlete => (
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
                    </div>
                </div>
            )}

            {/* Selected Category Badge */}
            {selectedCategory && (
                <div className="selected-category">
                    <span>
                        {tagCategories.find(c => c.id === selectedCategory)?.emoji}{' '}
                        {tagCategories.find(c => c.id === selectedCategory)?.label}
                    </span>
                    <button onClick={() => setSelectedCategory(null)}>✕</button>
                </div>
            )}

            {/* Posts Feed */}
            <div className="feed-section">
                {displayedPosts.length > 0 ? (
                    <>
                        {displayedPosts.map(post => {
                            const athlete = athletes.find(a => a.id === post.athleteId)
                            return (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    athlete={athlete}
                                />
                            )
                        })}

                        {/* Load More Button */}
                        {hasMore && (
                            <button
                                className="load-more-btn"
                                onClick={handleLoadMore}
                            >
                                さらに読み込む ({filteredPosts.length - displayCount}件)
                            </button>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="icon">👀</div>
                        <h3>投稿がありません</h3>
                        <p>
                            {activeTab === 'following'
                                ? '選手をフォローすると、ここに投稿が表示されます'
                                : selectedCategory
                                    ? 'このカテゴリの投稿はまだありません'
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

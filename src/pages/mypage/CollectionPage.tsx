import { Link } from 'react-router-dom'
import { ArrowLeft, Bookmark } from 'lucide-react'
import { useLikesStore } from '@/stores/likesStore'
import { useAthleteStore } from '@/stores/athleteStore'
import './mypage.css'

export default function CollectionPage() {
    const { bookmarkedPosts, toggleBookmark } = useLikesStore()
    const { posts, athletes } = useAthleteStore()

    // Get bookmarked post data
    const bookmarkedPostIds = Object.entries(bookmarkedPosts)
        .filter(([, isBookmarked]) => isBookmarked)
        .map(([postId]) => postId)

    const savedPosts = posts.filter(post => bookmarkedPostIds.includes(post.id))

    return (
        <div className="mypage">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <Link to="/mypage" style={{ color: 'var(--color-gray-600)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
                    <Bookmark size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    マイコレクション
                </h1>
            </div>

            {savedPosts.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                }}>
                    {savedPosts.map(post => {
                        const photo = post.photos?.[0]
                        const athlete = athletes.find(a => a.id === post.athleteId)
                        if (!photo) return null

                        return (
                            <div
                                key={post.id}
                                className="collection-item"
                            >
                                <Link to={`/athlete/${post.athleteId}`}>
                                    <img
                                        src={photo.url}
                                        alt={post.caption || ''}
                                    />
                                </Link>
                                <button
                                    className="unbookmark-btn"
                                    onClick={() => toggleBookmark(post.id)}
                                    title="コレクションから削除"
                                >
                                    <Bookmark size={16} fill="white" />
                                </button>
                                <div className="collection-info">
                                    <span className="athlete-name">{athlete?.name}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="icon">💫</div>
                    <h3>コレクションはまだ空です</h3>
                    <p>投稿の保存ボタンを押すとここに表示されます</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        投稿を見る
                    </Link>
                </div>
            )}
        </div>
    )
}

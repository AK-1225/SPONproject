import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, MessageCircle } from 'lucide-react'
import { useLikesStore } from '@/stores/likesStore'
import type { Post, Athlete } from '@/types'
import { formatDistanceToNow, formatCurrency } from '@/utils/formatDate'
import SupportButton from '@/components/support/SupportButton'
import './athlete.css'

interface PostCardProps {
    post: Post
    athlete?: Athlete
}

export default function PostCard({ post, athlete }: PostCardProps) {
    const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useLikesStore()
    const [likeCount, setLikeCount] = useState(post.likeCount)

    const liked = isLiked(post.id)
    const bookmarked = isBookmarked(post.id)

    const handleLike = () => {
        toggleLike(post.id)
        setLikeCount(prev => liked ? prev - 1 : prev + 1)
    }

    const handleBookmark = () => {
        toggleBookmark(post.id)
    }

    const photo = post.photos?.[0]

    return (
        <div className="post-card">
            {/* Post Header */}
            <Link to={`/athlete/${post.athleteId}`} className="post-header">
                <img
                    src={athlete?.avatarUrl || '/default-avatar.png'}
                    alt={athlete?.name || ''}
                    className="avatar avatar-sm"
                />
                <div className="post-header-info">
                    <span className="post-author">{athlete?.name || '選手'}</span>
                    <span className="post-time">{formatDistanceToNow(post.createdAt)}</span>
                </div>
            </Link>

            {/* Post Image */}
            {photo && (
                <div className="post-image">
                    <img src={photo.url} alt={post.caption || ''} />
                </div>
            )}

            {/* Post Actions */}
            <div className="post-actions">
                <div className="post-actions-left">
                    <button
                        className={`action-btn ${liked ? 'liked' : ''}`}
                        onClick={handleLike}
                        aria-label="いいね"
                    >
                        <Heart size={22} fill={liked ? '#EF4444' : 'none'} stroke={liked ? '#EF4444' : 'currentColor'} />
                    </button>
                    <button className="action-btn" aria-label="コメント">
                        <MessageCircle size={22} />
                    </button>
                </div>
                <button
                    className={`action-btn ${bookmarked ? 'bookmarked' : ''}`}
                    onClick={handleBookmark}
                    aria-label="ブックマーク"
                >
                    <Bookmark size={22} fill={bookmarked ? 'var(--color-primary-500)' : 'none'} stroke={bookmarked ? 'var(--color-primary-500)' : 'currentColor'} />
                </button>
            </div>

            {/* Post Stats */}
            <div className="post-stats">
                <span className="like-count">❤️ {likeCount}</span>
                <span className="support-count">🎁 {post.supportCount}人が応援</span>
                {post.totalSupportAmount > 0 && (
                    <span className="support-amount">💰 {formatCurrency(post.totalSupportAmount)}</span>
                )}
            </div>

            {/* Caption */}
            {post.caption && (
                <p className="post-caption">
                    <Link to={`/athlete/${post.athleteId}`} className="author-link">
                        {athlete?.name}
                    </Link>{' '}
                    {post.caption}
                </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map(tag => (
                        <span key={tag} className="tag tag-sm">#{tag}</span>
                    ))}
                </div>
            )}

            {/* Support Buttons */}
            <SupportButton
                postId={post.id}
                athleteId={post.athleteId}
                athleteName={athlete?.name || '選手'}
            />
        </div>
    )
}

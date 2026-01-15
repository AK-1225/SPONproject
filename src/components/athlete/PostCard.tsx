import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, MessageCircle, Trash2 } from 'lucide-react'
import { useLikesStore } from '@/stores/likesStore'
import { useCommentStore } from '@/stores/commentStore'
import { useAuthStore } from '@/stores/authStore'
import { useAthleteStore } from '@/stores/athleteStore'
import type { Post, Athlete } from '@/types'
import { formatDistanceToNow, formatCurrency } from '@/utils/formatDate'
import SupportButton from '@/components/support/SupportButton'
import CommentModal from '@/components/comment/CommentModal'
import './athlete.css'

interface PostCardProps {
    post: Post
    athlete?: Athlete
}

export default function PostCard({ post, athlete }: PostCardProps) {
    const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useLikesStore()
    const { getCommentsForPost } = useCommentStore()
    const { user } = useAuthStore()
    const { deletePost } = useAthleteStore()
    const [likeCount, setLikeCount] = useState(post.likeCount)
    const [showComments, setShowComments] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const liked = isLiked(post.id)
    const bookmarked = isBookmarked(post.id)
    const comments = getCommentsForPost(post.id)

    // Fallback: if athlete is not found but post belongs to current user, use user data
    const isOwnPost = user?.id === post.athleteId
    const authorName = athlete?.name || (isOwnPost ? user?.name : '選手')
    const authorAvatar = athlete?.avatarUrl || (isOwnPost ? user?.avatarUrl : undefined)

    const handleLike = () => {
        toggleLike(post.id)
        setLikeCount(prev => liked ? prev - 1 : prev + 1)
    }

    const handleBookmark = () => {
        toggleBookmark(post.id)
    }

    const handleDelete = () => {
        deletePost(post.id)
        setShowDeleteConfirm(false)
    }

    const photo = post.photos?.[0]

    return (
        <div className="post-card">
            {/* Post Header */}
            <div className="post-header-wrapper">
                <Link to={`/athlete/${post.athleteId}`} className="post-header">
                    <img
                        src={authorAvatar || '/default-avatar.png'}
                        alt={authorName || ''}
                        className="avatar avatar-sm"
                        loading="lazy"
                    />
                    <div className="post-header-info">
                        <span className="post-author">{authorName}</span>
                        <span className="post-time">{formatDistanceToNow(post.createdAt)}</span>
                    </div>
                </Link>
                {isOwnPost && (
                    <button
                        className="post-delete-btn"
                        onClick={() => setShowDeleteConfirm(true)}
                        title="投稿を削除"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="delete-confirm-modal">
                    <div className="delete-confirm-content">
                        <p>この投稿を削除しますか？</p>
                        <div className="delete-confirm-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                                キャンセル
                            </button>
                            <button className="btn-delete" onClick={handleDelete}>
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Image */}
            {photo && (
                <div className="post-image">
                    <img src={photo.url} alt={post.caption || ''} />
                </div>
            )}

            {/* Caption - moved above stats for differentiation */}
            {post.caption && (
                <p className="post-caption">
                    <Link to={`/athlete/${post.athleteId}`} className="author-link">
                        {athlete?.name}
                    </Link>{' '}
                    {post.caption}
                </p>
            )}

            {/* Tags - clickable to search */}
            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map((tag: string) => (
                        <Link
                            key={tag}
                            to={`/search?tag=${encodeURIComponent(tag)}`}
                            className="tag tag-sm tag-link"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* SPON-style engagement section - unique design */}
            <div className="post-engagement">
                {/* Stats row */}
                <div className="engagement-stats">
                    <span className="stat-item">
                        <Heart size={14} fill="#EF4444" stroke="#EF4444" />
                        <span>{likeCount}</span>
                    </span>
                    <span className="stat-item">
                        <span>🎁</span>
                        <span>{post.supportCount}人が応援</span>
                    </span>
                    {post.totalSupportAmount > 0 && (
                        <span className="stat-item stat-amount">
                            {formatCurrency(post.totalSupportAmount)}
                        </span>
                    )}
                </div>

                {/* Action buttons - SPON unique style */}
                <div className="engagement-actions">
                    <button
                        className={`engage-btn ${liked ? 'active' : ''}`}
                        onClick={handleLike}
                    >
                        <Heart size={20} fill={liked ? '#EF4444' : 'none'} stroke={liked ? '#EF4444' : 'currentColor'} />
                        <span>いいね</span>
                    </button>
                    <button
                        className="engage-btn"
                        onClick={() => setShowComments(true)}
                    >
                        <MessageCircle size={20} />
                        <span>コメント{comments.length > 0 ? ` ${comments.length}` : ''}</span>
                    </button>
                    <button
                        className={`engage-btn ${bookmarked ? 'active' : ''}`}
                        onClick={handleBookmark}
                    >
                        <Bookmark size={20} fill={bookmarked ? 'var(--color-primary-500)' : 'none'} stroke={bookmarked ? 'var(--color-primary-500)' : 'currentColor'} />
                        <span>保存</span>
                    </button>
                </div>
            </div>

            {/* Quick Support Buttons */}
            <SupportButton
                postId={post.id}
                athleteId={post.athleteId}
                athleteName={athlete?.name || '選手'}
            />

            {/* Comment Modal */}
            {showComments && (
                <CommentModal
                    post={post}
                    athlete={athlete}
                    onClose={() => setShowComments(false)}
                />
            )}
        </div>
    )
}

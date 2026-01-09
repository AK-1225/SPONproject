import { Link } from 'react-router-dom'
import { formatDistanceToNow } from '@/utils/formatDate'
import SupportButton from '@/components/support/SupportButton'
import type { Post, Athlete } from '@/types'
import './athlete.css'

interface PostCardProps {
    post: Post
    athlete?: Athlete
}

export default function PostCard({ post, athlete }: PostCardProps) {
    return (
        <div className="post-card">
            <Link to={`/athlete/${post.athleteId}`} className="post-card-header">
                <img
                    src={athlete?.avatarUrl || '/default-avatar.png'}
                    alt={athlete?.name || '選手'}
                    className="post-card-avatar"
                />
                <div className="post-card-author">
                    <div className="post-card-name">{athlete?.name || '選手'}</div>
                    <div className="post-card-time">
                        {formatDistanceToNow(post.createdAt)}
                    </div>
                </div>
            </Link>

            {post.photos[0] && (
                <img
                    src={post.photos[0].url}
                    alt={post.caption}
                    className="post-card-image"
                />
            )}

            <div className="post-card-content">
                <p className="post-card-caption">{post.caption}</p>

                <div className="post-card-stats">
                    <span>❤️ {post.likeCount}</span>
                    <span>🎁 {post.supportCount}人が応援</span>
                    {post.totalSupportAmount > 0 && (
                        <span>💰 {post.totalSupportAmount.toLocaleString()}円</span>
                    )}
                </div>

                <SupportButton
                    athleteId={post.athleteId}
                    athleteName={athlete?.name || '選手'}
                    postId={post.id}
                    likeCount={post.likeCount}
                />
            </div>
        </div>
    )
}

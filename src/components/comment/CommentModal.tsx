import { useState } from 'react'
import { X, Send, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCommentStore } from '@/stores/commentStore'
import { formatDistanceToNow } from '@/utils/formatDate'
import type { Post, Athlete } from '@/types'
import './comment.css'

interface CommentModalProps {
    post: Post
    athlete?: Athlete
    onClose: () => void
}

export default function CommentModal({ post, athlete, onClose }: CommentModalProps) {
    const [newComment, setNewComment] = useState('')
    const { user, isAuthenticated } = useAuthStore()
    const { getCommentsForPost, addComment, deleteComment } = useCommentStore()

    const comments = getCommentsForPost(post.id)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        addComment({
            postId: post.id,
            authorId: user.id,
            authorName: user.name,
            authorAvatarUrl: user.avatarUrl,
            content: newComment.trim(),
        })
        setNewComment('')
    }

    return (
        <div className="comment-modal-overlay" onClick={onClose}>
            <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="comment-header">
                    <h2>コメント</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Post Preview */}
                <div className="post-preview">
                    <img
                        src={athlete?.avatarUrl || '/default-avatar.png'}
                        alt=""
                        className="preview-avatar"
                    />
                    <div className="preview-content">
                        <span className="preview-name">{athlete?.name}</span>
                        <span className="preview-caption">{post.caption}</span>
                    </div>
                </div>

                {/* Comments List */}
                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <img
                                    src={comment.authorAvatarUrl || '/default-avatar.png'}
                                    alt=""
                                    className="comment-avatar"
                                />
                                <div className="comment-content">
                                    <div className="comment-header-row">
                                        <span className="comment-author">{comment.authorName}</span>
                                        <span className="comment-time">{formatDistanceToNow(comment.createdAt)}</span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                                {user?.id === comment.authorId && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteComment(comment.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-comments">
                            <p>まだコメントはありません</p>
                            <p>最初のコメントを投稿しましょう！</p>
                        </div>
                    )}
                </div>

                {/* Input */}
                {isAuthenticated ? (
                    <form className="comment-input" onSubmit={handleSubmit}>
                        <img
                            src={user?.avatarUrl || '/default-avatar.png'}
                            alt=""
                            className="input-avatar"
                        />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="コメントを追加..."
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={newComment.trim() ? 'active' : ''}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                ) : (
                    <div className="login-prompt">
                        <p>コメントするにはログインしてください</p>
                    </div>
                )}
            </div>
        </div>
    )
}

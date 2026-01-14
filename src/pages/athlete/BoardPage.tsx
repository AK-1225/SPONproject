import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Send, Lock, Ban, MoreVertical, X } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import { useAuthStore } from '@/stores/authStore'
import { useSupportStore } from '@/stores/supportStore'
import { useBlockStore } from '@/stores/blockStore'
import { formatDistanceToNow } from '@/utils/formatDate'
import type { BoardPost } from '@/types'
import './athlete.css'

// Mock board posts
const mockBoardPosts: BoardPost[] = [
    {
        id: 'board-1',
        athleteId: 'athlete-1',
        authorId: 'user-1',
        authorName: '田中さん',
        content: '今日の練習も頑張ってください！応援してます💪',
        createdAt: '2025-12-20T08:00:00Z',
        isDeleted: false,
    },
    {
        id: 'board-2',
        athleteId: 'athlete-1',
        authorId: 'athlete-1',
        authorName: '山田 太郎',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        content: 'ありがとうございます！今日も全力で走ります🏃',
        createdAt: '2025-12-20T09:30:00Z',
        isDeleted: false,
    },
]

export default function BoardPage() {
    const { id } = useParams<{ id: string }>()
    const [posts, setPosts] = useState<BoardPost[]>(mockBoardPosts)
    const [newPost, setNewPost] = useState('')
    const [showMenu, setShowMenu] = useState<string | null>(null)
    const [showBlockConfirm, setShowBlockConfirm] = useState<{ userId: string, userName: string } | null>(null)

    const getAthlete = useAthleteStore(state => state.getAthlete)
    const isFollowing = useAthleteStore(state => state.isFollowing)
    const user = useAuthStore(state => state.user)
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const getTierForAthlete = useSupportStore(state => state.getTierForAthlete)
    const { blockUser, isBlocked: checkIsBlocked } = useBlockStore()

    const athlete = getAthlete(id!)
    const following = isFollowing(id!)
    const tier = getTierForAthlete(id!, following)
    const canPost = tier === 'supporter'
    const canView = following || (user?.id === id)
    const isOwner = user?.id === id || user?.email === athlete?.email

    if (!athlete) {
        return (
            <div className="empty-state">
                <h3>選手が見つかりません</h3>
            </div>
        )
    }

    // Followers-only access check
    if (!canView && isAuthenticated) {
        return (
            <div className="board-page">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <Link to={`/athlete/${id}`} style={{ color: 'var(--color-gray-600)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
                        💬 {athlete.name}さんの掲示板
                    </h1>
                </div>

                <div className="empty-state" style={{
                    background: 'var(--color-gray-50)',
                    borderRadius: '16px',
                    padding: '48px 24px'
                }}>
                    <Lock size={48} style={{ color: 'var(--color-gray-400)', marginBottom: '16px' }} />
                    <h3>フォロワー限定コンテンツ</h3>
                    <p style={{ marginBottom: '16px' }}>
                        掲示板を見るには{athlete.name}さんをフォローしてください
                    </p>
                    <Link to={`/athlete/${id}`} className="btn btn-primary">
                        プロフィールに戻る
                    </Link>
                </div>
            </div>
        )
    }

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPost.trim() || !user) return

        const post: BoardPost = {
            id: `board-${Date.now()}`,
            athleteId: id!,
            authorId: user.id,
            authorName: user.name,
            authorAvatarUrl: user.avatarUrl,
            content: newPost,
            createdAt: new Date().toISOString(),
            isDeleted: false,
        }
        setPosts([...posts, post])
        setNewPost('')
    }

    const handleDelete = (postId: string) => {
        setPosts(posts.filter(p => p.id !== postId))
        setShowMenu(null)
    }

    const handleBlock = () => {
        if (!showBlockConfirm || !id) return
        blockUser(id, showBlockConfirm.userId)
        // Remove all posts by blocked user
        setPosts(posts.filter(p => p.authorId !== showBlockConfirm.userId))
        setShowBlockConfirm(null)
        setShowMenu(null)
    }

    // Filter out posts from blocked users
    const visiblePosts = posts.filter(p =>
        p.athleteId === id && !checkIsBlocked(id, p.authorId)
    )

    return (
        <div className="board-page">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
            }}>
                <Link to={`/athlete/${id}`} style={{ color: 'var(--color-gray-600)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '18px', fontWeight: 600 }}>
                    💬 {athlete.name}さんの掲示板
                </h1>
            </div>

            {/* Posts */}
            <div style={{ marginBottom: '80px' }}>
                {visiblePosts.map(post => (
                    <div
                        key={post.id}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '12px',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {post.authorAvatarUrl ? (
                                    <img
                                        src={post.authorAvatarUrl}
                                        alt=""
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'var(--color-gray-200)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px'
                                    }}>
                                        👤
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>
                                        {post.authorName}
                                        {post.authorId === athlete.id && (
                                            <span style={{
                                                marginLeft: '6px',
                                                fontSize: '11px',
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-700)',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                            }}>
                                                選手
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                                        {formatDistanceToNow(post.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Action menu for owner or post author */}
                            {(user?.id === post.authorId || isOwner) && (
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}
                                        style={{ color: 'var(--color-gray-400)', padding: '4px' }}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {showMenu === post.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            background: 'white',
                                            borderRadius: '8px',
                                            boxShadow: 'var(--shadow-lg)',
                                            overflow: 'hidden',
                                            zIndex: 10,
                                            minWidth: '140px'
                                        }}>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px',
                                                    color: 'var(--color-error)'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                                削除する
                                            </button>
                                            {isOwner && post.authorId !== athlete.id && (
                                                <button
                                                    onClick={() => setShowBlockConfirm({
                                                        userId: post.authorId,
                                                        userName: post.authorName
                                                    })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        fontSize: '14px',
                                                        color: 'var(--color-gray-700)',
                                                        borderTop: '1px solid var(--color-gray-100)'
                                                    }}
                                                >
                                                    <Ban size={16} />
                                                    ブロックする
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{post.content}</p>
                    </div>
                ))}

                {visiblePosts.length === 0 && (
                    <div className="empty-state">
                        <div className="icon">💬</div>
                        <h3>まだ投稿がありません</h3>
                        <p>最初のコメントを投稿しましょう</p>
                    </div>
                )}
            </div>

            {/* Post Form */}
            <div style={{
                position: 'fixed',
                bottom: '64px',
                left: 0,
                right: 0,
                background: 'white',
                padding: '12px 16px',
                borderTop: '1px solid var(--color-gray-100)',
            }}>
                {canPost ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="コメントを入力..."
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: '1px solid var(--color-gray-200)',
                                borderRadius: '24px',
                                fontSize: '14px',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newPost.trim()}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: newPost.trim() ? 'var(--color-primary-500)' : 'var(--color-gray-200)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        fontSize: '14px',
                        color: 'var(--color-gray-500)',
                        padding: '8px'
                    }}>
                        💡 サポーター（累計100円以上の支援）になると投稿できます
                    </div>
                )}
            </div>

            {/* Block Confirmation Modal */}
            {showBlockConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }} onClick={() => setShowBlockConfirm(null)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '320px'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowBlockConfirm(null)}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                color: 'var(--color-gray-400)'
                            }}
                        >
                            <X size={20} />
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <Ban size={48} style={{ color: 'var(--color-error)', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                                {showBlockConfirm.userName}さんをブロック
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', marginBottom: '20px' }}>
                                ブロックすると、この選手の掲示板での投稿が非表示になります。フォロー解除されますが、支援履歴は残ります。
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowBlockConfirm(null)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'var(--color-gray-100)',
                                        borderRadius: '8px',
                                        fontWeight: 500
                                    }}
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleBlock}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'var(--color-error)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontWeight: 500
                                    }}
                                >
                                    ブロック
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, X, Heart, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import { useLikesStore } from '@/stores/likesStore'
import { formatDistanceToNow } from '@/utils/formatDate'
import './athlete.css'

export default function BestShotDetailPage() {
    const { id, photoId } = useParams<{ id: string; photoId: string }>()
    const [currentIndex, setCurrentIndex] = useState(0)

    const getAthlete = useAthleteStore(state => state.getAthlete)
    const { likedPosts, toggleLike, bookmarkedPosts, toggleBookmark } = useLikesStore()

    const athlete = getAthlete(id!)

    if (!athlete) {
        return (
            <div className="empty-state">
                <h3>選手が見つかりません</h3>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    ホームに戻る
                </Link>
            </div>
        )
    }

    const bestShots = athlete.bestShots || []

    // Find initial index from photoId
    const initialIndex = bestShots.findIndex(p => p.id === photoId)
    if (initialIndex >= 0 && currentIndex !== initialIndex && currentIndex === 0) {
        setCurrentIndex(initialIndex)
    }

    const currentPhoto = bestShots[currentIndex]

    if (!currentPhoto) {
        return (
            <div className="empty-state">
                <h3>写真が見つかりません</h3>
                <Link to={`/athlete/${id}`} className="btn btn-primary" style={{ marginTop: '16px' }}>
                    プロフィールに戻る
                </Link>
            </div>
        )
    }

    const photoKey = `bestshot-${currentPhoto.id}`
    const isLiked = likedPosts[photoKey] || false
    const isBookmarked = bookmarkedPosts[photoKey] || false

    const handlePrev = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : bestShots.length - 1))
    }

    const handleNext = () => {
        setCurrentIndex(prev => (prev < bestShots.length - 1 ? prev + 1 : 0))
    }

    return (
        <div className="best-shot-detail">
            {/* Header */}
            <div className="detail-header">
                <Link to={`/athlete/${id}`} className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <div className="header-info">
                    <img src={athlete.avatarUrl} alt="" className="avatar avatar-sm" />
                    <span>{athlete.name}</span>
                </div>
                <Link to={`/athlete/${id}`} className="close-btn">
                    <X size={24} />
                </Link>
            </div>

            {/* Photo Viewer */}
            <div className="photo-viewer">
                {bestShots.length > 1 && (
                    <button className="nav-btn prev" onClick={handlePrev}>
                        <ChevronLeft size={32} />
                    </button>
                )}

                <div className="photo-container">
                    <img src={currentPhoto.url} alt={currentPhoto.caption || 'ベストショット'} />
                </div>

                {bestShots.length > 1 && (
                    <button className="nav-btn next" onClick={handleNext}>
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            {/* Photo Counter */}
            {bestShots.length > 1 && (
                <div className="photo-counter">
                    {currentIndex + 1} / {bestShots.length}
                </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
                <button
                    className={`action-btn ${isLiked ? 'active' : ''}`}
                    onClick={() => toggleLike(photoKey)}
                >
                    <Heart size={24} fill={isLiked ? '#EF4444' : 'none'} stroke={isLiked ? '#EF4444' : 'currentColor'} />
                    <span>{currentPhoto.likeCount + (isLiked ? 1 : 0)}</span>
                </button>
                <button
                    className={`action-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark(photoKey)}
                >
                    <Bookmark size={24} fill={isBookmarked ? 'var(--color-primary-500)' : 'none'} />
                    <span>保存</span>
                </button>
            </div>

            {/* Caption & Info */}
            <div className="detail-info">
                {currentPhoto.caption && (
                    <p className="caption">{currentPhoto.caption}</p>
                )}
                <span className="date">{formatDistanceToNow(currentPhoto.createdAt)}</span>
            </div>

            {/* Thumbnails */}
            {bestShots.length > 1 && (
                <div className="thumbnails">
                    {bestShots.map((photo, idx) => (
                        <button
                            key={photo.id}
                            className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            <img src={photo.url} alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

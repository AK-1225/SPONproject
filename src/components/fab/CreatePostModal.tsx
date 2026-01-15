import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Camera, Image, Video, Loader } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAthleteStore } from '@/stores/athleteStore'
import {
    compressImage,
    validateVideo,
    generateVideoThumbnail,
    isVideoFile,
    isImageFile,
    MAX_VIDEO_DURATION
} from '@/utils/mediaUtils'
import './fab.css'

interface CreatePostModalProps {
    onClose: () => void
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
    const { user } = useAuthStore()
    const { addPost, athletes } = useAthleteStore()
    const navigate = useNavigate()

    const [caption, setCaption] = useState('')
    const [tags, setTags] = useState('')
    const [isBestShot, setIsBestShot] = useState(false)
    const [mediaPreview, setMediaPreview] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
    const [_videoFile, setVideoFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [videoDuration, setVideoDuration] = useState<number | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Get current athlete data
    const athlete = athletes.find(a => a.id === user?.id || a.email === user?.email)

    const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)
        setIsProcessing(true)

        try {
            if (isImageFile(file)) {
                // Compress image before preview
                const compressed = await compressImage(file)
                setMediaPreview(compressed)
                setMediaType('image')
                setVideoFile(null)
                setVideoDuration(null)
            } else if (isVideoFile(file)) {
                // Validate video
                const validation = await validateVideo(file)

                if (!validation.valid && validation.error && !validation.error.includes('最初の1分')) {
                    setError(validation.error)
                    setIsProcessing(false)
                    return
                }

                // If video is too long, show warning but allow (will be trimmed)
                if (validation.duration > MAX_VIDEO_DURATION) {
                    setError(`動画は${MAX_VIDEO_DURATION}秒を超えています。最初の1分のみが使用されます。`)
                }

                // Generate thumbnail for preview
                const thumbnail = await generateVideoThumbnail(file)
                setMediaPreview(thumbnail)
                setMediaType('video')
                setVideoFile(file)
                setVideoDuration(validation.duration)
            } else {
                setError('対応していないファイル形式です')
            }
        } catch (err) {
            setError('ファイルの処理中にエラーが発生しました')
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !mediaPreview) return

        setIsSubmitting(true)
        setError(null)

        try {
            // Parse tags from comma-separated string
            const tagList = tags.split(/[,、\s]+/).filter(t => t.trim()).map(t => t.trim())

            // Add post (mock - in real app would upload to Supabase)
            addPost({
                athleteId: athlete?.id || user.id,
                caption: caption.trim(),
                tags: tagList,
                imageUrl: mediaPreview || undefined,
                isBestShot,
            })

            // Show toast and redirect to home
            setShowToast(true)
            setTimeout(() => {
                onClose()
                navigate('/')
            }, 1500)
        } catch (error) {
            setError('投稿に失敗しました')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const removeMedia = () => {
        setMediaPreview(null)
        setMediaType(null)
        setVideoFile(null)
        setVideoDuration(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Toast notification after successful post
    if (showToast) {
        return (
            <div className="toast-overlay">
                <div className="toast-notification">
                    <span className="toast-icon">✅</span>
                    <span>投稿完了</span>
                </div>
            </div>
        )
    }

    return (
        <div className="fab-modal-overlay" onClick={onClose}>
            <div className="fab-modal create-post-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <h2>新しい投稿</h2>
                    <div style={{ width: 24 }} /> {/* Spacer for centering */}
                </div>

                <form className="post-form" onSubmit={handleSubmit}>
                    {/* Media Upload */}
                    <div className="image-upload">
                        {isProcessing ? (
                            <div className="upload-processing">
                                <Loader size={32} className="spin" />
                                <span>処理中...</span>
                            </div>
                        ) : mediaPreview ? (
                            <div className="image-preview">
                                <img src={mediaPreview} alt="" />
                                {mediaType === 'video' && (
                                    <div className="video-badge">
                                        <Video size={16} />
                                        <span>{videoDuration ? `${Math.round(videoDuration)}秒` : '動画'}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={removeMedia}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="upload-placeholder">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleMediaChange}
                                    style={{ display: 'none' }}
                                />
                                <div className="upload-icons">
                                    <Camera size={28} />
                                    <Video size={28} />
                                </div>
                                <span>写真・動画を選択</span>
                                <span className="upload-hint">動画は{MAX_VIDEO_DURATION}秒まで</span>
                            </label>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Caption */}
                    <div className="form-group">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="今日の活動を共有しましょう..."
                            rows={4}
                            maxLength={500}
                        />
                        <span className="char-count">{caption.length}/500</span>
                    </div>

                    {/* Tags */}
                    <div className="form-group">
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="タグ（カンマ区切り）例: 練習, トレーニング"
                        />
                    </div>

                    {/* Best Shot Toggle (only for images) */}
                    {mediaType !== 'video' && (
                        <label className="best-shot-toggle">
                            <input
                                type="checkbox"
                                checked={isBestShot}
                                onChange={(e) => setIsBestShot(e.target.checked)}
                            />
                            <span className="toggle-label">
                                <Image size={16} />
                                ベストショットに追加
                            </span>
                        </label>
                    )}

                    {/* Submit Button - Fixed at bottom */}
                    <button
                        type="submit"
                        className="post-submit-btn"
                        disabled={!caption.trim() || isSubmitting || isProcessing}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader size={18} className="spin" />
                                投稿中...
                            </>
                        ) : (
                            '投稿する'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

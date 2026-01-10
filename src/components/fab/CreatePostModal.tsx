import { useState } from 'react'
import { X, Camera, Image, Send } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAthleteStore } from '@/stores/athleteStore'
import './fab.css'

interface CreatePostModalProps {
    onClose: () => void
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
    const { user } = useAuthStore()
    const { addPost, athletes } = useAthleteStore()

    const [caption, setCaption] = useState('')
    const [tags, setTags] = useState('')
    const [isBestShot, setIsBestShot] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Get current athlete data
    const athlete = athletes.find(a => a.id === user?.id || a.email === user?.email)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!caption.trim() || !user) return

        setIsSubmitting(true)

        try {
            // Parse tags from comma-separated string
            const tagList = tags.split(/[,、\s]+/).filter(t => t.trim()).map(t => t.trim())

            // Add post (mock - in real app would upload to Supabase)
            addPost({
                athleteId: athlete?.id || user.id,
                caption: caption.trim(),
                tags: tagList,
                imageUrl: imagePreview || undefined,
                isBestShot,
            })

            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="fab-modal-overlay">
                <div className="fab-modal success-modal">
                    <div className="success-content">
                        <div className="success-icon">✅</div>
                        <h3>投稿しました！</h3>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fab-modal-overlay" onClick={onClose}>
            <div className="fab-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <h2>新しい投稿</h2>
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={!caption.trim() || isSubmitting}
                    >
                        <Send size={20} />
                    </button>
                </div>

                <form className="post-form" onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="image-upload">
                        {imagePreview ? (
                            <div className="image-preview">
                                <img src={imagePreview} alt="" />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => setImagePreview(null)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="upload-placeholder">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <Camera size={32} />
                                <span>写真を選択</span>
                            </label>
                        )}
                    </div>

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

                    {/* Best Shot Toggle */}
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
                </form>
            </div>
        </div>
    )
}

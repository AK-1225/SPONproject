import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { sportsList } from '@/data/mockData'
import './mypage.css'

export default function ProfileEditPage() {
    const { user, updateProfile } = useAuthStore()
    const navigate = useNavigate()

    const [name, setName] = useState(user?.name || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [birthday, setBirthday] = useState('')
    const [favoriteSports, setFavoriteSports] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    if (!user) {
        return null
    }

    const handleSportToggle = (sport: string) => {
        setFavoriteSports(prev =>
            prev.includes(sport)
                ? prev.filter(s => s !== sport)
                : [...prev, sport].slice(0, 5) // Max 5 sports
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await updateProfile({
                name,
                bio,
            })
            setSuccess(true)
            setTimeout(() => {
                navigate('/mypage')
            }, 1500)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="empty-state">
                <div className="icon" style={{ fontSize: '4rem' }}>✅</div>
                <h3>プロフィールを更新しました</h3>
            </div>
        )
    }

    return (
        <div className="profile-edit-page">
            {/* Header */}
            <div className="edit-header">
                <Link to="/mypage" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <h1>プロフィール編集</h1>
                <div style={{ width: 24 }} />
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
                {/* Avatar */}
                <div className="avatar-edit">
                    <div className="avatar-preview">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" />
                        ) : (
                            <span>👤</span>
                        )}
                        <button type="button" className="avatar-btn">
                            <Camera size={16} />
                        </button>
                    </div>
                    <p className="avatar-hint">タップして変更</p>
                </div>

                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name">お名前</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="名前を入力"
                        required
                    />
                </div>

                {/* Bio */}
                <div className="form-group">
                    <label htmlFor="bio">自己紹介</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="自己紹介を入力してください"
                        rows={3}
                        maxLength={200}
                    />
                    <span className="char-count">{bio.length}/200</span>
                </div>

                {/* Birthday */}
                <div className="form-group">
                    <label htmlFor="birthday">生年月日</label>
                    <input
                        id="birthday"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </div>

                {/* Favorite Sports */}
                <div className="form-group">
                    <label>好きなスポーツ（最大5つ）</label>
                    <div className="sports-grid">
                        {sportsList.slice(0, 20).map(sport => (
                            <button
                                key={sport}
                                type="button"
                                className={`sport-chip ${favoriteSports.includes(sport) ? 'selected' : ''}`}
                                onClick={() => handleSportToggle(sport)}
                            >
                                {sport}
                                {favoriteSports.includes(sport) && <X size={12} />}
                            </button>
                        ))}
                    </div>
                    {favoriteSports.length > 0 && (
                        <p className="selected-sports">
                            選択中: {favoriteSports.join(', ')}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '24px' }}
                    disabled={isLoading}
                >
                    {isLoading ? '保存中...' : '保存する'}
                </button>
            </form>
        </div>
    )
}

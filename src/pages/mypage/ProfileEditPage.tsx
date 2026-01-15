import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, X, Image, Plus, GraduationCap, Trophy, Award, CircleDot, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { sportsList, regionsList } from '@/data/mockData'
import type { CareerEntry, CareerEntryType } from '@/types'
import './mypage.css'

export default function ProfileEditPage() {
    const { user, updateProfile } = useAuthStore()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState(user?.name || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [userHandle, setUserHandle] = useState(user?.userHandle || '')
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(user?.bannerUrl || null)
    const [birthday, setBirthday] = useState('')
    const [favoriteSports, setFavoriteSports] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Athlete-specific fields
    const [sport, setSport] = useState(user?.sport || '')
    const [team, setTeam] = useState(user?.team || '')
    const [region, setRegion] = useState(user?.region || '')
    const [defaultVisibility, setDefaultVisibility] = useState<'public' | 'followers' | 'supporters'>(
        (user?.defaultVisibility as any) || 'public'
    )

    // Career history
    const [careerHistory, setCareerHistory] = useState<CareerEntry[]>(user?.careerHistory || [])
    const [showCareerForm, setShowCareerForm] = useState(false)
    const [newCareerType, setNewCareerType] = useState<CareerEntryType>('education')
    const [newCareerDate, setNewCareerDate] = useState('')
    const [newCareerTitle, setNewCareerTitle] = useState('')
    const [newCareerDescription, setNewCareerDescription] = useState('')

    const isAthlete = user?.userType === 'athlete'

    if (!user) {
        return null
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleBannerClick = () => {
        bannerInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setAvatarPreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setBannerPreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSportToggle = (sportName: string) => {
        setFavoriteSports(prev =>
            prev.includes(sportName)
                ? prev.filter(s => s !== sportName)
                : [...prev, sportName].slice(0, 5)
        )
    }

    const addCareerEntry = () => {
        if (!newCareerDate || !newCareerTitle) return

        const newEntry: CareerEntry = {
            id: `career-${Date.now()}`,
            type: newCareerType,
            date: newCareerDate,
            title: newCareerTitle,
            description: newCareerDescription || undefined,
        }

        setCareerHistory(prev => [...prev, newEntry])
        setNewCareerType('education')
        setNewCareerDate('')
        setNewCareerTitle('')
        setNewCareerDescription('')
        setShowCareerForm(false)
    }

    const removeCareerEntry = (id: string) => {
        setCareerHistory(prev => prev.filter(entry => entry.id !== id))
    }

    const getCareerIcon = (type: CareerEntryType) => {
        switch (type) {
            case 'education':
                return <GraduationCap size={16} />
            case 'competition':
                return <Trophy size={16} />
            case 'award':
                return <Award size={16} />
            default:
                return <CircleDot size={16} />
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await updateProfile({
                name,
                bio,
                userHandle,
                avatarUrl: avatarPreview || undefined,
                bannerUrl: bannerPreview || undefined,
                careerHistory: isAthlete ? careerHistory : undefined,
                ...(isAthlete && {
                    sport,
                    team,
                    region,
                    defaultVisibility,
                }),
            })
            setSuccess(true)
            setTimeout(() => {
                navigate('/mypage')
            }, 500)
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
                {/* Banner (Athletes only) */}
                {isAthlete && (
                    <div className="banner-edit">
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={handleBannerChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <div className="banner-preview" onClick={handleBannerClick}>
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="" />
                            ) : (
                                <div className="banner-placeholder">
                                    <Image size={32} />
                                    <span>バナー画像を設定</span>
                                </div>
                            )}
                            <button type="button" className="banner-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Avatar with file upload */}
                <div className="avatar-edit" style={isAthlete ? { marginTop: '-40px' } : {}}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <div className="avatar-preview" onClick={handleAvatarClick}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="" />
                        ) : (
                            <span>👤</span>
                        )}
                        <button type="button" className="avatar-btn" onClick={handleAvatarClick}>
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

                {/* User Handle (ID) */}
                <div className="form-group">
                    <label htmlFor="userHandle">ユーザーID</label>
                    <div className="handle-input-wrapper">
                        <span className="handle-prefix">@</span>
                        <input
                            id="userHandle"
                            type="text"
                            value={userHandle.replace('@', '')}
                            onChange={(e) => setUserHandle('@' + e.target.value.replace('@', '').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                            placeholder="username"
                            maxLength={20}
                        />
                    </div>
                    <span className="input-hint">半角英数字とアンダースコアのみ使用できます</span>
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

                {/* Athlete-specific fields */}
                {isAthlete && (
                    <>
                        {/* Sport */}
                        <div className="form-group">
                            <label htmlFor="sport">競技</label>
                            <select
                                id="sport"
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                required
                            >
                                <option value="">競技を選択</option>
                                {sportsList.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Team */}
                        <div className="form-group">
                            <label htmlFor="team">所属チーム/組織</label>
                            <input
                                id="team"
                                type="text"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                placeholder="例: ○○大学、△△クラブ"
                            />
                        </div>

                        {/* Region */}
                        <div className="form-group">
                            <label htmlFor="region">活動地域</label>
                            <select
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                <option value="">地域を選択</option>
                                {regionsList.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Default Visibility */}
                        <div className="form-group">
                            <label>投稿のデフォルト公開範囲</label>
                            <div className="visibility-options">
                                <label className={`visibility-option ${defaultVisibility === 'public' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={defaultVisibility === 'public'}
                                        onChange={() => setDefaultVisibility('public')}
                                    />
                                    <span className="option-icon">🌐</span>
                                    <span className="option-text">全体公開</span>
                                </label>
                                <label className={`visibility-option ${defaultVisibility === 'followers' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="followers"
                                        checked={defaultVisibility === 'followers'}
                                        onChange={() => setDefaultVisibility('followers')}
                                    />
                                    <span className="option-icon">👥</span>
                                    <span className="option-text">フォロワー限定</span>
                                </label>
                                <label className={`visibility-option ${defaultVisibility === 'supporters' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="supporters"
                                        checked={defaultVisibility === 'supporters'}
                                        onChange={() => setDefaultVisibility('supporters')}
                                    />
                                    <span className="option-icon">⭐</span>
                                    <span className="option-text">サポーター限定</span>
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {/* Birthday (Fans) */}
                {!isAthlete && (
                    <div className="form-group">
                        <label htmlFor="birthday">生年月日</label>
                        <input
                            id="birthday"
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                )}

                {/* Favorite Sports (Fans) */}
                {!isAthlete && (
                    <div className="form-group">
                        <label>好きなスポーツ（最大5つ）</label>
                        <div className="sports-grid">
                            {sportsList.slice(0, 20).map(sportName => (
                                <button
                                    key={sportName}
                                    type="button"
                                    className={`sport-chip ${favoriteSports.includes(sportName) ? 'selected' : ''}`}
                                    onClick={() => handleSportToggle(sportName)}
                                >
                                    {sportName}
                                    {favoriteSports.includes(sportName) && <X size={12} />}
                                </button>
                            ))}
                        </div>
                        {favoriteSports.length > 0 && (
                            <p className="selected-sports">
                                選択中: {favoriteSports.join(', ')}
                            </p>
                        )}
                    </div>
                )}

                {/* Career History (Athletes only) */}
                {isAthlete && (
                    <div className="form-group career-section">
                        <label>経歴</label>

                        {/* Existing career entries */}
                        {careerHistory.length > 0 && (
                            <div className="career-list">
                                {careerHistory
                                    .sort((a, b) => b.date.localeCompare(a.date))
                                    .map(entry => (
                                        <div key={entry.id} className="career-item">
                                            <div className="career-item-icon">
                                                {getCareerIcon(entry.type)}
                                            </div>
                                            <div className="career-item-content">
                                                <span className="career-item-date">{entry.date.replace('-', '年')}月</span>
                                                <span className="career-item-title">{entry.title}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="career-delete-btn"
                                                onClick={() => removeCareerEntry(entry.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                        {/* Add new career entry form */}
                        {showCareerForm ? (
                            <div className="career-add-form">
                                <div className="career-form-row">
                                    <select
                                        value={newCareerType}
                                        onChange={(e) => setNewCareerType(e.target.value as CareerEntryType)}
                                    >
                                        <option value="education">🎓 学歴</option>
                                        <option value="competition">🏆 大会</option>
                                        <option value="award">🏅 受賞</option>
                                        <option value="other">📌 その他</option>
                                    </select>
                                    <input
                                        type="month"
                                        value={newCareerDate}
                                        onChange={(e) => setNewCareerDate(e.target.value)}
                                        placeholder="年月"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={newCareerTitle}
                                    onChange={(e) => setNewCareerTitle(e.target.value)}
                                    placeholder="タイトル（例: ○○高校入学）"
                                />
                                <input
                                    type="text"
                                    value={newCareerDescription}
                                    onChange={(e) => setNewCareerDescription(e.target.value)}
                                    placeholder="説明（任意）"
                                />
                                <div className="career-form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowCareerForm(false)}
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={addCareerEntry}
                                    >
                                        追加
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="career-add-btn"
                                onClick={() => setShowCareerForm(true)}
                            >
                                <Plus size={16} />
                                経歴を追加
                            </button>
                        )}
                    </div>
                )}

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

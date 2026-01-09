import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserType } from '@/types'
import './auth.css'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [userType, setUserType] = useState<UserType>('fan')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const register = useAuthStore(state => state.register)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        const result = await register(email, password, name, userType)

        if (result.success) {
            navigate('/')
        } else {
            setError(result.error || '登録に失敗しました')
        }
        setIsLoading(false)
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <h1>SPON</h1>
                    <p>新しいアカウントを作成</p>
                </div>

                {error && (
                    <div className="error-message" style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* User Type Selection */}
                    <div className="form-group">
                        <label>アカウントタイプ</label>
                        <div className="user-type-selection">
                            <div
                                className={`user-type-card ${userType === 'fan' ? 'selected' : ''}`}
                                onClick={() => setUserType('fan')}
                            >
                                <div className="icon">👋</div>
                                <h3>ファン</h3>
                                <p>選手を応援する</p>
                            </div>
                            <div
                                className={`user-type-card ${userType === 'athlete' ? 'selected' : ''}`}
                                onClick={() => setUserType('athlete')}
                            >
                                <div className="icon">🏃</div>
                                <h3>選手</h3>
                                <p>応援を受ける</p>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">お名前</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="山田 太郎"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">メールアドレス</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">パスワード</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワードを入力（6文字以上）"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? '登録中...' : 'アカウント作成'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        既にアカウントをお持ちの方は
                        <Link to="/login">ログイン</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

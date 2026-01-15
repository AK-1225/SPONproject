import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
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
    const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
    const register = useAuthStore(state => state.register)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        const result = await register(email, password, name, userType)

        if (result.success) {
            // Show email confirmation message instead of navigating immediately
            setShowEmailConfirmation(true)
        } else {
            setError(result.error || '登録に失敗しました')
        }
        setIsLoading(false)
    }

    // Email confirmation success screen
    if (showEmailConfirmation) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="email-confirmation">
                        <div className="confirmation-icon">
                            <Mail size={48} />
                        </div>
                        <h2>確認メールを送信しました</h2>
                        <p className="confirmation-email">{email}</p>
                        <p className="confirmation-message">
                            ご登録のメールアドレスに確認メールを送信しました。
                            メール内のリンクをクリックして、アカウントを有効化してください。
                        </p>
                        <div className="confirmation-tips">
                            <div className="tip">
                                <CheckCircle size={16} />
                                <span>メールが届かない場合は迷惑メールフォルダをご確認ください</span>
                            </div>
                        </div>
                        <Link to="/login" className="btn btn-primary" style={{ marginTop: '24px' }}>
                            ログインページへ
                        </Link>
                    </div>
                </div>
            </div>
        )
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

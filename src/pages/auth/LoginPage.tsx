import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import './auth.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [resetEmailSent, setResetEmailSent] = useState(false)

    const { login, resetPassword } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        const result = await login(email, password)

        if (result.success) {
            navigate('/')
        } else {
            setError(result.error || 'ログインに失敗しました')
        }
        setIsLoading(false)
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            setError('メールアドレスを入力してください')
            return
        }

        setError(null)
        setIsLoading(true)

        const result = await resetPassword(email)

        if (result.success) {
            setResetEmailSent(true)
        } else {
            setError(result.error || 'パスワードリセットメールの送信に失敗しました')
        }
        setIsLoading(false)
    }

    // Password reset success screen
    if (resetEmailSent) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="email-confirmation">
                        <div className="confirmation-icon">
                            <Mail size={48} />
                        </div>
                        <h2>パスワードリセットメール送信</h2>
                        <p className="confirmation-email">{email}</p>
                        <p className="confirmation-message">
                            パスワードリセット用のリンクを送信しました。
                            メール内のリンクをクリックして、新しいパスワードを設定してください。
                            <br /><br />
                            <strong>リンクの有効期限: 10分</strong>
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '24px' }}
                            onClick={() => {
                                setResetEmailSent(false)
                                setShowForgotPassword(false)
                            }}
                        >
                            ログイン画面に戻る
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Forgot password form
    if (showForgotPassword) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <button
                            className="back-link"
                            onClick={() => setShowForgotPassword(false)}
                        >
                            <ArrowLeft size={20} />
                            戻る
                        </button>
                        <h1>パスワードリセット</h1>
                        <p>登録したメールアドレスを入力してください</p>
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

                    <form className="login-form" onSubmit={handleForgotPassword}>
                        <div className="form-group">
                            <label htmlFor="reset-email">メールアドレス</label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? '送信中...' : 'リセットリンクを送信'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <h1>SPON</h1>
                    <p>スポーツ選手を見つけて、応援しよう</p>
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
                            placeholder="パスワードを入力"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </button>

                    <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => setShowForgotPassword(true)}
                    >
                        パスワードをお忘れですか？
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        アカウントをお持ちでない方は
                        <Link to="/register">新規登録</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

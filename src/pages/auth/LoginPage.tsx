import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import './auth.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore(state => state.login)
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

import { Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import './mypage.css'

export default function WithdrawalPage() {
    return (
        <div className="withdrawal-page">
            {/* Header */}
            <div className="edit-header">
                <Link to="/mypage" className="back-btn">
                    <ArrowLeft size={24} />
                </Link>
                <h1>引き出し申請</h1>
                <div style={{ width: 24 }} />
            </div>

            {/* Coming Soon */}
            <div className="coming-soon">
                <div className="icon"><Clock size={64} /></div>
                <h2>準備中</h2>
                <p>
                    引き出し機能は現在準備中です。
                    <br />
                    まもなくご利用いただけるようになります。
                </p>
            </div>
        </div>
    )
}

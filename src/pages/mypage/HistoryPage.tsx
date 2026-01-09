import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSupportStore, supportPurposeLabels, paymentMethodLabels } from '@/stores/supportStore'
import { useAthleteStore } from '@/stores/athleteStore'
import { formatDistanceToNow, formatCurrency } from '@/utils/formatDate'
import './mypage.css'

export default function HistoryPage() {
    const supportHistory = useSupportStore(state => state.supportHistory)
    const getAthlete = useAthleteStore(state => state.getAthlete)

    // Sort by date descending
    const sortedHistory = [...supportHistory].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <div className="mypage">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <Link to="/mypage" style={{ color: 'var(--color-gray-600)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h1 style={{ fontSize: '18px', fontWeight: 600 }}>🎁 支援履歴</h1>
            </div>

            {sortedHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedHistory.map(support => {
                        const athlete = getAthlete(support.athleteId)
                        return (
                            <div
                                key={support.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <Link
                                        to={`/athlete/${support.athleteId}`}
                                        style={{ fontWeight: 600, color: 'var(--color-primary-600)' }}
                                    >
                                        {athlete?.name || '選手'}
                                    </Link>
                                    <span style={{
                                        fontWeight: 700,
                                        color: 'var(--color-primary-700)'
                                    }}>
                                        {formatCurrency(support.amount)}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    fontSize: '12px',
                                    color: 'var(--color-gray-500)'
                                }}>
                                    <span className="badge">{supportPurposeLabels[support.purpose]}</span>
                                    <span>{paymentMethodLabels[support.paymentMethod]}</span>
                                    <span>・</span>
                                    <span>{formatDistanceToNow(support.createdAt)}</span>
                                </div>
                                {support.message && (
                                    <p style={{
                                        marginTop: '8px',
                                        fontSize: '14px',
                                        color: 'var(--color-gray-600)'
                                    }}>
                                        "{support.message}"
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="icon">💝</div>
                    <h3>支援履歴はまだありません</h3>
                    <p>選手を応援してみましょう</p>
                    <Link to="/search" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        選手を探す
                    </Link>
                </div>
            )}
        </div>
    )
}

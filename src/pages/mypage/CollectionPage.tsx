import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import './mypage.css'

export default function CollectionPage() {
    const collection = useAthleteStore(state => state.collection)

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
                <h1 style={{ fontSize: '18px', fontWeight: 600 }}>❤️ マイコレクション</h1>
            </div>

            {collection.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                }}>
                    {collection.map(photo => (
                        <div
                            key={photo.id}
                            style={{
                                aspectRatio: '1',
                                borderRadius: '12px',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={photo.url}
                                alt={photo.caption || ''}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="icon">💫</div>
                    <h3>コレクションはまだ空です</h3>
                    <p>お気に入りの写真を保存しましょう</p>
                    <Link to="/search" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        選手を探す
                    </Link>
                </div>
            )}
        </div>
    )
}

import { useState } from 'react'
import { X, Heart, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAthleteStore } from '@/stores/athleteStore'
import { useSupportStore, supportPurposeLabels } from '@/stores/supportStore'
import './fab.css'

const supportPurposes = [
    { id: 'general', label: '応援として', emoji: '💪' },
    { id: 'training', label: 'トレーニング費用', emoji: '🏋️' },
    { id: 'equipment', label: '用具・備品', emoji: '👟' },
    { id: 'travel', label: '遠征費用', emoji: '✈️' },
    { id: 'medical', label: '医療・リカバリー', emoji: '🏥' },
    { id: 'nutrition', label: '栄養・食事', emoji: '🍱' },
]

const amounts = [
    { value: 100, label: '100円', emoji: '☕' },
    { value: 300, label: '300円', emoji: '🎁' },
    { value: 500, label: '500円', emoji: '💝' },
    { value: 1000, label: '1,000円', emoji: '🌟' },
    { value: 3000, label: '3,000円', emoji: '🏆' },
    { value: 5000, label: '5,000円', emoji: '💎' },
]

interface DirectSupportModalProps {
    onClose: () => void
}

type Step = 'athlete' | 'purpose' | 'amount' | 'confirm' | 'success'

export default function DirectSupportModal({ onClose }: DirectSupportModalProps) {
    const { user } = useAuthStore()
    const { athletes, following } = useAthleteStore()
    const { addSupport } = useSupportStore()

    const [step, setStep] = useState<Step>('athlete')
    const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null)
    const [selectedPurpose, setSelectedPurpose] = useState<string>('general')
    const [selectedAmount, setSelectedAmount] = useState<number>(500)
    const [customAmount, setCustomAmount] = useState('')
    const [message, setMessage] = useState('')

    // Get followed athletes only
    const followedAthletes = athletes.filter(a => following.includes(a.id))

    const selectedAthleteData = athletes.find(a => a.id === selectedAthlete)
    const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount

    const handleSubmit = () => {
        if (!selectedAthlete || !user) return

        addSupport({
            fanId: user.id,
            athleteId: selectedAthlete,
            amount: finalAmount,
            purpose: selectedPurpose as any,
            paymentMethod: 'credit',
            message: message || undefined,
        })

        setStep('success')
    }

    const renderStep = () => {
        switch (step) {
            case 'athlete':
                return (
                    <>
                        <div className="step-header">
                            <h3>応援する選手を選択</h3>
                            <p>フォロー中の選手から選べます</p>
                        </div>
                        <div className="athlete-select-list">
                            {followedAthletes.length > 0 ? (
                                followedAthletes.map(athlete => (
                                    <button
                                        key={athlete.id}
                                        className={`athlete-select-item ${selectedAthlete === athlete.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedAthlete(athlete.id)}
                                    >
                                        <img src={athlete.avatarUrl} alt="" className="avatar" />
                                        <div className="info">
                                            <span className="name">{athlete.name}</span>
                                            <span className="sport">{athlete.sport}</span>
                                        </div>
                                        <ChevronRight size={20} />
                                    </button>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>フォロー中の選手がいません</p>
                                    <p>まず選手をフォローしてください</p>
                                </div>
                            )}
                        </div>
                        <button
                            className="next-btn"
                            disabled={!selectedAthlete}
                            onClick={() => setStep('purpose')}
                        >
                            次へ
                        </button>
                    </>
                )

            case 'purpose':
                return (
                    <>
                        <div className="step-header">
                            <h3>支援の用途を選択</h3>
                            <p>{selectedAthleteData?.name}さんへの支援</p>
                        </div>
                        <div className="purpose-grid">
                            {supportPurposes.map(purpose => (
                                <button
                                    key={purpose.id}
                                    className={`purpose-item ${selectedPurpose === purpose.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPurpose(purpose.id)}
                                >
                                    <span className="emoji">{purpose.emoji}</span>
                                    <span className="label">{purpose.label}</span>
                                </button>
                            ))}
                        </div>
                        <button className="next-btn" onClick={() => setStep('amount')}>
                            次へ
                        </button>
                    </>
                )

            case 'amount':
                return (
                    <>
                        <div className="step-header">
                            <h3>金額を選択</h3>
                            <p>{supportPurposeLabels[selectedPurpose as keyof typeof supportPurposeLabels] || selectedPurpose}として</p>
                        </div>
                        <div className="amount-grid">
                            {amounts.map(amount => (
                                <button
                                    key={amount.value}
                                    className={`amount-item ${selectedAmount === amount.value && !customAmount ? 'selected' : ''}`}
                                    onClick={() => { setSelectedAmount(amount.value); setCustomAmount(''); }}
                                >
                                    <span className="emoji">{amount.emoji}</span>
                                    <span className="value">{amount.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="custom-amount">
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="その他の金額"
                                min="100"
                            />
                            <span>円</span>
                        </div>
                        <button
                            className="next-btn"
                            onClick={() => setStep('confirm')}
                            disabled={!finalAmount || finalAmount < 100}
                        >
                            次へ
                        </button>
                    </>
                )

            case 'confirm':
                return (
                    <>
                        <div className="step-header">
                            <h3>確認</h3>
                        </div>
                        <div className="confirm-details">
                            <div className="confirm-row">
                                <span>選手</span>
                                <span>{selectedAthleteData?.name}</span>
                            </div>
                            <div className="confirm-row">
                                <span>用途</span>
                                <span>{supportPurposeLabels[selectedPurpose as keyof typeof supportPurposeLabels] || selectedPurpose}</span>
                            </div>
                            <div className="confirm-row amount">
                                <span>金額</span>
                                <span>¥{finalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="message-input">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="応援メッセージ（任意）"
                                rows={2}
                                maxLength={200}
                            />
                        </div>
                        <button className="submit-btn primary" onClick={handleSubmit}>
                            <Heart size={20} />
                            応援する
                        </button>
                    </>
                )

            case 'success':
                return (
                    <div className="success-content">
                        <div className="success-icon">🎉</div>
                        <h3>応援しました！</h3>
                        <p>{selectedAthleteData?.name}さんに{finalAmount.toLocaleString()}円を送りました</p>
                        <button className="close-success-btn" onClick={onClose}>
                            閉じる
                        </button>
                    </div>
                )
        }
    }

    return (
        <div className="fab-modal-overlay" onClick={onClose}>
            <div className="fab-modal direct-support-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {step !== 'success' && (
                        <button
                            className="close-btn"
                            onClick={step === 'athlete' ? onClose : () => {
                                const prevSteps: Record<Step, Step> = {
                                    'athlete': 'athlete',
                                    'purpose': 'athlete',
                                    'amount': 'purpose',
                                    'confirm': 'amount',
                                    'success': 'confirm'
                                }
                                setStep(prevSteps[step])
                            }}
                        >
                            <X size={24} />
                        </button>
                    )}
                    <h2>選手を応援</h2>
                    <div style={{ width: 24 }} />
                </div>

                <div className="modal-body">
                    {renderStep()}
                </div>
            </div>
        </div>
    )
}

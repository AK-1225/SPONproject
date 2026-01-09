import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useSupportStore, supportPurposeLabels, paymentMethodLabels } from '@/stores/supportStore'
import { useAuthStore } from '@/stores/authStore'
import type { SupportPurpose, PaymentMethod } from '@/types'
import './support.css'

interface PaymentModalProps {
    athleteId: string
    athleteName: string
    postId?: string
    initialAmount?: number | null
    onClose: () => void
}

const amounts = [
    { amount: 100, emoji: '☕', label: 'コーヒー1杯' },
    { amount: 300, emoji: '🥤', label: 'ドリンク' },
    { amount: 500, emoji: '🍱', label: 'お弁当' },
    { amount: 1000, emoji: '🍛', label: 'ランチ' },
    { amount: 3000, emoji: '💪', label: 'プロテイン' },
    { amount: 5000, emoji: '⭐', label: 'スペシャル' },
]

const purposes: SupportPurpose[] = ['travel', 'equipment', 'food', 'transport', 'coaching', 'other']

const paymentMethods: { method: PaymentMethod; icon: string }[] = [
    { method: 'paypay', icon: '📱' },
    { method: 'credit', icon: '💳' },
    { method: 'convenience', icon: '🏪' },
]

export default function PaymentModal({
    athleteId,
    athleteName,
    postId,
    initialAmount,
    onClose,
}: PaymentModalProps) {
    const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount')
    const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || 100)
    const [customAmount, setCustomAmount] = useState('')
    const [selectedPurpose, setSelectedPurpose] = useState<SupportPurpose>('other')
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('paypay')
    const [message, setMessage] = useState('')

    const addSupport = useSupportStore(state => state.addSupport)
    const user = useAuthStore(state => state.user)

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount)
        setCustomAmount('')
    }

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value)
        const num = parseInt(value, 10)
        if (!isNaN(num) && num > 0) {
            setSelectedAmount(num)
        }
    }

    const handleContinue = () => {
        setStep('details')
    }

    const handleSubmit = () => {
        // Add support record
        addSupport({
            fanId: user?.id || 'anonymous',
            athleteId,
            amount: selectedAmount,
            purpose: selectedPurpose,
            message: message || undefined,
            paymentMethod: selectedPayment,
            postId,
        })

        setStep('success')

        // Auto close after success
        setTimeout(() => {
            onClose()
        }, 2000)
    }

    if (step === 'success') {
        return (
            <div className="success-overlay" onClick={onClose}>
                <div className="success-icon">🎉</div>
                <div className="success-message">応援ありがとうございます！</div>
                <div className="success-detail">{athleteName}さんに{selectedAmount}円を贈りました</div>
            </div>
        )
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🎁 {athleteName}さんを応援</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {step === 'amount' && (
                        <>
                            <div className="amount-grid">
                                {amounts.map(({ amount, emoji, label }) => (
                                    <button
                                        key={amount}
                                        className={`amount-btn ${selectedAmount === amount && !customAmount ? 'selected' : ''}`}
                                        onClick={() => handleAmountSelect(amount)}
                                    >
                                        <div className="emoji">{emoji}</div>
                                        <div className="price">{amount}円</div>
                                        <div className="label">{label}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="custom-amount">
                                <label>または金額を入力</label>
                                <div className="custom-amount-input">
                                    <input
                                        type="number"
                                        min="100"
                                        step="100"
                                        value={customAmount}
                                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                                        placeholder="100"
                                    />
                                    <span>円</span>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'details' && (
                        <>
                            <div className="purpose-section">
                                <h3>用途を選択（選手への参考情報）</h3>
                                <div className="purpose-grid">
                                    {purposes.map((purpose) => (
                                        <button
                                            key={purpose}
                                            className={`purpose-btn ${selectedPurpose === purpose ? 'selected' : ''}`}
                                            onClick={() => setSelectedPurpose(purpose)}
                                        >
                                            {supportPurposeLabels[purpose]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="payment-section">
                                <h3>支払方法</h3>
                                <div className="payment-methods">
                                    {paymentMethods.map(({ method, icon }) => (
                                        <button
                                            key={method}
                                            className={`payment-method ${selectedPayment === method ? 'selected' : ''}`}
                                            onClick={() => setSelectedPayment(method)}
                                        >
                                            <span className="icon">{icon}</span>
                                            <span className="name">{paymentMethodLabels[method]}</span>
                                            {selectedPayment === method && (
                                                <Check size={20} className="check" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="custom-amount">
                                <label>メッセージ（任意）</label>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="応援しています！"
                                    style={{ textAlign: 'left' }}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    {step === 'amount' ? (
                        <button
                            className="submit-btn"
                            onClick={handleContinue}
                            disabled={selectedAmount < 100}
                        >
                            {selectedAmount}円で次へ
                        </button>
                    ) : (
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                        >
                            🎁 {selectedAmount}円を応援する
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import PaymentModal from './PaymentModal'
import './support.css'

interface SupportButtonProps {
    athleteId: string
    athleteName: string
    postId?: string
}

const quickAmounts = [
    { amount: 100, emoji: '☕', label: '100円' },
    { amount: 300, emoji: '🎁', label: '300円' },
    { amount: 500, emoji: '💝', label: '500円' },
]

export default function SupportButton({
    athleteId,
    athleteName,
    postId,
}: SupportButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

    const openPaymentModal = (amount: number) => {
        setSelectedAmount(amount)
        setShowModal(true)
    }

    return (
        <>
            <div className="support-buttons">
                {quickAmounts.map(({ amount, emoji, label }) => (
                    <button
                        key={amount}
                        className="support-btn support-btn-amount"
                        onClick={() => openPaymentModal(amount)}
                        title={`${amount}円で応援`}
                    >
                        {emoji} {label}
                    </button>
                ))}
            </div>

            {showModal && (
                <PaymentModal
                    athleteId={athleteId}
                    athleteName={athleteName}
                    postId={postId}
                    initialAmount={selectedAmount}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}

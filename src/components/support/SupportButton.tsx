import { useState } from 'react'
import { Heart } from 'lucide-react'
import PaymentModal from './PaymentModal'
import './support.css'

interface SupportButtonProps {
    athleteId: string
    athleteName: string
    postId?: string
    onLike?: () => void
    likeCount?: number
    isLiked?: boolean
}

const quickAmounts = [
    { amount: 100, emoji: '☕', label: 'コーヒー' },
    { amount: 300, emoji: '🥤', label: 'ドリンク' },
    { amount: 500, emoji: '🍱', label: 'お弁当' },
]

export default function SupportButton({
    athleteId,
    athleteName,
    postId,
    onLike,
    likeCount = 0,
    isLiked = false,
}: SupportButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const [liked, setLiked] = useState(isLiked)

    const handleLike = () => {
        setLiked(!liked)
        onLike?.()
    }

    const openPaymentModal = (amount: number) => {
        setSelectedAmount(amount)
        setShowModal(true)
    }

    return (
        <>
            <div className="support-buttons">
                <button
                    className={`support-btn support-btn-like ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    {likeCount > 0 && <span>{likeCount}</span>}
                </button>

                {quickAmounts.map(({ amount, emoji, label }) => (
                    <button
                        key={amount}
                        className="support-btn support-btn-amount"
                        onClick={() => openPaymentModal(amount)}
                        title={label}
                    >
                        {emoji} {amount}円
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

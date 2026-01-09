import { Link } from 'react-router-dom'
import { useAthleteStore } from '@/stores/athleteStore'
import type { Athlete } from '@/types'
import './athlete.css'

interface AthleteCardProps {
    athlete: Athlete
    showFollowButton?: boolean
}

export default function AthleteCard({ athlete, showFollowButton = true }: AthleteCardProps) {
    const { isFollowing, followAthlete, unfollowAthlete } = useAthleteStore()
    const following = isFollowing(athlete.id)

    const handleFollowClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (following) {
            unfollowAthlete(athlete.id)
        } else {
            followAthlete(athlete.id)
        }
    }

    return (
        <Link to={`/athlete/${athlete.id}`} className="athlete-card">
            <img
                src={athlete.avatarUrl || '/default-avatar.png'}
                alt={athlete.name}
                className="athlete-card-avatar"
            />
            <div className="athlete-card-info">
                <div className="athlete-card-name">{athlete.name}</div>
                <div className="athlete-card-sport">{athlete.sport}</div>
                <div className="athlete-card-meta">{athlete.region}</div>
            </div>
            <div className="athlete-card-stats">
                <div className="athlete-card-followers">
                    {athlete.followerCount} フォロワー
                </div>
                {showFollowButton && (
                    <button
                        className={`follow-btn ${following ? 'following' : 'not-following'}`}
                        onClick={handleFollowClick}
                    >
                        {following ? 'フォロー中' : 'フォロー'}
                    </button>
                )}
            </div>
        </Link>
    )
}

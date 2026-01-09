import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import { sportsList, regionsList } from '@/data/mockData'
import AthleteCard from '@/components/athlete/AthleteCard'
import './search.css'

export default function SearchPage() {
    const athletes = useAthleteStore(state => state.athletes)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSport, setSelectedSport] = useState<string | null>(null)
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

    // Filter athletes based on search and filters
    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => {
            // Search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesName = athlete.name.toLowerCase().includes(query)
                const matchesSport = athlete.sport.toLowerCase().includes(query)
                const matchesTags = athlete.tags.some(t => t.toLowerCase().includes(query))
                if (!matchesName && !matchesSport && !matchesTags) return false
            }

            // Sport filter
            if (selectedSport && athlete.sport !== selectedSport) return false

            // Region filter
            if (selectedRegion && !athlete.region.includes(selectedRegion)) return false

            return true
        })
    }, [athletes, searchQuery, selectedSport, selectedRegion])

    // Get unique sports from athletes
    const availableSports = useMemo(() => {
        const sports = new Set(athletes.map(a => a.sport))
        return sportsList.filter(s => sports.has(s))
    }, [athletes])

    // Get unique regions from athletes
    const availableRegions = useMemo(() => {
        const regions = new Set(athletes.map(a => a.region))
        return regionsList.filter(r => [...regions].some(ar => ar.includes(r)))
    }, [athletes])

    return (
        <div className="search-page">
            {/* Search Bar */}
            <div className="search-bar">
                <Search size={20} className="icon" />
                <input
                    type="text"
                    placeholder="選手名、競技、タグで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sport Filter */}
            <div className="filter-section">
                <h3>競技</h3>
                <div className="filter-tags">
                    <button
                        className={`filter-tag ${!selectedSport ? 'selected' : ''}`}
                        onClick={() => setSelectedSport(null)}
                    >
                        すべて
                    </button>
                    {availableSports.map(sport => (
                        <button
                            key={sport}
                            className={`filter-tag ${selectedSport === sport ? 'selected' : ''}`}
                            onClick={() => setSelectedSport(sport === selectedSport ? null : sport)}
                        >
                            {sport}
                        </button>
                    ))}
                </div>
            </div>

            {/* Region Filter */}
            <div className="filter-section">
                <h3>地域</h3>
                <div className="filter-tags">
                    <button
                        className={`filter-tag ${!selectedRegion ? 'selected' : ''}`}
                        onClick={() => setSelectedRegion(null)}
                    >
                        すべて
                    </button>
                    {availableRegions.slice(0, 6).map(region => (
                        <button
                            key={region}
                            className={`filter-tag ${selectedRegion === region ? 'selected' : ''}`}
                            onClick={() => setSelectedRegion(region === selectedRegion ? null : region)}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="results-section">
                <div className="results-header">
                    <h2>選手一覧</h2>
                    <span className="results-count">{filteredAthletes.length}人</span>
                </div>

                <div className="athlete-list">
                    {filteredAthletes.length > 0 ? (
                        filteredAthletes.map(athlete => (
                            <AthleteCard key={athlete.id} athlete={athlete} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="icon">🔍</div>
                            <h3>該当する選手が見つかりません</h3>
                            <p>検索条件を変えてお試しください</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

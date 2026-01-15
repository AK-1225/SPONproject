import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAthleteStore } from '@/stores/athleteStore'
import { sportsList, regionsList } from '@/data/mockData'
import AthleteCard from '@/components/athlete/AthleteCard'
import PostCard from '@/components/athlete/PostCard'
import './search.css'

type ViewMode = 'athletes' | 'posts'

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { athletes, posts } = useAthleteStore()

    // Get initial values from URL params
    const initialTag = searchParams.get('tag') || ''
    const initialQuery = searchParams.get('q') || ''

    const [searchQuery, setSearchQuery] = useState(initialQuery || initialTag)
    const [selectedSport, setSelectedSport] = useState<string | null>(null)
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>(initialTag ? 'posts' : 'athletes')

    // Update search when URL params change
    useEffect(() => {
        const tag = searchParams.get('tag')
        const q = searchParams.get('q')
        if (tag) {
            setSearchQuery(tag)
            setViewMode('posts')
        } else if (q) {
            setSearchQuery(q)
        }
    }, [searchParams])

    // Filter athletes based on search and filters
    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => {
            // Search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesName = athlete.name.toLowerCase().includes(query)
                const matchesSport = athlete.sport.toLowerCase().includes(query)
                const matchesTags = athlete.tags.some(t => t.toLowerCase().includes(query))
                const matchesHandle = athlete.userHandle?.toLowerCase().includes(query)
                if (!matchesName && !matchesSport && !matchesTags && !matchesHandle) return false
            }

            // Sport filter
            if (selectedSport && athlete.sport !== selectedSport) return false

            // Region filter
            if (selectedRegion && !athlete.region.includes(selectedRegion)) return false

            return true
        })
    }, [athletes, searchQuery, selectedSport, selectedRegion])

    // Filter posts based on search (tags)
    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts

        const query = searchQuery.toLowerCase()
        return posts.filter(post => {
            // Match by tag
            if (post.tags?.some(t => t.toLowerCase().includes(query))) return true
            // Match by caption
            if (post.caption?.toLowerCase().includes(query)) return true
            // Match by athlete sport
            const athlete = athletes.find(a => a.id === post.athleteId)
            if (athlete?.sport.toLowerCase().includes(query)) return true
            if (athlete?.tags.some(t => t.toLowerCase().includes(query))) return true
            return false
        })
    }, [posts, searchQuery, athletes])

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

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query) {
            setSearchParams({ q: query })
        } else {
            setSearchParams({})
        }
    }

    const clearTagSearch = () => {
        setSearchQuery('')
        setSearchParams({})
        setViewMode('athletes')
    }

    return (
        <div className="search-page">
            {/* Search Bar */}
            <div className="search-bar">
                <Search size={20} className="icon" />
                <input
                    type="text"
                    placeholder="選手名、競技、タグで検索..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {searchQuery && (
                    <button className="clear-btn" onClick={clearTagSearch}>
                        ✕
                    </button>
                )}
            </div>

            {/* View toggle - show when searching */}
            {searchQuery && (
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'athletes' ? 'active' : ''}`}
                        onClick={() => setViewMode('athletes')}
                    >
                        選手 ({filteredAthletes.length})
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'posts' ? 'active' : ''}`}
                        onClick={() => setViewMode('posts')}
                    >
                        投稿 ({filteredPosts.length})
                    </button>
                </div>
            )}

            {/* Sport Filter (only in athletes view) */}
            {viewMode === 'athletes' && (
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
            )}

            {/* Region Filter (only in athletes view) */}
            {viewMode === 'athletes' && (
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
            )}

            {/* Results */}
            <div className="results-section">
                {viewMode === 'athletes' ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <div className="results-header">
                            <h2>「{searchQuery}」の投稿</h2>
                            <span className="results-count">{filteredPosts.length}件</span>
                        </div>

                        <div className="posts-list">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.slice(0, 20).map(post => {
                                    const athlete = athletes.find(a => a.id === post.athleteId)
                                    return <PostCard key={post.id} post={post} athlete={athlete} />
                                })
                            ) : (
                                <div className="empty-state">
                                    <div className="icon">📷</div>
                                    <h3>「{searchQuery}」の投稿が見つかりません</h3>
                                    <p>他のタグで検索してみてください</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

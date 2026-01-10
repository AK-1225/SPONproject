import type { Athlete, Post, Photo, Story } from '@/types'

// Extended sports list with many more categories
export const sportsList = [
    // メジャースポーツ
    '陸上競技', 'サッカー', '野球', 'バスケットボール', 'バレーボール', 'テニス',
    // 格闘技
    '柔道', '空手', 'ボクシング', 'レスリング', '剣道', 'テコンドー', '合気道',
    // ラケットスポーツ
    'バドミントン', '卓球', 'スカッシュ',
    // 水泳系
    '競泳', '飛び込み', '水球', 'シンクロナイズドスイミング',
    // ウィンタースポーツ
    'フィギュアスケート', 'スピードスケート', 'スキー', 'スノーボード', 'カーリング', 'アイスホッケー',
    // 体操・ダンス
    '体操', '新体操', 'チアリーディング', 'ダンス', 'バレエ',
    // 自転車・モータースポーツ
    '自転車競技', 'BMX', 'トライアスロン',
    // ゴルフ・アウトドア
    'ゴルフ', 'アーチェリー', '射撃', '馬術',
    // その他
    'eスポーツ', 'チェス', 'ボウリング', 'ビリヤード', 'ダーツ',
    // マイナースポーツ
    'ラクロス', 'ホッケー', 'ハンドボール', 'アメフト', 'ラグビー',
    'ボルダリング', 'クライミング', 'スケートボード', 'サーフィン', 'カヌー', 'ボート',
    'フェンシング', 'セーリング', 'ウェイトリフティング', 'パワーリフティング',
]

// Sports categories for discovery (競技ベース)
export const tagCategories = [
    { id: '陸上競技', label: '陸上競技', emoji: '🏃', color: '#10B981' },
    { id: 'サッカー', label: 'サッカー', emoji: '⚽', color: '#22C55E' },
    { id: '野球', label: '野球', emoji: '⚾', color: '#EF4444' },
    { id: 'バスケットボール', label: 'バスケ', emoji: '🏀', color: '#F97316' },
    { id: 'バレーボール', label: 'バレー', emoji: '🏐', color: '#3B82F6' },
    { id: 'テニス', label: 'テニス', emoji: '🎾', color: '#84CC16' },
    { id: '競泳', label: '水泳', emoji: '🏊', color: '#06B6D4' },
    { id: '柔道', label: '柔道', emoji: '🥋', color: '#8B5CF6' },
    { id: '体操', label: '体操', emoji: '🤸', color: '#EC4899' },
    { id: 'バドミントン', label: 'バドミントン', emoji: '🏸', color: '#14B8A6' },
    { id: 'フィギュアスケート', label: 'スケート', emoji: '⛸️', color: '#6366F1' },
    { id: 'ボルダリング', label: 'クライミング', emoji: '🧗', color: '#A855F7' },
]

// Regions list
export const regionsList = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

// Reliable photo URLs by sport category
const photoUrls = {
    track: [
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop',
    ],
    soccer: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=600&fit=crop',
    ],
    swimming: [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&h=600&fit=crop',
    ],
    basketball: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=600&fit=crop',
    ],
    tennis: [
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=600&fit=crop',
    ],
    skating: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
    ],
    gym: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
    ],
    martial: [
        'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
    ],
    badminton: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1613918431703-aa50889e3be5?w=600&h=600&fit=crop',
    ],
    volleyball: [
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&h=600&fit=crop',
    ],
    baseball: [
        'https://images.unsplash.com/photo-1529768167801-9173d94c2a42?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&h=600&fit=crop',
    ],
    climbing: [
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&h=600&fit=crop',
    ],
    general: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=600&fit=crop',
    ],
}

const avatarUrls = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face',
]

// Helper to get random element
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

// Japanese names
const lastNames = ['山田', '田中', '鈴木', '佐藤', '高橋', '伊藤', '渡辺', '中村', '小林', '加藤', '吉田', '山本', '松本', '井上', '木村', '林', '斎藤', '清水', '山口', '森']
const firstNamesMale = ['太郎', '健太', '翔', '大輝', '拓海', '颯太', '蓮', '悠真', '陽翔', '湊', '樹', '大和', '悠斗', '陸', '駿']
const firstNamesFemale = ['花子', '美咲', '陽菜', 'さくら', '結衣', '凛', '芽依', '楓', '莉子', '心春', '美月', '優花', '愛', '結菜', '葵']

// Athlete definitions with matching sport-specific photos
const athleteData = [
    { sport: '陸上競技', tags: ['短距離', 'スプリント'], category: 'track' },
    { sport: 'バドミントン', tags: ['シングルス', '練習'], category: 'badminton' },
    { sport: '競泳', tags: ['自由形', 'バタフライ'], category: 'swimming' },
    { sport: 'フィギュアスケート', tags: ['アイスダンス', '演技'], category: 'skating' },
    { sport: 'サッカー', tags: ['MF', 'ドリブル'], category: 'soccer' },
    { sport: 'バスケットボール', tags: ['PG', '3ポイント'], category: 'basketball' },
    { sport: 'テニス', tags: ['シングルス', 'サーブ'], category: 'tennis' },
    { sport: '柔道', tags: ['60kg級', '投げ技'], category: 'martial' },
    { sport: 'バレーボール', tags: ['セッター', 'スパイク'], category: 'volleyball' },
    { sport: '体操', tags: ['床運動', '鉄棒'], category: 'gym' },
    { sport: '野球', tags: ['投手', '甲子園'], category: 'baseball' },
    { sport: '空手', tags: ['形', '組手'], category: 'martial' },
    { sport: 'ボルダリング', tags: ['クライミング', 'アウトドア'], category: 'climbing' },
    { sport: 'スノーボード', tags: ['ハーフパイプ', 'フリースタイル'], category: 'general' },
    { sport: 'ダンス', tags: ['ヒップホップ', 'コンテスト'], category: 'gym' },
    { sport: 'eスポーツ', tags: ['FPS', 'プロゲーマー'], category: 'general' },
    { sport: 'トライアスロン', tags: ['持久力', 'マルチ'], category: 'swimming' },
    { sport: '新体操', tags: ['リボン', 'ボール'], category: 'gym' },
    { sport: 'ラグビー', tags: ['フォワード', 'タックル'], category: 'general' },
    { sport: 'ゴルフ', tags: ['ドライバー', 'パター'], category: 'general' },
]

// Generate athletes with sport-matching photos
const generateAthletes = (): Athlete[] => {
    const athletes: Athlete[] = []

    for (let i = 0; i < 20; i++) {
        const data = athleteData[i]
        const isFemale = i % 3 === 1
        const firstName = isFemale ? random(firstNamesFemale) : random(firstNamesMale)
        const lastName = lastNames[i % lastNames.length]
        const sportPhotos = photoUrls[data.category as keyof typeof photoUrls] || photoUrls.general

        const athlete: Athlete = {
            id: `athlete-${i + 1}`,
            email: `athlete${i + 1}@example.com`,
            name: `${lastName} ${firstName}`,
            userType: 'athlete',
            avatarUrl: avatarUrls[i % avatarUrls.length],
            bio: `${data.sport}選手として活動中。${data.tags[0]}が得意です。応援よろしくお願いします！`,
            createdAt: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
            sport: data.sport,
            region: random(regionsList),
            team: i % 2 === 0 ? `${random(regionsList)}スポーツクラブ` : undefined,
            tags: data.tags,
            followerCount: randomInt(50, 2000),
            supporterCount: randomInt(5, 200),
            totalSupport: randomInt(5000, 500000),
            bestShots: sportPhotos.slice(0, 3).map((url, j) => ({
                id: `best-${i}-${j}`,
                athleteId: `athlete-${i + 1}`,
                url,
                caption: `${data.sport}のベストショット`,
                isBestShot: true,
                likeCount: randomInt(10, 500),
                supportCount: randomInt(1, 50),
                createdAt: new Date(Date.now() - randomInt(1, 180) * 24 * 60 * 60 * 1000).toISOString(),
            })),
            socialLinks: {},
        }
        athletes.push(athlete)
    }

    return athletes
}

// Generate posts with sport-matching photos
const generatePosts = (athletes: Athlete[]): Post[] => {
    const posts: Post[] = []

    // Sport-specific captions
    const captionTemplates: Record<string, string[]> = {
        track: ['今日のタイムトライアルで自己ベスト！', 'スタート練習を重点的に', '大会に向けて追い込み中🏃'],
        soccer: ['今日のシュート練習💪', 'チームで勝利！', 'ドリブル練習の日々'],
        basketball: ['3ポイント決まった！', 'チーム練習終了', 'ディフェンスの強化中'],
        swimming: ['今日のプール練習🏊', 'タイム測定してきました', '水中トレーニング'],
        tennis: ['サーブ練習の成果が出てきた🎾', 'ラリー練習', '試合終了！'],
        martial: ['組み手の練習', '道場での稽古', '大会に向けて'],
        gym: ['今日の演技練習', '新しい技に挑戦中', '柔軟性アップトレーニング'],
        volleyball: ['スパイク練習💪', 'レシーブの特訓', 'チーム練習'],
        badminton: ['シャトルを追いかけて🏸', 'ラリー練習', 'フットワーク強化'],
        skating: ['今日の滑走練習⛸️', '新しいプログラム', 'ジャンプの練習'],
        baseball: ['投球練習⚾', 'バッティング特訓', '守備練習'],
        climbing: ['今日のボルダー🧗', '課題クリア！', '壁と向き合う'],
        general: ['今日も練習頑張りました！', 'トレーニング終了💪', '応援ありがとうございます'],
    }

    athletes.forEach((athlete, athleteIdx) => {
        const numPosts = randomInt(2, 4)
        const data = athleteData[athleteIdx]
        const sportPhotos = photoUrls[data.category as keyof typeof photoUrls] || photoUrls.general
        const sportCaptions = captionTemplates[data.category] || captionTemplates.general

        for (let i = 0; i < numPosts; i++) {
            const postId = `post-${athleteIdx * 10 + i + 1}`
            const photoUrl = sportPhotos[i % sportPhotos.length]

            const postPhotos: Photo[] = [{
                id: `photo-${postId}`,
                athleteId: athlete.id,
                postId,
                url: photoUrl,
                caption: '',
                isBestShot: false,
                likeCount: randomInt(5, 300),
                supportCount: randomInt(0, 30),
                createdAt: new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
            }]

            posts.push({
                id: postId,
                athleteId: athlete.id,
                photos: postPhotos,
                caption: sportCaptions[i % sportCaptions.length],
                visibility: 'public',
                tags: [...data.tags],
                likeCount: randomInt(10, 500),
                supportCount: randomInt(1, 50),
                totalSupportAmount: randomInt(100, 10000),
                createdAt: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000).toISOString(),
            })
        }
    })

    // Sort by date
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Generate stories with sport-matching photos
const generateStories = (athletes: Athlete[]): Story[] => {
    const stories: Story[] = []

    // Only some athletes have active stories
    athletes.slice(0, 8).forEach((athlete, i) => {
        const data = athleteData[i]
        const sportPhotos = photoUrls[data.category as keyof typeof photoUrls] || photoUrls.general

        stories.push({
            id: `story-${i + 1}`,
            athleteId: athlete.id,
            photoUrl: sportPhotos[0],
            caption: `今日の${data.sport}！`,
            visibility: 'public',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - randomInt(1, 20) * 60 * 60 * 1000).toISOString(),
        })
    })

    return stories
}

// Export generated data
export const mockAthletes = generateAthletes()
export const mockPosts = generatePosts(mockAthletes)
export const mockStories = generateStories(mockAthletes)

// Re-export for backward compatibility
export { mockAthletes as athletes }
export { mockPosts as posts }
export { mockStories as stories }

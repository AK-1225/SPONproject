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

// Tag categories for discovery
export const tagCategories = [
    { id: 'practice', label: '練習風景', emoji: '💪', color: '#10B981' },
    { id: 'competition', label: '試合・大会', emoji: '🏆', color: '#F59E0B' },
    { id: 'training', label: 'トレーニング', emoji: '🏋️', color: '#EF4444' },
    { id: 'daily', label: '日常', emoji: '📷', color: '#8B5CF6' },
    { id: 'team', label: 'チームメイト', emoji: '🤝', color: '#3B82F6' },
    { id: 'food', label: '食事・栄養', emoji: '🍱', color: '#EC4899' },
    { id: 'equipment', label: '用具・ギア', emoji: '👟', color: '#6366F1' },
    { id: 'journey', label: '遠征', emoji: '✈️', color: '#14B8A6' },
    { id: 'recovery', label: 'リカバリー', emoji: '🧘', color: '#84CC16' },
    { id: 'motivation', label: 'モチベーション', emoji: '🔥', color: '#F97316' },
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

// Sample photo URLs categorized
const photoUrls = {
    track: [
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1461896836934- voices-athletes-running?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=600&h=600&fit=crop',
    ],
    soccer: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=600&fit=crop',
    ],
    swimming: [
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=600&fit=crop',
    ],
    basketball: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=600&fit=crop',
    ],
    tennis: [
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=600&fit=crop',
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
    ],
    badminton: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop',
    ],
    volleyball: [
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=600&fit=crop',
    ],
    general: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
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

// Generate athletes
const generateAthletes = (): Athlete[] => {
    const athletes: Athlete[] = []

    const athleteData = [
        { sport: '陸上競技', tags: ['短距離', 'スプリント', '練習風景'], category: 'track' },
        { sport: 'バドミントン', tags: ['シングルス', '練習', '試合'], category: 'badminton' },
        { sport: '競泳', tags: ['自由形', 'バタフライ', '水泳'], category: 'swimming' },
        { sport: 'フィギュアスケート', tags: ['アイスダンス', '演技', 'フィギュア'], category: 'skating' },
        { sport: 'サッカー', tags: ['MF', 'ドリブル', '試合'], category: 'soccer' },
        { sport: 'バスケットボール', tags: ['PG', '3ポイント', 'チーム'], category: 'basketball' },
        { sport: 'テニス', tags: ['シングルス', 'サーブ', '大会'], category: 'tennis' },
        { sport: '柔道', tags: ['60kg級', '投げ技', '道場'], category: 'martial' },
        { sport: 'バレーボール', tags: ['セッター', 'スパイク', 'チーム'], category: 'volleyball' },
        { sport: '体操', tags: ['床運動', '鉄棒', '演技'], category: 'gym' },
        { sport: '野球', tags: ['投手', '甲子園', 'チーム'], category: 'general' },
        { sport: '空手', tags: ['形', '組手', '全国大会'], category: 'martial' },
        { sport: 'ボルダリング', tags: ['クライミング', 'アウトドア', '挑戦'], category: 'general' },
        { sport: 'スノーボード', tags: ['ハーフパイプ', 'フリースタイル', '雪山'], category: 'general' },
        { sport: 'ダンス', tags: ['ヒップホップ', 'コンテスト', 'パフォーマンス'], category: 'general' },
        { sport: 'eスポーツ', tags: ['FPS', 'プロゲーマー', '大会'], category: 'general' },
        { sport: 'トライアスロン', tags: ['持久力', 'マルチスポーツ', '挑戦'], category: 'swimming' },
        { sport: '新体操', tags: ['リボン', 'ボール', '演技'], category: 'gym' },
        { sport: 'ラグビー', tags: ['フォワード', 'タックル', 'チーム'], category: 'general' },
        { sport: 'ゴルフ', tags: ['ドライバー', 'パター', 'コース'], category: 'general' },
    ]

    for (let i = 0; i < 20; i++) {
        const data = athleteData[i]
        const isFemale = i % 3 === 1
        const firstName = isFemale ? random(firstNamesFemale) : random(firstNamesMale)
        const lastName = lastNames[i % lastNames.length]
        const photos = photoUrls[data.category as keyof typeof photoUrls] || photoUrls.general

        const athlete: Athlete = {
            id: `athlete-${i + 1}`,
            email: `athlete${i + 1}@example.com`,
            name: `${lastName} ${firstName}`,
            userType: 'athlete',
            avatarUrl: avatarUrls[i % avatarUrls.length],
            bio: `${data.sport}選手として活動中。${random(data.tags)}が得意です。応援よろしくお願いします！`,
            createdAt: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
            sport: data.sport,
            region: random(regionsList),
            team: i % 2 === 0 ? `${random(regionsList)}スポーツクラブ` : undefined,
            tags: data.tags,
            followerCount: randomInt(50, 2000),
            supporterCount: randomInt(5, 200),
            totalSupport: randomInt(5000, 500000),
            bestShots: photos.slice(0, 3).map((url, j) => ({
                id: `best-${i}-${j}`,
                athleteId: `athlete-${i + 1}`,
                url,
                caption: `ベストショット ${j + 1}`,
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

// Generate posts
const generatePosts = (athletes: Athlete[]): Post[] => {
    const posts: Post[] = []
    const captions = [
        '今日の練習で自己ベスト更新できました！まだまだ上を目指します💪',
        '大会に向けて追い込み中。応援よろしくお願いします！',
        '新しいトレーニングメニューに挑戦中🔥',
        'チームメイトと切磋琢磨しています',
        '今日は天気が良くて最高の練習日和でした☀️',
        'ついに新しい用具が届きました！これで練習が楽しみ',
        '遠征先での1枚。いい経験になりました',
        'リカバリーも大切。今日はしっかり休みます',
        '応援ありがとうございます！皆さんのおかげで頑張れます',
        '試合終了！全力で戦いました',
        '毎日コツコツ積み重ねていきます',
        '今週のトレーニングメニューをこなしました💪',
        'サポーターの皆さん、いつもありがとうございます！',
        '新しい技に挑戦中。まだまだ練習が必要です',
        '今日の食事。栄養管理も大切！🍱',
    ]

    const tags = ['練習風景', '試合', 'トレーニング', '日常', 'チーム', '食事', '用具', '遠征', 'リカバリー', 'モチベーション']

    athletes.forEach((athlete, athleteIdx) => {
        const numPosts = randomInt(2, 5)
        const photos = Object.values(photoUrls).flat()

        for (let i = 0; i < numPosts; i++) {
            const postId = `post-${athleteIdx * 10 + i + 1}`
            const postPhotos: Photo[] = [{
                id: `photo-${postId}`,
                athleteId: athlete.id,
                postId,
                url: random(photos),
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
                caption: random(captions),
                visibility: 'public',
                tags: [random(tags), random(tags)].filter((v, i, a) => a.indexOf(v) === i),
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

// Generate stories
const generateStories = (athletes: Athlete[]): Story[] => {
    const stories: Story[] = []
    const photos = Object.values(photoUrls).flat()

    // Only some athletes have active stories
    athletes.slice(0, 8).forEach((athlete, i) => {
        stories.push({
            id: `story-${i + 1}`,
            athleteId: athlete.id,
            photoUrl: random(photos),
            caption: random(['今日の練習！', '頑張ってます💪', 'おはようございます☀️', '試合前！', '']),
            visibility: 'public',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
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

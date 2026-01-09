// User types
export type UserType = 'fan' | 'athlete';

export type UserTier = 'general' | 'follower' | 'supporter';

export interface User {
    id: string;
    email: string;
    name: string;
    userType: UserType;
    avatarUrl?: string;
    bio?: string;
    createdAt: string;
}

// Athlete-specific types
export interface Athlete extends User {
    userType: 'athlete';
    sport: string;
    region: string;
    team?: string;
    tags: string[];
    followerCount: number;
    supporterCount: number;
    totalSupport: number;
    bestShots: Photo[];
    socialLinks?: {
        twitter?: string;
        instagram?: string;
    };
}

// Fan-specific types
export interface Fan extends User {
    userType: 'fan';
    following: string[]; // Athlete IDs
    supportHistory: Support[];
    collection: Photo[];
}

// Content types
export interface Photo {
    id: string;
    athleteId: string;
    url: string;
    caption?: string;
    isBestShot: boolean;
    createdAt: string;
    likeCount: number;
    supportCount: number;
}

export interface Post {
    id: string;
    athleteId: string;
    athlete?: Athlete;
    photos: Photo[];
    caption: string;
    visibility: 'public' | 'followers' | 'supporters';
    createdAt: string;
    likeCount: number;
    supportCount: number;
    totalSupportAmount: number;
}

export interface Story {
    id: string;
    athleteId: string;
    athlete?: Athlete;
    photoUrl: string;
    caption?: string;
    visibility: 'public' | 'followers' | 'supporters';
    expiresAt: string;
    createdAt: string;
}

// Support types
export type SupportPurpose =
    | 'travel'      // 遠征費
    | 'equipment'   // 用具代
    | 'food'        // 食費
    | 'transport'   // 交通費
    | 'coaching'    // コーチング費
    | 'other';      // その他

export type PaymentMethod = 'paypay' | 'credit' | 'convenience';

export interface Support {
    id: string;
    fanId: string;
    athleteId: string;
    amount: number;
    purpose: SupportPurpose;
    message?: string;
    paymentMethod: PaymentMethod;
    createdAt: string;
    postId?: string; // If support was made on a post
}

// Board types
export interface BoardPost {
    id: string;
    athleteId: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    content: string;
    createdAt: string;
    isDeleted: boolean;
}

// Filter types
export interface AthleteFilters {
    sport?: string;
    region?: string;
    tags?: string[];
    searchQuery?: string;
}

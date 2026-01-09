import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/components/layout/Layout'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import HomePage from '@/pages/home/HomePage'
import SearchPage from '@/pages/search/SearchPage'
import AthleteProfilePage from '@/pages/athlete/AthleteProfilePage'
import BoardPage from '@/pages/athlete/BoardPage'
import BestShotDetailPage from '@/pages/athlete/BestShotDetailPage'
import FollowingPage from '@/pages/following/FollowingPage'
import MyPage from '@/pages/mypage/MyPage'
import CollectionPage from '@/pages/mypage/CollectionPage'
import HistoryPage from '@/pages/mypage/HistoryPage'
import ProfileEditPage from '@/pages/mypage/ProfileEditPage'

const router = createBrowserRouter([
    // Auth pages (no layout)
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    // Main app with layout
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'following',
                element: <FollowingPage />,
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
            {
                path: 'athletes',
                element: <SearchPage />,
            },
            {
                path: 'athlete/:id',
                element: <AthleteProfilePage />,
            },
            {
                path: 'athlete/:id/board',
                element: <BoardPage />,
            },
            {
                path: 'athlete/:id/best-shot/:photoId',
                element: <BestShotDetailPage />,
            },
            {
                path: 'mypage',
                element: <MyPage />,
            },
            {
                path: 'mypage/collection',
                element: <CollectionPage />,
            },
            {
                path: 'mypage/history',
                element: <HistoryPage />,
            },
            {
                path: 'mypage/edit',
                element: <ProfileEditPage />,
            },
            {
                path: 'mypage/settings',
                element: <div className="empty-state">
                    <div className="icon">⚙️</div>
                    <h3>設定</h3>
                    <p>準備中です</p>
                </div>,
            },
        ],
    },
])

export default function Router() {
    return <RouterProvider router={router} />
}

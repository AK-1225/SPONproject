# SPON - スポーツ選手支援プラットフォーム

**SPON**は、学生・アマチュア・マイナースポーツ選手を発見し、100円からのマイクロ支援ができるSNS一体型プラットフォームです。

## 🎯 主な機能

- **選手発見**: 競技別・地域別のフィルターで選手を検索
- **マイクロ支援**: 100円〜の少額から気軽に応援
- **支援用途選択**: 遠征費、用具代、食費などの用途を指定
- **選手プロフィール**: ベストショット、投稿、掲示板
- **サポーター階層**: 支援額に応じたバッジ付与

## 🛠 技術スタック

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand
- **Styling**: Vanilla CSS (CSS Variables)
- **Backend**: Supabase (Auth + Database)
- **Deploy**: Vercel

## 🚀 セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定（.env.localを作成）
cp .env.example .env.local
# Supabaseの認証情報を設定

# 開発サーバーの起動
npm run dev
```

## 📁 ディレクトリ構成

```
src/
├── components/     # 再利用可能なコンポーネント
├── pages/          # ページコンポーネント
├── stores/         # Zustand stores
├── lib/            # Supabase client
├── types/          # TypeScript型定義
├── styles/         # グローバルCSS
└── data/           # モックデータ
```

## 🗄 データベース設定

Supabaseで`supabase/schema.sql`を実行してテーブルを作成してください。

## 📄 ライセンス

MIT

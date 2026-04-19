# 麻雀役一覧

翻数順でパッと引ける麻雀の役リファレンスサイトです。

## 公開URL

https://taigasorimachi.github.io/mahjong-yaku/

## 機能

- 全50種以上の役を翻数別に一覧表示
- 役名・よみでインクリメンタル検索
- 翻数別フィルタリング（複数選択可）
- 門前限定役のみ表示フィルタ
- ダークモード対応（システム設定を自動検出、手動切り替え可）
- レスポンシブデザイン（スマホ対応）

## 技術スタック

- Vite + React 18 + TypeScript
- Tailwind CSS v3
- Node.js 20
- Docker (開発環境)

## ローカル開発

### 前提条件

- Docker Desktop がインストールされていること

### 起動手順

```bash
# リポジトリをクローン
git clone https://github.com/TaigaSorimachi/mahjong-yaku.git
cd mahjong-yaku

# Docker Composeで起動
docker compose up
```

ブラウザで http://localhost:5173 を開いてください。

### 開発中のホットリロード

ソースファイルを編集すると、自動的にブラウザが更新されます。

### コンテナの停止

```bash
docker compose down
```

### ビルド確認

```bash
docker compose run --rm web pnpm build
```

## GitHub Pages デプロイ設定

1. GitHubリポジトリの Settings → Pages を開く
2. Source で「GitHub Actions」を選択
3. mainブランチにpushすると自動デプロイされる

## ディレクトリ構成

```
src/
  components/
    YakuCard.tsx        # 役1件分のカード
    YakuSection.tsx     # 翻数カテゴリのセクション
    SearchBar.tsx       # 検索バー
    FilterChips.tsx     # フィルタチップ
    DarkModeToggle.tsx  # ダークモード切替
  data/
    yaku.ts             # 役データ本体
  types/
    yaku.ts             # 型定義
  hooks/
    useDarkMode.ts      # ダークモードフック
    useYakuFilter.ts    # フィルタフック
  App.tsx
  main.tsx
  index.css
```

## ライセンス

MIT

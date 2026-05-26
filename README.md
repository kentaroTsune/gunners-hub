# gunners-hub

## 概要
**gunners-hub**は、アーセナルFCの情報をまとめるためのプライベートWebサービスです。最新ニュース、選手情報、お気に入り機能などを提供し、アーセナルファンが効率よく情報収集・管理できるよう設計されています。

## 主要機能

- ニュースまとめ：アーセナル関連のニュース記事を自動取得・表示
- 記事のお気に入り登録：気になるニュースを保存可能
- 選手情報管理：選手のプロフィールとスタッツ閲覧・編集（管理者のみ編集可）
- ニュース検索／カテゴリフィルタリング
- ニュースタイトル自動翻訳（DeepL API利用）

## 技術スタック

- フロントエンド：React（TypeScript）、TanStack Query、React Router
- バックエンド：Cloud Firestore、Authentication、Firebase Hosting
- API 中継：Cloudflare Workers（football-data.org / DeepL）
- その他：ESLint, Prettier

## セットアップ

1. リポジトリをクローン
   ```sh
   git clone https://github.com/kentaroTsune/gunners-hub.git
   ```
2. 依存関係をインストール
   ```sh
   npm install
   ```
3. 環境変数を設定
   - ルートに `.env` を作成（`.env.example` を参考）
   - 必須：`VITE_API_BASE_URL`（Workers の URL）、Firebase 設定、News API 関連

4. Cloudflare Workers（ローカル開発）
   ```sh
   cp workers/gunners-api/.dev.vars.example workers/gunners-api/.dev.vars
   # .dev.vars に FOOTBALL_API_KEY / DEEPL_API_KEY を設定
   npm run worker:dev
   ```

5. フロントエンド起動（別ターミナル）
   ```sh
   npm run dev
   ```

## デプロイ

| 対象 | コマンド |
|------|----------|
| フロント（Hosting） | `npm run build` → `firebase deploy --only hosting` |
| API（Workers） | `npm run worker:deploy` |

Workers のシークレット更新:
```sh
cd workers/gunners-api
npx wrangler secret put FOOTBALL_API_KEY
npx wrangler secret put DEEPL_API_KEY
```

## 利用方法

- トップページで最新ニュースや選手一覧を閲覧
- ニュースを検索・カテゴリで絞り込み
- ログイン後、お気に入り記事の保存が可能
- 管理者ユーザーのみ、選手情報の編集が可能

## 作者
- [kentaroTsune](https://github.com/kentaroTsune)

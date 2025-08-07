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
- バックエンド：Cloud Firestore、Authentication、Firebase Functions（TypeScript）、DeepL API、football-data.org API、football News API
- 状態管理：React Context、Zustand
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
3. 必要な環境変数を設定（APIキー等）
   - `.env`ファイルに `DEEPL_API_KEY`, `FOOTBALL_API_KEY` などを設定

4. ローカルサーバー起動
   ```sh
   npm run dev
   ```

## 利用方法

- トップページで最新ニュースや選手一覧を閲覧
- ニュースを検索・カテゴリで絞り込み
- ログイン後、お気に入り記事の保存が可能
- 管理者ユーザーのみ、選手情報の編集が可能

## 作者
- [kentaroTsune](https://github.com/kentaroTsune)
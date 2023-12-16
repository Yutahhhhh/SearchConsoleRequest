# Google Indexing API をローカルで叩く

このプロジェクトでは、Google Indexing APIを使用して、特定のウェブページのインデックス登録状態に関するリクエストをGoogleに送信することができます。以下にセットアップから実行までの詳細な手順を示します。

## 環境

このプロジェクトは以下の環境での動作が確認されています。

- Node.js: 18.0.0

## セットアップ

1. 依存関係のインストール:
```bash
yarn
```

## 実行

プロジェクトの実行には以下のコマンドを使用します。

```bash
yarn indexing
```

## Google Cloud Platform (GCP) および Google Search Console の設定

1. **GCPの設定:**
   - Google Cloud Platform で Indexing API を有効にします。
   - サービスアカウントを作成し、キーをjson形式でダウンロードします。

2. **Search Consoleの設定:**
   - サービスアカウントの `client_email` をコピーしておきます。
   - Google Search Console の「設定 > ユーザーと権限」にて、コピーしたメールアドレスをオーナー権限で追加します。

3. **ファイル配置:**
   - ダウンロードした サービスアカウントのjson ファイルを `files/service-account.json` に配置します。
   - サイトマップのURLを `const SITEMAP_URL = 'https://example/sitemap.xml';` に設定します。
   - Google Search Console の「ページのインデックス登録 > インデックス登録済みページ数」からエクスポートした `.csv` ファイルを `files/excludes.csv` に配置します。

## 注意点

- Google Indexing APIを使用することで、特定のウェブページのインデックス登録状態に関するリクエストをGoogleに送信できます。
- 1日あたり200回までのリクエストしか利用できないので、リクエスト本数が多い場合、files/excludes.csvを使って、うまいこと分けましょう。
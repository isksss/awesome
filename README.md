# awesome

汎用的な技術資料、学習メモ、運用メモを集約する個人用リポジトリです。

特定のプロダクトや業務システムに依存しない内容を中心に、あとから読み返して使える資料として整理します。すべてのコンテンツは `docs/` 配下に置き、Nuxt サイト上で本文とスライドを動的に表示します。

## 資料一覧

### 基礎ツール

- [Git の使い方](docs/fundamentals/git.md)
  - リポジトリの考え方、日常操作、ブランチ、マージ、rebase、stash、履歴調査、取り消し、運用ルールを扱います。
- [Docker の使い方](docs/fundamentals/docker.md)
  - イメージ、コンテナ、Dockerfile、Compose、ボリューム、ネットワーク、ログ、デバッグ、セキュリティ、運用上の注意を扱います。
- [Linux コマンド](docs/fundamentals/linux-commands.md)
  - ファイル操作、検索、権限、プロセス、ネットワーク、ディスク、テキスト処理、シェル、トラブルシュートを扱います。
- [Vim / Neovim の使い方](docs/fundamentals/vim-nvim.md)
  - 基本操作、検索、置換、分割、設定、プラグイン、LSP までを 1 本で扱います。

### Web アプリケーション教材

`docs/` 配下には、Web アプリケーションを作るために必要な実務知識を Markdown 教材として置いています。

- Web
- Security
- Network
- DB

Git、Docker、Linux コマンドと同じく、個別教材として扱います。Markdown はビルド済み HTML に変換せず、そのまま公開して Nuxt 画面側でレンダリングします。

## このリポジトリに置くもの

- 汎用的に再利用できる技術資料
- コマンド、設定、調査手順のメモ
- 学習時に参照しやすい体系化されたノート
- 架空構成や安全なサンプルを使った運用知識
- 公開しても問題ない参考リンク、用語整理、チェックリスト

## このリポジトリに置かないもの

このリポジトリは公開を前提にします。以下は含めません。

- 実システム固有の構成、ログ、インシデント詳細
- 実在組織の内部情報
- 認証情報、秘密情報、実環境の設定値
- 悪用可能な攻撃再現手順
- 契約、顧客、個人情報に関わる内容

障害調査、ログ分析、チューニング、インシデント対応は、安全なサンプルログと架空構成で説明します。

## 書き方の方針

- 事実、既存規約、再現性を優先する
- コマンドは目的、使いどころ、注意点をセットで書く
- 危険な操作は、影響範囲と確認方法を明記する
- 初学者向けの説明と実務向けの判断基準を分ける
- バージョン依存がある場合は、対象バージョンや確認コマンドを書く
- 外部リンクは参考として扱い、本文だけでも要点が分かるようにする

## ディレクトリ構成

```text
.
├── README.md
├── docs/
│   ├── fundamentals/
│   ├── db/
│   ├── network/
│   ├── security/
│   └── web/
├── app/
├── scripts/
└── mise.toml
```

## 開発

```sh
mise install
pnpm install
pnpm build
```

Node と pnpm は mise で管理します。バージョンは `mise.toml` を参照します。

主なコマンド:

- `pnpm check:lessons`: frontmatter とスライド数を検証
- `pnpm check:links`: 内部リンクを検証
- `pnpm build:data`: Nuxt 用の教材データを生成
- `pnpm build:site`: Nuxt の静的サイトを生成
- `pnpm build`: 検証、Markdown 公開コピー、Nuxt 静的サイト生成を実行

## 更新方針

- Git、Docker、Linux コマンド資料は、普段の作業で見つけた不足を随時追記する
- Web アプリケーション教材は、半年ごとに主要出典、Spring、MySQL、PostgreSQL、Nginx、TLS/HTTP、バージョン依存箇所を見直す
- 外部リンクは通常 CI の必須条件にはせず、定期 CI で警告扱いにする

## ライセンス

このリポジトリの教材は [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) で公開します。

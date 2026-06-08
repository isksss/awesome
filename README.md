# awesome

Web アプリケーションを作るために必要な実務知識を、初学者から実務者まで読める形で整理する公開教材リポジトリです。

教材は Markdown を主ソースとし、Marp で HTML / PDF に変換します。正式な閲覧口は GitHub Pages、版管理された成果物配布は GitHub Releases を想定します。

## 対象読者

- Web アプリケーション開発を体系的に学びたい人
- Java / Spring、Security、Network、DB を実務レベルでつなげて理解したい人
- SQL、実行計画、ログ、障害切り分け、運用観点を広く押さえたい人

## 扱う範囲

4 章、20 教材で構成します。各教材は 40〜80 スライド程度です。

- Web
  - Spring MVC/API
  - Spring Validation
  - 例外処理/ログ
  - 設定管理
  - テスト
- Security
  - Spring Security
  - 認証認可設計
  - セッション/CSRF/CORS
  - 秘密情報管理
  - インシデント対応
- Network
  - DNS/TLS
  - Nginx
  - ロードバランス
  - HTTP/2/3
  - 障害切り分け
- DB
  - SQL 基礎
  - MySQL 実行計画
  - PostgreSQL 実行計画
  - JPA/MyBatis
  - トランザクション/ロック/チューニング

代表スタックは Linux + Nginx + Java/Spring + MySQL です。DB は MySQL と PostgreSQL を同じ深さで並列に扱います。

## 公開しない内容

このリポジトリは全世界公開を前提にします。以下は含めません。

- 実システム固有の構成、ログ、インシデント詳細
- 悪用可能な攻撃再現手順
- 実在組織の内部情報
- 認証情報、秘密情報、実環境の設定値

障害調査、ログ分析、チューニング、インシデント対応は、安全なサンプルログと架空構成で説明します。

## 教材ルール

各教材は以下を持ちます。

- YAML frontmatter
- 「まず読む」「実務で使う」「専門的に理解する」の段階構成
- 更新日
- 重要・危険・バージョン依存の記述に対する本文近くの出典
- 末尾の参考資料
- 図を追加する場合は Mermaid を使う

試験名、資格体系、試験範囲には触れません。

## 開発

```sh
corepack enable
pnpm install
pnpm build
```

PDF 生成には Chrome、Edge、Firefox のいずれかが必要です。CI では Chrome をセットアップしてから `pnpm build:pdf` を実行します。

主なコマンド:

- `pnpm generate:lessons`: 初期教材 Markdown を生成
- `pnpm check:lessons`: frontmatter とスライド数を検証
- `pnpm check:links`: 内部リンクを検証
- `pnpm build:site`: GitHub Pages 用の一覧ページを生成
- `pnpm build:slides`: Marp で HTML を生成
- `pnpm build:pdf`: Marp で PDF を生成
- `pnpm build`: 検証、Pages、HTML、PDF 生成を実行

## 更新方針

半年ごとに、主要出典、Spring、MySQL、PostgreSQL、Nginx、TLS/HTTP、バージョン依存箇所を見直します。

外部リンクは通常 CI の必須条件にはせず、定期 CI で警告扱いにします。

## ライセンス

このリポジトリの教材は [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) で公開します。

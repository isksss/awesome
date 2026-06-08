---
marp: true
theme: learning
size: "16:9"
title: "Docker の使い方"
chapter: "fundamentals"
order: 2
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/fundamentals/docker.md"
  - "https://docs.docker.com/"
---

<!-- _class: title -->

# Docker の使い方

アプリと実行環境をまとめて扱い、開発と検証を再現しやすくする。

- 本文資料: `docs/fundamentals/docker.md`
- image、container、volume、network を分けて見る
- 削除と公開ポートは慎重に扱う

---

## Docker で何が楽になるか

- ランタイムのバージョンを揃えやすい
- DB や Nginx をすぐ起動できる
- ローカル環境を汚しにくい
- CI と近い環境を作りやすい

ただし、データとポートは外につながる。そこは丁寧に確認する。

---

## image と container

```mermaid
flowchart LR
  File[Dockerfile] --> Image[イメージ]
  Image --> Run[起動]
  Run --> Container[コンテナ]
```

```text
Dockerfile -> image -> container
 設計図        雛形       実際に動くプロセス
```

- image: 実行環境を固めたもの
- container: image から起動した実体
- Dockerfile: image の作り方

まずこの 3 つを分けると Docker は見通しやすい。

---

## まず見るコマンド

```sh
docker version
docker info
docker ps
docker images
```

- Docker が動いているか
- どの container が起動中か
- どの image が手元にあるか

詰まったら、まず状態を見る。

---

## container を起動する

```sh
docker run --name web -p 8080:80 nginx:1.27
```

意味:

```text
host:8080 -> container:80
```

ブラウザで `http://localhost:8080` を開くと nginx に届く。

---

## よく使う run オプション

```sh
docker run --rm -d \
  --name app \
  -p 8080:8080 \
  -e APP_ENV=local \
  my-app:local
```

- `--rm`: 終了後に削除
- `-d`: バックグラウンド
- `-p`: ポート公開
- `-e`: 環境変数

---

## ログと中身を見る

```sh
docker logs -f web
docker exec -it web sh
docker inspect web
```

- logs: 標準出力と標準エラーを見る
- exec: 起動中 container の中でコマンドを実行
- inspect: 設定や mount、network を確認

---

## Dockerfile の基本

```Dockerfile
FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
```

- `RUN`: build 時
- `CMD`: 起動時
- 変更頻度が低いものを先に書くと cache が効きやすい

---

## .dockerignore

```dockerignore
.git
node_modules
dist
.env
*.log
```

不要なファイルを build context に入れない。

`.env` やログを image build に渡さないためにも大事。

---

## Compose でまとめる

```yaml
services:
  web:
    image: nginx:1.27
    ports:
      - "8080:80"
  db:
    image: postgres:17
```

複数の container をまとめて起動できる。

---

## Compose の日常操作

```sh
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

- 起動
- 状態確認
- ログ確認
- 停止と削除

`down -v` は volume も消すので慎重に使う。

---

## volume はデータ置き場

```sh
docker volume ls
docker volume inspect db-data
docker volume rm db-data
```

- DB データなどを container の外に残す
- container を消しても volume は残る
- volume を消すとデータが消える

---

## network は通信のまとまり

```sh
docker network ls
docker network inspect app-net
```

同じ user-defined network の container は、名前で通信できる。

```text
postgres://user:pass@db:5432/app
```

別 container の DB に `localhost` でつなごうとしない。

---

## よくあるトラブル

- port がすでに使われている
- volume の権限が合わない
- `.dockerignore` で必要ファイルを除外している
- `localhost` の意味を取り違えている
- secret を image に入れてしまう

まず `ps`、`logs`、`inspect` を見る。

---

## Dockerfile を読みやすくする

```Dockerfile
FROM node:24-bookworm-slim

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

CMD ["pnpm", "start"]
```

基本の順番:

- base image を選ぶ
- 作業ディレクトリを決める
- 依存関係を先に入れる
- アプリ本体をコピーする
- 起動コマンドを書く

依存関係の layer を分けると、ソース変更時の build が速くなりやすい。

---

## multi-stage build

```Dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/site /usr/share/nginx/html
```

build 用の依存を最終 image に入れない。

よい点:

- image が小さくなる
- 実行時に不要なツールを減らせる
- 攻撃面を小さくしやすい

---

## image tag の考え方

```sh
docker pull nginx:1.27-alpine
docker pull nginx:latest
```

`latest` は「最新版保証」ではなく、単なる tag 名。

実務ではこうする:

- 検証環境では固定 tag を使う
- 本番では digest 固定も検討する
- tag を変えたら動作確認する

digest 例:

```text
nginx@sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## build context を小さくする

```sh
docker build -t sample-app .
```

最後の `.` が build context。ここにあるファイルが Docker daemon に送られる。

`.dockerignore` 例:

```dockerignore
node_modules/
dist/
.git/
.env
tmp/
```

context が大きいと build が遅くなり、秘密情報を送る危険も増える。

---

## container の状態を見る

```sh
docker inspect web
docker inspect --format '{{.State.Status}}' web
docker inspect --format '{{json .NetworkSettings.Networks}}' web
```

`inspect` は JSON で詳細を見られる。

見る場面:

- どの network にいるか
- volume がどこに mount されているか
- 環境変数が入っているか
- healthcheck の状態

---

## healthcheck を付ける

```Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1
```

Compose 例:

```yaml
services:
  app:
    image: sample-app
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

「起動した」と「使える」は別。healthcheck で区別する。

---

## 環境変数の渡し方

```sh
docker run --env APP_ENV=local --env PORT=3000 sample-app
```

Compose:

```yaml
services:
  app:
    image: sample-app
    environment:
      APP_ENV: local
      PORT: "3000"
```

注意:

- secret を image に焼き込まない
- `.env` を commit しない
- ログに secret を出さない

---

## DB を Compose で動かす

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app-password
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

接続文字列:

```text
postgres://app:app-password@localhost:5432/app
```

別 container からつなぐ場合は host が `db` になる。

---

## Compose の依存関係

```yaml
services:
  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:17
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
```

`depends_on` は起動順を助けるが、アプリが DB 接続リトライを持つ方が強い。

アプリ側でも、起動直後の DB 未準備に備える。

---

## ログを見るコツ

```sh
docker compose logs app
docker compose logs -f --tail=100 app
docker logs --since=10m web
```

見るポイント:

- 起動直後のエラー
- 環境変数や設定ファイルの読み込み
- port の待受
- DB や外部APIへの接続

ログが多いときは service 名と時刻で絞る。

---

## exec で中に入る

```sh
docker exec -it web sh
docker compose exec app sh
```

中で見るもの:

```sh
pwd
ls -la
env | sort
ps aux
```

container 内で修正しても、基本的には再作成で消える。原因確認用と考える。

---

## resource を確認する

```sh
docker stats
docker system df
docker system prune
```

- `stats`: CPU、メモリ、ネットワーク
- `system df`: image、container、volume の使用量
- `prune`: 未使用リソースの掃除

`docker system prune -a --volumes` は影響が大きい。消す対象を確認してから使う。

---

## root で動かさない

```Dockerfile
RUN useradd -r -u 10001 appuser
USER appuser
```

container 内 root は、設定や mount 次第でリスクになる。

見るポイント:

- 書き込みが必要なディレクトリの権限
- 低い port を使っていないか
- volume mount 先の owner

---

## 本番に近づけるチェック

```text
固定tagを使っている
secretをimageに入れていない
healthcheckがある
ログが標準出力に出る
volume削除手順を理解している
不要なportを公開していない
```

Docker はローカルで便利なだけでなく、運用の前提も見える道具。

---

## トラブルシュート例

```text
症状: localhost:8080 にアクセスできない
```

見る順番:

```sh
docker compose ps
docker compose logs -f app
docker port app
curl -v http://localhost:8080
```

よくある原因:

- container が落ちている
- container 内のアプリが別 port で待っている
- host 側の port が衝突している
- firewall や proxy が邪魔している

---

## まとめ

- image と container を分けて考える
- logs と exec で中を見る
- Compose は複数 container の操作に便利
- volume 削除と port 公開は慎重に確認する
- 本番では secret、tag、healthcheck、ログを必ず見る

Docker は状態を見ながら使うと怖くない。

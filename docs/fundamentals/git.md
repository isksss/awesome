---
marp: true
theme: learning
size: "16:9"
title: "Git の使い方"
chapter: "fundamentals"
order: 1
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/fundamentals/git.md"
  - "https://git-scm.com/docs"
---

<!-- _class: title -->

# Git の使い方

変更履歴を安全に残し、あとから理由を追えるようにする。

- 本文資料: `docs/fundamentals/git.md`
- まずは状態確認、差分確認、commit の流れを覚える
- 危険な操作は確認してから使う

---

## Git は何を助けるか

- 変更前と変更後を比べられる
- 作業を commit として記録できる
- branch で作業を分けられる
- 間違えたときに戻す手がかりが残る

Git は「ファイルのタイムマシン」というより、変更の理由をチームで共有する道具。

---

## 4 つの場所

```mermaid
flowchart LR
  Work[作業] --> Stage[ステージ]
  Stage --> Commit[コミット]
  Commit --> Push[共有]
```

```text
working tree -> staging area -> local repo -> remote repo
  作業中          commit候補       手元の履歴      GitHubなど
```

- working tree: いま編集している場所
- staging area: 次の commit に入れる箱
- local repo: 手元に保存された履歴
- remote repo: 共有先

---

## 毎回まず見る

```sh
git status
git branch --show-current
git log --oneline -5
```

- いまの branch は正しいか
- 変更中のファイルは何か
- 直近の commit は想定どおりか

迷ったら、まず `git status`。

---

## 差分を見る

```sh
git diff
git diff --staged
git diff --name-only
```

- `git diff`: まだ stage していない変更
- `git diff --staged`: commit 予定の変更
- `--name-only`: ファイル名だけ確認

commit 前に差分を読むだけで、事故はかなり減る。

---

## add と commit

```sh
git add docs/fundamentals/git.md
git commit -m "docs: Git資料を更新"
```

- commit は意味のある単位にする
- 無関係な変更を混ぜない
- メッセージはあとで読んでも分かるようにする

大きな変更は `git add -p` で分けるとレビューしやすい。

---

## branch で作業を分ける

```sh
git switch main
git switch -c docs/git-guide
```

- main はなるべく安定させる
- 新しい作業は branch で始める
- 作業名が分かる branch 名にする

例: `docs/git-guide`, `fix/login-error`, `feat/user-profile`

---

## push と pull

```sh
git push -u origin docs/git-guide
git fetch --prune
git pull --ff-only
```

- `push`: 手元の commit を共有する
- `fetch`: remote の情報だけ取得する
- `pull`: 取得して取り込む

不安なときは `fetch` と `status` を先に見る。

---

## merge と rebase

```sh
git merge main
git rebase origin/main
```

- merge: 合流した履歴を残す
- rebase: 自分の commit を新しい土台に載せ替える

共有済み branch で rebase すると周りを困らせやすい。自分だけの作業 branch で使う。

---

## conflict の直し方

```text
<<<<<<< HEAD
自分側の内容
=======
取り込む側の内容
>>>>>>> main
```

1. 正しい内容に編集する
2. conflict 記号を消す
3. `git add` する
4. merge なら commit、rebase なら continue

---

## stash は一時退避

```sh
git stash push -u -m "wip: docs update"
git stash list
git stash pop
```

- 途中の変更を一時的に避けられる
- 未追跡ファイルも含めるなら `-u`
- 長期保管には向かない

stash は「机の上を一瞬片付ける箱」くらいに考える。

---

## 取り消しは目的で選ぶ

```sh
git restore README.md
git restore --staged README.md
git commit --amend
git revert <commit>
```

- working tree を戻す: `restore`
- stage を外す: `restore --staged`
- 直前 commit を直す: `amend`
- 公開済み commit を打ち消す: `revert`

---

## 危険な操作

```sh
git reset --hard
git clean -fd
git push --force
```

実行前に見る:

```sh
git status
git log --oneline --graph -10
git branch --show-current
```

force push が必要なら `--force-with-lease` を優先する。

---

## 困ったときの reflog

```sh
git reflog
git reset --hard HEAD@{1}
```

- HEAD の移動履歴を見られる
- 間違って reset したときの手がかりになる
- 手元だけの履歴なので remote にはない

慌てて何度も操作せず、まず reflog を見る。

---

## 作業開始の型

```sh
git switch main
git pull --ff-only
git switch -c feature/add-profile-page
git status
```

作業を始める前に、最新の `main` から新しい branch を作る。

- `--ff-only` は余計な merge commit を作らない
- branch 名は目的が分かる短い名前にする
- 作業前の `git status` で未整理の変更を見つける

例: `feature/add-login-form`、`fix/docker-healthcheck`、`docs/git-guide`

---

## commit メッセージの型

```text
[fix] ログイン失敗時のエラー表示を修正
[docs] Git資料にrebase例を追加
[update] Docker Composeの例を追加
```

よい commit メッセージは、あとで履歴を読んだ人が理由を追える。

- 何をしたかを短く書く
- 変更理由が大事なら本文に書く
- 「修正」「作業中」だけで終わらせない

本文例:

```text
[fix] APIエラー時の再試行条件を修正

500系だけ再試行し、400系は入力エラーとして扱う。
不要な再送で同じ登録処理が重複しないようにする。
```

---

## stage を分ける

```sh
git add app/login.ts
git commit -m "[fix] ログインAPIのエラー処理を修正"

git add docs/fundamentals/git.md
git commit -m "[docs] Git資料にstage例を追加"
```

関係ない変更を 1 つの commit に混ぜると、あとで戻しにくい。

- 機能修正と資料更新を分ける
- 大きな変更はファイル単位で stage する
- 迷ったら `git diff --cached` を見る

一部だけ stage したいとき:

```sh
git add -p
```

`y` で入れる、`n` で入れない、`s` でさらに分割する。

---

## ファイル単位で履歴を見る

```sh
git log --oneline -- docs/fundamentals/git.md
git log -p -- docs/fundamentals/git.md
git show HEAD -- docs/fundamentals/git.md
```

「このファイルはいつ変わった？」を調べるときに使う。

- `--oneline`: ざっくり履歴
- `-p`: 差分も見る
- `git show`: 特定 commit の内容を見る

例: README の方針が変わった時期を探す。

```sh
git log --oneline -- README.md
```

---

## 変更した人と行を見る

```sh
git blame README.md
git blame -L 20,60 README.md
```

`blame` は犯人探しではなく、背景をたどるための道具。

- どの commit でその行が入ったかを見る
- commit を開いて前後の変更も確認する
- 人を責めず、判断材料として使う

次に見るとよいもの:

```sh
git show <commit>
git log --oneline --author="name"
```

---

## remote を確認する

```sh
git remote -v
git branch -vv
git fetch --prune
```

- `remote -v`: push/pull 先を見る
- `branch -vv`: tracking branch を見る
- `fetch --prune`: 消えた remote branch を手元から掃除する

fork や複数 remote があるときは、push 先を必ず確認する。

```sh
git push origin feature/add-profile-page
```

---

## pull request 前の確認

```sh
git status
git diff main...HEAD --name-only
git log --oneline main..HEAD
pnpm build
```

PR を出す前に見るもの:

- 余計なファイルが混ざっていないか
- commit が多すぎたり曖昧すぎたりしないか
- ローカル検証が通っているか
- 説明に書くべき注意点があるか

PR説明の例:

```text
## 変更内容
- 教材を docs/fundamentals に整理
- Nuxt画面でMarkdownを表示

## 確認
- pnpm build
- Pages上でGit資料を表示
```

---

## merge commit を作る場面

```sh
git switch main
git merge --no-ff feature/add-profile-page
```

merge commit は「この作業のまとまりが入った」と明示できる。

向いている場面:

- 複数 commit の作業単位を残したい
- 長めの feature branch を統合する
- チームが merge commit を運用ルールにしている

履歴を一直線にしたいチームでは rebase や squash を使う。

---

## rebase の安全な使い方

```sh
git switch feature/add-profile-page
git fetch origin
git rebase origin/main
```

rebase は「自分の commit を最新の main の上に置き直す」操作。

安全に使う条件:

- 自分だけが使っている branch
- push 前、または force push の合意がある
- conflict を落ち着いて直せる

公開済み共有 branch では、むやみに rebase しない。

---

## squash で履歴をまとめる

```sh
git rebase -i HEAD~3
```

例:

```text
pick 1111111 ログイン画面を追加
squash 2222222 typo修正
squash 3333333 不要ログを削除
```

細かい試行錯誤を、読みやすい 1 commit にまとめられる。

注意:

- push 済み commit を書き換えるなら合意する
- まとめすぎると差分が大きくなりすぎる
- レビュー済み履歴を書き換えると追いにくくなる

---

## revert の実務例

```sh
git log --oneline
git revert 1234abc
git push origin main
```

公開済みの変更を取り消すなら `reset` より `revert` が安全。

例: 本番で不具合が出た commit を打ち消す。

```text
1234abc [update] 新しい検索条件を追加
```

この commit を消すのではなく、逆向きの commit を追加する。

```text
5678def Revert "[update] 新しい検索条件を追加"
```

履歴が残るので、何を戻したか分かりやすい。

---

## tag を付ける

```sh
git tag v1.0.0
git tag -a v1.0.0 -m "release v1.0.0"
git push origin v1.0.0
```

tag は「この commit が区切り」という印。

使いどころ:

- リリースした commit
- 教材の区切り
- 検証済みの安定版

一覧と削除:

```sh
git tag --list
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

remote tag の削除は影響が大きいので、先に相談する。

---

## ignore の基本

```gitignore
node_modules/
dist/
.env
.DS_Store
```

`.gitignore` は「履歴に入れないファイル」を決める。

入れないもの:

- 依存パッケージ
- ビルド成果物
- 秘密情報
- OSやエディタの一時ファイル

すでに追跡済みのファイルは、`.gitignore` に書いただけでは外れない。

```sh
git rm --cached .env
```

---

## 秘密情報を入れてしまったら

```sh
git status
git log --oneline -- .env
```

まずやること:

- その secret を無効化、ローテーションする
- どの commit に入ったか確認する
- 必要なら履歴削除をチームで決める

単に commit を消しても、push 済みなら remote や他人の clone に残る可能性がある。

安全なサンプル:

```env
API_TOKEN=replace-me
DATABASE_URL=postgres://user:pass@localhost:5432/app
```

---

## よく使う alias

```sh
git config --global alias.st status
git config --global alias.co switch
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate --all"
```

alias は便利だが、手順書では正式コマンドを書くと伝わりやすい。

確認:

```sh
git config --global --get-regexp '^alias\.'
```

---

## トラブル別の最初の一手

```text
変更が消えた気がする -> git reflog
push できない -> git status / git branch -vv
pull で conflict -> git status
差分が多すぎる -> git diff --name-only
間違えて stage した -> git restore --staged <file>
```

Git で困ったときは、だいたい `status`、`log`、`reflog` のどれかが入口になる。

---

## まとめ

- 最初に `git status`
- commit 前に `git diff --staged`
- branch で作業を分ける
- 公開済み履歴は `revert` を優先する
- 危険な操作はログと状態を確認してから実行する

Git は確認する順番を決めると、かなり安心して使える。

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

## まとめ

- 最初に `git status`
- commit 前に `git diff --staged`
- branch で作業を分ける
- 公開済み履歴は `revert` を優先する
- 危険な操作はログと状態を確認してから実行する

Git は確認する順番を決めると、かなり安心して使える。

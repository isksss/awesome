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
- 対象: ローカル開発 + GitHub
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Work[作業] --> Stage[ステージ]
  Stage --> Commit[コミット]
  Commit --> Share[共有]
  Share --> Review[レビュー]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: Git の使い方の相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## まず覚える考え方

- Git はファイルそのものではなく、変更のまとまりを記録する道具。
- 作業ツリー、ステージ、ローカル履歴、リモートを分けて見ると迷いにくい。
- `git status` は現在地を教えてくれる入口。

> 実務例: まず覚える考え方では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
working tree -> staging area -> local repo -> remote repo
  作業中          commit候補       手元の履歴      GitHubなど
```

---

## 作業開始の型

- main を最新にしてから branch を作る。
- 作業前に未整理の変更がないか確認する。

> 実務例: 作業開始の型では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git switch main
git pull --ff-only
git switch -c feature/add-profile-page
git status
```

---

## 差分を読む

- commit 前に差分を見る習慣を作る。
- ファイル名だけ見たいときと、中身まで見たいときを分ける。

> 実務例: 差分を読むでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git diff
git diff --staged
git diff --name-only
```

---

## stage を小さくする

- 関係ない変更を混ぜると戻しにくい。
- 機能修正、資料更新、設定変更はできるだけ分ける。

> 実務例: stage を小さくするでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git add app/login.ts
git commit -m "[fix] ログインAPIのエラー処理を修正"
git add docs/fundamentals/git.md
git commit -m "[docs] Git資料にstage例を追加"
```

---

## commit メッセージ

- 何をしたかが一目で分かるように書く。
- 理由が重要なら本文に残す。

> 実務例: commit メッセージでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
[fix] APIエラー時の再試行条件を修正

500系だけ再試行し、400系は入力エラーとして扱う。
不要な再送で同じ登録処理が重複しないようにする。
```

---

## branch と共有

- 作業単位ごとに branch を分ける。
- push 先の remote と branch を確認してから共有する。

> 実務例: branch と共有では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git branch --show-current
git branch -vv
git remote -v
git push origin feature/add-profile-page
```

---

## merge と rebase

- merge は合流の履歴を残す。
- rebase は自分の commit を最新の main の上に置き直す。
- 共有済み branch の rebase はチームで合意してから使う。

> 実務例: merge と rebaseでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git fetch origin
git rebase origin/main
git merge --no-ff feature/add-profile-page
```

---

## conflict の直し方

- まず `git status` で対象を見る。
- 両方の変更意図を確認してから編集する。

> 実務例: conflict の直し方では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git status
git diff
git add conflicted-file.ts
git rebase --continue
```

---

## 取り消しを目的で選ぶ

- 作業ツリーを戻す、stage を外す、公開済みを打ち消す、は別操作。
- 公開済み履歴は `revert` を優先する。

> 実務例: 取り消しを目的で選ぶでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git restore README.md
git restore --staged README.md
git commit --amend
git revert <commit>
```

---

## 履歴を調べる

- ファイル単位、行単位、commit 単位で履歴を追う。
- `blame` は人を責める道具ではなく背景を探す道具。

> 実務例: 履歴を調べるでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git log --oneline -- README.md
git log -p -- README.md
git blame -L 20,60 README.md
git show <commit>
```

---

## reflog で復旧する

- HEAD の移動履歴を見る。
- reset や rebase で迷ったら、慌てて追加操作せず reflog を見る。

> 実務例: reflog で復旧するでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git reflog
git reset --hard HEAD@{1}
```

---

## ignore と秘密情報

- .gitignore は履歴に入れないファイルを決める。
- secret を入れたら、履歴修正より先に secret を無効化する。

> 実務例: ignore と秘密情報では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
node_modules/
dist/
.env
.DS_Store
```

---

## PR 前チェック

- 余計な差分、commit の粒度、検証結果を確認する。
- 説明には変更内容と確認結果を書く。

> 実務例: PR 前チェックでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
git status
git diff main...HEAD --name-only
git log --oneline main..HEAD
pnpm build
```

---

## 練習

- 小さなファイルを作り、add、commit、restore、revert を試す。
- 操作ごとに `git status` を見て、状態の変化を言葉にする。

> 実務例: 練習では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

---

## 実務で使う場面

- 機能追加、バグ修正、資料更新を小さな履歴として残す場面で使う。
- レビュー前の差分確認、conflict対応、公開済み変更の取り消しまで扱う。

- この教材では **Git の使い方** を ローカル開発 + GitHub の文脈で扱う。

---

## 判断の順番

- まず `git status` で状態を見る。
- stageする変更を小さく選ぶ。
- 公開済み履歴は `revert` で打ち消す。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
git status
git diff
git add README.md
git commit -m "[docs] READMEを更新"
```

---

## よくある失敗

- 関係ない差分を同じcommitに混ぜる
- 共有済みbranchを合意なくrebaseする
- secretをcommitしてから履歴修正だけで済ませる

---

## チェックリスト

- 差分とstage済み差分を両方見る
- branch名とpush先を確認する
- PR前にbuildやテスト結果を残す

---

## ミニ演習

- 1ファイルだけ変更してcommitする
- `git restore` と `git restore --staged` を使い分ける
- 小さなconflictを作って解消する

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

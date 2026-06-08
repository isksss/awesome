---
marp: true
theme: learning
size: "16:9"
title: "Linux コマンド"
chapter: "fundamentals"
order: 3
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/fundamentals/linux-commands.md"
  - "https://man7.org/linux/man-pages/"
---

<!-- _class: title -->

# Linux コマンド

開発、調査、運用で必要な「見る・探す・直す」を安全に進める。

- 本文資料: `docs/fundamentals/linux-commands.md`
- 対象: Linux shell + logs + network tools
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Where[場所確認] --> Read[読む]
  Read --> Search[探す]
  Search --> Decide[判断]
  Decide --> Change[直す]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: Linux コマンドの相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 最初に見る

- どこで、誰として、どの環境を触っているかを見る。
- 本番や共有環境ではこの確認が事故を減らす。

> 実務例: 最初に見るでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
pwd
whoami
hostname
date
uname -a
```

---

## help を読む

- 知らない option は手元で確認する。
- 手順書では alias より正式コマンドを書く。

> 実務例: help を読むでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
man ls
ls --help
type ls
command -v ls
```

---

## ファイルを見る

- まず変更しないで見る。
- ログは less と tail を使えるだけでかなり読みやすい。

> 実務例: ファイルを見るでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
ls -la
less app.log
head -n 20 app.log
tail -n 100 app.log
tail -f app.log
```

---

## 探す

- ファイル名で探すときは find。
- 文字列で探すときは grep または rg。

> 実務例: 探すでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
find . -name "*.log"
find . -type f -size +100M
grep -R --line-number "ERROR" .
rg "DATABASE_URL" .
```

---

## パイプでつなぐ

- 読む、絞る、整形する、数える、並べる。
- 一度に完璧に書かず、少しずつつなぐ。

> 実務例: パイプでつなぐでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
grep " 500 " access.log | awk '{print $1}' | sort | uniq -c | sort -nr
```

---

## sed と awk

- sed は置換や行の抽出。
- awk は列の処理や集計。

> 実務例: sed と awkでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
sed -n '10,20p' file.txt
sed 's/old/new/g' file.txt
awk '$9 >= 500 {print $0}' access.log
awk '{count[$9]++} END {for (code in count) print code, count[code]}' access.log
```

---

## コピーと削除

- 削除前に対象を表示する。
- recursive な操作は現在地と対象パスを確認する。

> 実務例: コピーと削除では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
cp source.txt backup.txt
mv old.txt new.txt
rm old.txt
find . -name "*.tmp" -print
```

---

## 権限

- ユーザー、グループ、mode を分けて見る。
- ファイルだけでなく途中ディレクトリの権限も見る。

> 実務例: 権限では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
id
ls -l app.log
ls -ld /var/log
namei -l /var/log/app/app.log
chmod 640 app.log
```

---

## プロセス

- CPU、メモリ、PID、待受 port を見る。
- `kill -9` は最後の手段。

> 実務例: プロセスでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
ps aux --sort=-%mem | head
ps aux --sort=-%cpu | head
pgrep -af nginx
lsof -p <pid>
```

---

## systemd とログ

- service の状態と journal を見る。
- 時刻で絞ると調査が速い。

> 実務例: systemd とログでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
systemctl status nginx
journalctl -u nginx --since "10 minutes ago"
journalctl -u nginx -f
journalctl -p err..alert
```

---

## ディスク

- 容量不足と inode 不足は別。
- 大きいものを調べてから消す。

> 実務例: ディスクでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
df -h
df -i
du -sh /var/log/* | sort -h
find /var/log -type f -size +100M -print
lsof | grep deleted
```

---

## ネットワーク

- IP、経路、名前解決、HTTP、待受 port の順に見る。

> 実務例: ネットワークでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
ip addr
ip route
getent hosts example.com
curl -vk https://example.com
ss -ltnp
```

---

## rsync と archive

- 同期や圧縮は事前確認が大事。
- `--delete` は転送先を消す可能性がある。

> 実務例: rsync と archiveでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```sh
rsync -av --dry-run src/ dest/
rsync -av src/ dest/
tar -czf logs.tar.gz logs/
tar -tzf logs.tar.gz | head
```

---

## 安全な script

- 未定義変数や失敗を見逃さない。
- 引数を検証し、対象を表示する。

> 実務例: 安全な scriptでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```bash
#!/usr/bin/env bash
set -euo pipefail
target="${1:-}"
if [[ -z "$target" ]]; then
  echo "usage: $0 <target>" >&2
  exit 1
fi
echo "target=$target"
```

---

## 調査メモ

- 時刻、対象、実行ユーザー、症状、見たコマンド、判断を残す。
- コマンドだけでなく、結果から何を考えたかを書く。

> 実務例: 調査メモでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
時刻:
対象ホスト:
実行ユーザー:
症状:
見たコマンド:
分かったこと:
次に見ること:
```

---

## 実務で使う場面

- ログ調査、容量不足、プロセス確認、ネットワーク切り分けを行う場面で使う。
- 本番や共有環境では、変更より先に観察する習慣が事故を減らす。

- この教材では **Linux コマンド** を Linux shell + logs + network tools の文脈で扱う。

---

## 判断の順番

- 現在地、ユーザー、対象ホストを確認する。
- 読む、探す、絞る、判断するの順に進める。
- 削除や変更の前に対象を表示する。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
pwd && whoami && hostname
tail -n 100 app.log
rg "ERROR" logs/
df -h
```

---

## よくある失敗

- 本番ホストであることに気づかず操作する
- 巨大ログを無条件に開く
- 対象確認なしにrecursive削除する

---

## チェックリスト

- `pwd` `whoami` `hostname` を見る
- ログは時刻と条件で絞る
- 削除前に `find ... -print` で対象を見る

---

## ミニ演習

- access logをstatus code別に集計する
- 大きいファイルを探して容量を見積もる
- systemd serviceのログを時刻で絞る

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

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
- まずは見るコマンドに慣れる
- 削除、権限変更、root 操作は慎重に扱う

---

## 最初に見るもの

```sh
pwd
whoami
hostname
date
uname -a
```

- どこで作業しているか
- 誰として実行しているか
- どの環境を見ているか

本番や共有環境では、この確認だけで事故を減らせる。

---

## 調査の流れ

```mermaid
flowchart LR
  Where[場所確認] --> Read[読む]
  Read --> Search[探す]
  Search --> Change[直す]
```

いきなり変更せず、まず現在地と状態を見る。これだけで作業はかなり落ち着く。

---

## help を読む

```sh
man ls
ls --help
type ls
command -v ls
```

- `man`: 詳しい説明
- `--help`: すぐ見られる使い方
- `type`: alias や builtin も分かる

手順書では alias より正式コマンドを書く。

---

## ファイルを見る

```sh
ls -la
cat file.txt
less file.txt
head -n 20 file.txt
tail -n 100 app.log
```

まずは「変更しないで見る」操作に慣れる。

ログは `less` と `tail` を使えるだけでかなり読みやすくなる。

---

## ファイルを探す

```sh
find . -type f -name "*.log"
find . -type f -mtime -1
find . -type f -size +100M
```

- 名前で探す
- 更新日時で探す
- サイズで探す

削除と組み合わせる前に、必ず表示だけで確認する。

---

## 文字列を探す

```sh
grep -n "ERROR" app.log
grep -n -C 3 "request-id-123" app.log
rg "TODO"
```

- `-n`: 行番号
- `-C`: 前後の行
- `rg`: 使える環境なら高速で便利

ログ調査では、時刻、request id、エラー分類で絞る。

---

## コピー、移動、削除

```sh
cp source.txt dest.txt
mv old.txt new.txt
rm file.txt
rm -ri dir
```

削除は戻せないことが多い。

`rm -rf` の前には、`pwd`、`ls -la`、対象パスを確認する。

---

## 権限を見る

```sh
ls -l
id
namei -l /path/to/file
```

- ファイルの権限
- 自分の uid/gid
- パス途中のディレクトリ権限

ファイル自体が正しくても、途中のディレクトリで止まることがある。

---

## 権限を変える

```sh
chmod 644 memo.txt
chmod +x script.sh
chown user:group file.txt
```

- `chmod`: 権限を変える
- `chown`: 所有者を変える
- `-R`: 再帰変更。影響範囲が広い

`chmod -R` と `chown -R` は対象を必ず確認する。

---

## プロセスを見る

```sh
ps aux
pgrep -af nginx
top
kill -TERM <pid>
```

- 何が動いているか
- どの pid か
- CPU やメモリを使っているか
- 終了依頼を出せるか

まず `TERM`。いきなり `KILL` にしない。

---

## systemd とログ

```sh
systemctl status nginx
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
```

- サービス状態
- 直近ログ
- 時刻指定の調査

障害調査では、時刻とサービス名をそろえて見る。

---

## ディスクを見る

```sh
df -h
df -i
du -sh * | sort -h
find . -type f -size +100M
```

- 容量不足
- inode 不足
- 大きいディレクトリ
- 大きいファイル

いきなり消さず、まず何が大きいかを調べる。

---

## ネットワークを見る

```sh
ip addr
ip route
getent hosts example.com
curl -v https://example.com
ss -ltnp
```

- IP アドレス
- 経路
- 名前解決
- HTTP/TLS
- 待受ポート

上から順に見ると、原因を絞りやすい。

---

## shell script の基本

```bash
#!/usr/bin/env bash
set -euo pipefail

target="${1:-}"
if [ -z "$target" ]; then
  echo "usage: $0 <target>" >&2
  exit 1
fi
```

小さな確認処理から script にすると、作業が再現しやすくなる。

---

## 危険な操作

```sh
rm -rf
chmod -R
chown -R
dd
mkfs
rsync --delete
sudo
```

実行前に `pwd`、`whoami`、`echo "$TARGET"`、`ls -la "$TARGET"` を見る。

---

## パイプでつなぐ

```sh
cat access.log | grep " 500 " | head
grep " 500 " access.log | awk '{print $1}' | sort | uniq -c | sort -nr
```

パイプ `|` は、左の結果を右に渡す。

よくある流れ:

```text
読む -> 絞る -> 整形する -> 数える -> 並べる
```

`cat file | grep` は分かりやすいが、慣れたら `grep pattern file` でよい。

---

## grep の実務例

```sh
grep -R "DATABASE_URL" .
grep -R --line-number --exclude-dir=node_modules "TODO" .
grep -E "ERROR|WARN" app.log
```

見るポイント:

- `-R`: 再帰的に探す
- `--line-number`: 行番号を出す
- `--exclude-dir`: 探さないディレクトリ
- `-E`: 正規表現を使う

ログ調査では、まず時刻や request id で絞る。

---

## sed で置換する

```sh
sed 's/old/new/' file.txt
sed 's/old/new/g' file.txt
sed -n '10,20p' file.txt
```

ファイルを書き換える前に、標準出力で結果を見る。

macOS と GNU sed では `-i` の扱いが違う。

```sh
sed -i.bak 's/old/new/g' file.txt
```

バックアップを作ると戻しやすい。

---

## awk で列を扱う

```sh
awk '{print $1, $2}' access.log
awk '$9 >= 500 {print $0}' access.log
awk '{count[$1]++} END {for (ip in count) print count[ip], ip}' access.log
```

awk は「列を取り出す」「条件で絞る」「集計する」が得意。

例: status code の数を数える。

```sh
awk '{count[$9]++} END {for (code in count) print code, count[code]}' access.log
```

---

## xargs でまとめて実行

```sh
find . -name "*.log" -print0 | xargs -0 wc -l
find . -name "*.tmp" -print0 | xargs -0 rm
```

空白を含むファイル名に備えて、`-print0` と `-0` をセットで使う。

削除前は `rm` の代わりに `echo` で確認する。

```sh
find . -name "*.tmp" -print0 | xargs -0 echo rm
```

---

## tar と zip

```sh
tar -czf logs.tar.gz logs/
tar -tzf logs.tar.gz | head
tar -xzf logs.tar.gz
zip -r logs.zip logs/
unzip -l logs.zip
```

- `tar -c`: 作る
- `tar -t`: 中身を見る
- `tar -x`: 展開する
- `z`: gzip

展開前に中身を見ると、想定外の場所に展開する事故を減らせる。

---

## rsync で同期する

```sh
rsync -av --dry-run src/ dest/
rsync -av src/ dest/
rsync -av --delete src/ dest/
```

`--dry-run` で先に確認する。

注意:

- `src/` と `src` は意味が違う
- `--delete` は転送先の余計なファイルを消す
- 本番では対象パスを必ず確認する

---

## journalctl の見方

```sh
journalctl -u nginx
journalctl -u nginx --since "10 minutes ago"
journalctl -u nginx -f
journalctl -p err..alert
```

- service 単位で見る
- 時刻で絞る
- follow する
- severity で絞る

障害調査では、発生時刻を先に決めるとログが読みやすい。

---

## プロセスを深く見る

```sh
ps aux --sort=-%mem | head
ps aux --sort=-%cpu | head
pgrep -af nginx
lsof -p <pid>
```

見るもの:

- CPU を使っているプロセス
- メモリを使っているプロセス
- 開いているファイル
- 待受 port

`kill -9` は最後の手段。まず通常の停止方法を探す。

---

## port と接続を見る

```sh
ss -ltnp
ss -tunap
curl -I http://localhost:8080
curl -vk https://example.com
```

- `LISTEN`: 待受
- `ESTABLISHED`: 接続中
- `-p`: プロセス情報
- `curl -v`: 通信の詳細

「アプリが起動している」と「port が開いている」は別なので、両方見る。

---

## DNS を確認する

```sh
getent hosts example.com
dig example.com
dig +short example.com
cat /etc/resolv.conf
```

DNS が怪しいときの順番:

- 名前が引けるか
- どの IP に解決されるか
- resolver 設定は何か
- TTL や CNAME はどうなっているか

コンテナ内とホストでは DNS 設定が違うことがある。

---

## 権限トラブルの例

```text
症状: app.log に書き込めない
```

見る順番:

```sh
whoami
id
ls -ld .
ls -l app.log
namei -l app.log
```

ファイルだけでなく、途中のディレクトリに実行権限があるかも見る。

---

## 容量不足の例

```sh
df -h
du -sh /var/log/* | sort -h
find /var/log -type f -size +100M -print
```

対応の考え方:

- 何が大きいか調べる
- 消してよいものか確認する
- service が掴んでいる deleted file も見る

```sh
lsof | grep deleted
```

ログを消す前に、ローテーション設定も確認する。

---

## 安全なシェルスクリプト

```bash
#!/usr/bin/env bash
set -euo pipefail

readonly target="${1:-}"
if [[ -z "$target" ]]; then
  echo "usage: $0 <target>" >&2
  exit 1
fi

echo "target=$target"
```

ポイント:

- 未定義変数で落とす
- 失敗したコマンドで止める
- 引数を先に検証する
- 実行対象を表示する

---

## コマンド履歴を活用する

```sh
history
history | grep docker
Ctrl-r
```

履歴は便利だが、危険なコマンドをそのまま再実行しない。

確認:

```sh
pwd
whoami
echo "$TARGET"
```

---

## トラブル時のメモの型

```text
時刻:
対象ホスト:
実行ユーザー:
症状:
見たコマンド:
分かったこと:
次に見ること:
```

調査ログを残すと、あとから説明しやすい。

コマンドだけでなく、結果から何を判断したかも書く。

---

## まとめ

- 最初は「見る」コマンドを覚える
- 削除や権限変更は確認を増やす
- ログ調査は時刻と request id をそろえる
- 容量、プロセス、ネットワークは順番に見る
- 危険な操作は急がない

Linux コマンドは、安全に見る力が付くほど強く使える。

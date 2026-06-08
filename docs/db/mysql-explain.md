---
marp: true
theme: learning
size: "16:9"
title: "MySQL 実行計画"
chapter: "db"
order: 2
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/db/mysql-explain.md"
  - "https://dev.mysql.com/doc/refman/8.4/en/explain.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html"
---

<!-- _class: title -->

# MySQL 実行計画

EXPLAIN、インデックス、統計、結合順、遅い SQL の見方を扱う。

- 本文資料: `docs/db/mysql-explain.md`
- 対象: MySQL 8 + EXPLAIN
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  SQL[SQL] --> Optimizer[Optimizer]
  Optimizer --> Plan[Execution Plan]
  Plan --> Index[Index]
  Index --> Rows[Rows]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: MySQL 実行計画の相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## EXPLAIN

- SQL をどう実行するつもりか見る。

> 実務例: EXPLAINでは、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
```

---

## 見る列

- type、key、rows、Extra をまず見る。

> 実務例: 見る列では、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
type
key
rows
Using filesort
```

---

## index

- 選択性が高い条件や結合条件に効く。

> 実務例: indexでは、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## 改善

- SQL、index、統計、取得件数を見直す。

> 実務例: 改善では、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
ANALYZE TABLE orders;
```

---

## 実務で使う場面

- データ取得、更新、性能、ロックを、SQLと実行計画から判断する場面で使う。
- 正しさ、件数、速度、同時実行の4つを分けて見ると改善しやすい。

- この教材では **MySQL 実行計画** を MySQL 8 + EXPLAIN の文脈で扱う。

---

## 判断の順番

- まず取得したい行と列を明確にする。
- 次にEXPLAINで読み方と行数を確認する。
- 最後にindex、SQL、transaction境界のどれを変えるか決める。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## よくある失敗

- SELECT *で不要な列まで取る
- N+1をログで確認しない
- 長いtransactionでロック待ちを増やす

---

## チェックリスト

- EXPLAINで推定行数と利用indexを見る
- 実際の件数と処理時間を測る
- transactionを短くし、ロック順をそろえる

---

## ミニ演習

- 小さなテーブルでJOINとGROUP BYを書く
- index追加前後のEXPLAINを比べる
- 同じ順番で更新する処理に直す

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

---
marp: true
theme: learning
size: "16:9"
title: "JPA/MyBatis"
chapter: "db"
order: 4
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/db/jpa-mybatis.md"
  - "https://docs.spring.io/spring-data/jpa/reference/"
  - "https://mybatis.org/mybatis-3/"
---

<!-- _class: title -->

# JPA/MyBatis

ORM と SQL マッパーの使い分け、N+1、トランザクション境界を整理する。

- 本文資料: `docs/db/jpa-mybatis.md`
- 対象: Java + JPA + MyBatis
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Domain[Domain] --> JPA[JPA]
  Domain --> MyBatis[MyBatis]
  JPA --> DB[DB]
  MyBatis --> DB
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: JPA/MyBatisの相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 使い分け

- JPA は集約と変更追跡に向く。MyBatis はSQLを明示したい場面に向く。

> 実務例: 使い分けでは、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
JpaRepository
Mapper XML
```

---

## N+1

- ループ中の追加SELECTに注意する。

> 実務例: N+1では、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
JOIN FETCH
select ... join
```

---

## transaction

- サービスの業務単位で境界を決める。

> 実務例: transactionでは、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
@Transactional
```

---

## テスト

- SQL数、遅いSQL、rollback を確認する。

> 実務例: テストでは、遅い検索や件数ずれをSQL、実行計画、実データから説明できるようにする。

```
@DataJpaTest
@MybatisTest
```

---

## 実務で使う場面

- データ取得、更新、性能、ロックを、SQLと実行計画から判断する場面で使う。
- 正しさ、件数、速度、同時実行の4つを分けて見ると改善しやすい。

- この教材では **JPA/MyBatis** を Java + JPA + MyBatis の文脈で扱う。

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

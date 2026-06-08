---
marp: true
theme: learning
size: "16:9"
title: "例外処理/ログ"
chapter: "web"
order: 6
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/web/exception-logging.md"
  - "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html"
  - "https://opentelemetry.io/docs/concepts/signals/logs/"
---

<!-- _class: title -->

# 例外処理/ログ

例外を握りつぶさず、利用者向け応答と運用者向けログを分ける。

- 本文資料: `docs/web/exception-logging.md`
- 対象: Spring + structured logs
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Error[例外] --> Handler[例外ハンドラ]
  Handler --> Response[利用者応答]
  Handler --> Log[運用ログ]
  Log --> Trace[追跡]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: 例外処理/ログの相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 例外の分類

- 入力、認可、業務、外部連携、システムに分ける。

> 実務例: 例外の分類では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
BadRequest
Forbidden
Conflict
InternalServerError
```

---

## ログに残すもの

- request id、user id、処理名、原因を残す。secret は出さない。

> 実務例: ログに残すものでは、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
logger.warn("order failed requestId={} orderId={}", requestId, orderId);
```

---

## Problem Details

- HTTP API では機械が読めるエラー形式にする。

> 実務例: Problem Detailsでは、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
type
title
status
detail
instance
```

---

## 調査

- ログ、メトリクス、トレースを同じIDでつなぐ。

> 実務例: 調査では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
X-Request-Id
trace_id
```

---

## 実務で使う場面

- 画面や外部クライアントから来たリクエストを、安全にアプリの処理へ渡す場面で使う。
- APIの境界、入力検証、例外、設定、テストをそろえると変更に強くなる。

- この教材では **例外処理/ログ** を Spring + structured logs の文脈で扱う。

---

## 判断の順番

- HTTPの責務と業務ロジックの責務を分ける。
- 外部公開のDTOと内部モデルを混ぜない。
- 正常系だけでなく、入力エラーと失敗時の応答を先に決める。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
curl -i -X POST http://localhost:8080/api/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Aki","email":"aki@example.com"}'
```

---

## よくある失敗

- Controllerに業務判断を詰め込みすぎる
- 入力エラーを全部500で返す
- secretや個人情報をログに出す

---

## チェックリスト

- Controller/APIの入出力をテストする
- ログにrequest idなどの追跡情報を入れる
- 設定値とsecretの出どころを確認する

---

## ミニ演習

- 小さなPOST APIを作る
- 未入力、形式不正、重複のテストを書く
- curlでstatusとbodyを確認する

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

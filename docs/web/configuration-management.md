---
marp: true
theme: learning
size: "16:9"
title: "設定管理"
chapter: "web"
order: 7
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/web/configuration-management.md"
  - "https://docs.spring.io/spring-boot/reference/features/external-config.html"
  - "https://12factor.net/config"
---

<!-- _class: title -->

# 設定管理

環境差分、秘密情報、デフォルト値、検証方法を整理する。

- 本文資料: `docs/web/configuration-management.md`
- 対象: Spring profiles + environment variables
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Default[デフォルト] --> Env[環境変数]
  Env --> Profile[profile]
  Profile --> Validate[起動時検証]
  Validate --> Run[実行]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: 設定管理の相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 設定の置き場

- 環境で変わるものは外から渡す。
- secret はリポジトリに置かない。

> 実務例: 設定の置き場では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
DATABASE_URL
REDIS_HOST
APP_ENV
```

---

## Spring の例

- application.yml に構造を書き、値は環境変数で上書きする。

> 実務例: Spring の例では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
spring:
  datasource:
    url: ${DATABASE_URL}
```

---

## 起動時検証

- 必要な設定がなければ起動時に落とす。

> 実務例: 起動時検証では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
@ConfigurationProperties
@Validated
@NotBlank
```

---

## 運用

- 設定変更はデプロイと同じく記録する。

> 実務例: 運用では、画面やAPIの入力が壊れたときに、どこで受け止めてどう返すかを決める。

```
who changed
when
why
```

---

## 実務で使う場面

- 画面や外部クライアントから来たリクエストを、安全にアプリの処理へ渡す場面で使う。
- APIの境界、入力検証、例外、設定、テストをそろえると変更に強くなる。

- この教材では **設定管理** を Spring profiles + environment variables の文脈で扱う。

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

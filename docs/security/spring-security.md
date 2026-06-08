---
marp: true
theme: learning
size: "16:9"
title: "Spring Security"
chapter: "security"
order: 2
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/security/spring-security.md"
  - "https://docs.spring.io/spring-security/reference/"
  - "https://docs.spring.io/spring-security/reference/servlet/architecture.html"
---

<!-- _class: title -->

# Spring Security

認証、認可、Filter、失敗時応答を見通しよく設計する。

- 本文資料: `docs/security/spring-security.md`
- 対象: Spring Security + MVC
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Request[Request] --> Filter[Security Filter]
  Filter --> Authn[認証]
  Authn --> Authz[認可]
  Authz --> Handler[Controller]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: Spring Securityの相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 全体像

- Spring Security は Filter chain でリクエストを処理する。

> 実務例: 全体像では、未ログイン・権限不足・許可済みを分けて確認し、想定外のアクセスを防ぐ。

```
SecurityFilterChain
Authentication
AuthorizationManager
```

---

## 認証

- 誰かを確認する。password、session、OAuth など方式を選ぶ。

> 実務例: 認証では、未ログイン・権限不足・許可済みを分けて確認し、想定外のアクセスを防ぐ。

```
formLogin
oauth2Login
httpBasic
```

---

## 認可

- 誰が何にアクセスできるかを決める。

> 実務例: 認可では、未ログイン・権限不足・許可済みを分けて確認し、想定外のアクセスを防ぐ。

```
requestMatchers("/admin/**").hasRole("ADMIN")
```

---

## テスト

- 許可、拒否、未ログインを分けて確認する。

> 実務例: テストでは、未ログイン・権限不足・許可済みを分けて確認し、想定外のアクセスを防ぐ。

```
@WithMockUser
status().isForbidden()
```

---

## 実務で使う場面

- ログイン、権限、ブラウザ制約、secret、事故対応を安全に設計する場面で使う。
- 便利さよりも、漏れたとき・間違えたときの被害を小さくする考え方が大切。

- この教材では **Spring Security** を Spring Security + MVC の文脈で扱う。

---

## 判断の順番

- 認証は誰か、認可は何を許すかとして分ける。
- 明示的に許可したものだけ通す。
- secretは作成、保管、注入、更新、廃棄まで一連で考える。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
curl -i http://localhost:8080/admin
curl -i -H 'Authorization: Bearer <token>' http://localhost:8080/admin
```

---

## よくある失敗

- CORSを認可の代わりに使う
- 管理者ロールだけで細かい操作を全部許す
- 漏えい後にtokenを無効化せず履歴修正だけする

---

## チェックリスト

- 未ログイン、権限不足、許可済みの3パターンを確認する
- Cookieやtokenの属性を確認する
- ログとリポジトリにsecretがないか確認する

---

## ミニ演習

- deny by defaultの設定を作る
- 権限不足のテストを書く
- 漏えい時の初動メモを作る

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

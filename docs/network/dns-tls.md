---
marp: true
theme: learning
size: "16:9"
title: "DNS/TLS"
chapter: "network"
order: 1
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/network/dns-tls.md"
  - "https://www.rfc-editor.org/rfc/rfc8446"
  - "https://developer.mozilla.org/docs/Web/Security/Transport_Layer_Security"
---

<!-- _class: title -->

# DNS/TLS

名前解決と暗号化の流れを理解し、証明書更新や接続失敗を調査する。

- 本文資料: `docs/network/dns-tls.md`
- 対象: DNS + TLS + Nginx
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Client[Client] --> DNS[DNS]
  DNS --> IP[IP Address]
  IP --> TLS[TLS Handshake]
  TLS --> HTTP[HTTP]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: DNS/TLSの相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## DNS

- 名前からIPを引く。TTL、CNAME、resolver を見る。

> 実務例: DNSでは、ユーザーから「つながらない」と言われたときに、どの層で止まっているかを切り分ける。

```
dig example.com
dig +short example.com
```

---

## TLS

- 証明書、期限、SAN、chain を見る。

> 実務例: TLSでは、ユーザーから「つながらない」と言われたときに、どの層で止まっているかを切り分ける。

```
openssl s_client -connect example.com:443 -servername example.com
```

---

## Nginx

- TLS 終端の設定を確認する。

> 実務例: Nginxでは、ユーザーから「つながらない」と言われたときに、どの層で止まっているかを切り分ける。

```
ssl_certificate
ssl_certificate_key
```

---

## 障害調査

- DNS、TCP、TLS、HTTP の順に切り分ける。

> 実務例: 障害調査では、ユーザーから「つながらない」と言われたときに、どの層で止まっているかを切り分ける。

```
getent hosts
curl -vk
```

---

## 実務で使う場面

- ユーザーからアプリまでの経路で、どこが詰まっているか切り分ける場面で使う。
- DNS、TCP、TLS、HTTP、アプリの順番で見ると、調査がぶれにくい。

- この教材では **DNS/TLS** を DNS + TLS + Nginx の文脈で扱う。

---

## 判断の順番

- まず名前解決と到達性を見る。
- 次にTLSやHTTPヘッダーを確認する。
- 最後にNginxや上流アプリのログへ進む。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
getent hosts example.com
curl -vkI https://example.com
ss -ltnp
```

---

## よくある失敗

- アプリだけを疑ってDNSやTLSを見ない
- コンテナ内のlocalhostを誤解する
- LBのhealthcheckと実リクエストの差を見落とす

---

## チェックリスト

- dig/getentで名前解決を見る
- curl -vでTLSとHTTPを見る
- access logとupstreamのstatusを見る

---

## ミニ演習

- curl -vの出力からDNS/TLS/HTTPを分ける
- Nginxの設定テストとreloadを試す
- 障害調査メモを時系列で書く

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

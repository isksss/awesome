---
marp: true
theme: learning
size: "16:9"
title: "Vim / Neovim の使い方"
chapter: "fundamentals"
order: 4
audience: "初学者から実務者"
updated: "2026-06-09"
status: "complete"
visibility: "public"
sources:
  - "docs/fundamentals/vim-nvim.md"
  - "https://neovim.io/doc/user/"
  - "https://vimhelp.org/"
---

<!-- _class: title -->

# Vim / Neovim の使い方

モードを理解し、キーボード中心で安全に編集する。

- 本文資料: `docs/fundamentals/vim-nvim.md`
- 対象: Vim/Neovim + Lua + LSP
- まず全体像、次に実務の判断、最後に確認手順を押さえる
- 各章では、現場で起こりやすい状況と小さなサンプルを一緒に見る

---

## 全体像

```mermaid
flowchart LR
  Open[開く] --> Move[移動]
  Move --> Edit[編集]
  Edit --> Search[検索]
  Search --> Save[保存]
```

この図を入口に、どこで何を判断するかを追っていく。

> 実務例: Vim / Neovim の使い方の相談を受けたら、まず図のどの場所で問題が起きているかを言葉にする。

---

## 全体像

- Normal、Insert、Visual、Command-line の役割を分けて覚える。
- Esc で Normal に戻ると操作が安定する。

> 実務例: 全体像では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
i
Esc
:w
:q
```

---

## 移動

- 単語、行、画面単位で移動する。
- 矢印より `hjkl` と検索に慣れると速い。

> 実務例: 移動では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
h j k l
w b e
gg G
/keyword
```

---

## 編集

- 削除、変更、コピー、貼り付けを組み合わせる。

> 実務例: 編集では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
dd
cw
yy
p
u
Ctrl-r
```

---

## 設定

- まず小さな init.lua から始める。

> 実務例: 設定では、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
vim.opt.number = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 2
```

---

## プラグイン

- lazy.nvim などで管理する。
- 入れすぎず、検索、LSP、補完から始める。

> 実務例: プラグインでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
nvim-telescope/telescope.nvim
neovim/nvim-lspconfig
nvim-treesitter/nvim-treesitter
```

---

## LSP

- 定義ジャンプ、診断、補完を使う。

> 実務例: LSPでは、レビュー前の確認や障害調査で「今どんな状態か」を説明するために使う。

```
vim.lsp.enable('ts_ls')
vim.keymap.set('n', 'gd', vim.lsp.buf.definition)
```

---

## 実務で使う場面

- サーバー上の設定ファイルや、ローカルのコードをキーボード中心で編集する場面で使う。
- 基本操作から、設定、プラグイン、LSPまで一つの流れで覚える。

- この教材では **Vim / Neovim の使い方** を Vim/Neovim + Lua + LSP の文脈で扱う。

---

## 判断の順番

- Normal modeを操作の起点にする。
- 移動、選択、編集、保存を短いコマンドで組み合わせる。
- プラグインは検索、LSP、補完の順に足す。

---

## サンプル確認

手元では、小さく動かして結果を見るところから始める。

```sh
vimtutor
nvim --clean sample.txt
:checkhealth
:Lazy
```

---

## よくある失敗

- Insert modeのまま操作しようとして迷う
- プラグインを入れすぎて原因を追えなくする
- 保存前に編集対象のファイル名を確認しない

---

## チェックリスト

- `:checkhealth` でNeovim環境を見る
- `nvim --clean` で設定抜きの挙動を確認する
- 設定変更後に最小ファイルで動作確認する

---

## ミニ演習

- `vimtutor` を1周する
- 検索、置換、undo/redoを試す
- init.luaに行番号とLSP keymapを追加する

---

## まとめ

- 目的と境界を先に決める
- 状態を確認してから変更する
- 具体例で動かし、ログや結果で確かめる
- 危険な操作は影響範囲を確認する

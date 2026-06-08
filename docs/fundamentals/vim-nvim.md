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
---

<!-- _class: title -->

# Vim / Neovim の使い方

モードを理解し、キーボード中心で安全に編集する。

- 本文資料: `docs/fundamentals/vim-nvim.md`
- まずは保存、終了、移動、検索を覚える
- 慣れてから設定、プラグイン、LSP に進む

---

## まず全体像

```mermaid
flowchart LR
  Start[開く] --> Move[移動]
  Move --> Edit[編集]
  Edit --> Search[検索]
  Search --> Save[保存]
  Save --> Extend[設定とプラグイン]
```

Vim / Neovim は、基本操作に慣れてから少しずつ育てると使いやすい。

---

## Vim と Neovim

- Vim: 多くの Linux 環境に入っている定番エディタ
- Neovim: Lua 設定、LSP、terminal 連携が扱いやすい
- 基本操作はかなり共通
- サーバー上の軽い編集なら Vim で十分
- 普段の開発環境として育てるなら Neovim が便利

---

## 起動と終了

```sh
vim README.md
nvim README.md
```

```vim
:w    保存
:q    終了
:wq   保存して終了
:q!   保存せず終了
```

困ったら `Esc` を押してから `:q!`。

---

## モードを理解する

- Normal mode: 移動、削除、コピー、コマンド
- Insert mode: 文字入力
- Visual mode: 範囲選択
- Command-line mode: 保存、終了、置換

```vim
i    入力開始
Esc  Normal mode に戻る
v    範囲選択
:    コマンド入力
```

---

## 移動

```vim
h  左
j  下
k  上
l  右
```

```vim
w   次の単語
b   前の単語
0   行頭
$   行末
gg  ファイル先頭
G   ファイル末尾
```

---

## 入力の入り口

```vim
i  カーソル前から入力
a  カーソル後ろから入力
I  行頭から入力
A  行末から入力
o  下に新しい行
O  上に新しい行
```

`i` だけでも始められる。慣れたら `A` と `o` がかなり便利。

---

## 削除、変更、コピー

```vim
dd  1行削除
dw  単語を削除
cw  単語を変更
yy  1行コピー
p   貼り付け
u   undo
```

Vim の操作は「何を」「どれだけ」編集するかを組み合わせる感覚。

---

## 検索と置換

```vim
/error
n
N
```

```vim
:%s/old/new/gc
```

- `/`: 検索
- `n` / `N`: 次へ / 前へ
- `gc`: 確認しながら置換

大きな置換では確認付きにすると安心。

---

## Visual mode

```vim
v      文字単位
V      行単位
Ctrl-v 矩形選択
```

選択後:

```vim
y  コピー
d  削除
>  インデントを増やす
<  インデントを減らす
```

矩形選択は複数行の先頭編集に強い。

---

## buffer と window

```vim
:edit file.md
:buffers
:bnext
:bprevious
```

```vim
:split
:vsplit
Ctrl-w h/j/k/l
```

buffer は開いているファイル、window は見えている分割画面。

---

## terminal と shell

```vim
:!ls
:terminal
```

Neovim の terminal mode から戻る:

```vim
Ctrl-\ Ctrl-n
```

ログ確認、テスト実行、Git 操作を近くで扱える。

---

## Neovim の最小設定

```lua
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 2
vim.opt.tabstop = 2
vim.opt.ignorecase = true
vim.opt.smartcase = true
```

まずは見やすさ、インデント、検索だけ整える。

---

## keymap

```lua
vim.g.mapleader = " "

vim.keymap.set("n", "<leader>w", "<cmd>write<cr>")
vim.keymap.set("n", "<leader>q", "<cmd>quit<cr>")
vim.keymap.set("n", "<leader>h", "<cmd>nohlsearch<cr>")
```

よく使う操作だけを割り当てる。最初から増やしすぎない。

---

## プラグイン管理

`lazy.nvim` の例:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({})
```

プラグインは「困りごとを解決する道具」として追加する。

---

## 代表的なプラグインの役割

- fuzzy finder: ファイルや文字列を探す
- file explorer: ディレクトリを見る
- LSP: 補完、定義ジャンプ、診断
- treesitter: 構文ハイライト
- git integration: 差分や blame を見る
- statusline: 状態を見やすくする

名前より役割で選ぶ。

---

## Telescope の例

```lua
require("lazy").setup({
  {
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
  },
})
```

```lua
vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>")
vim.keymap.set("n", "<leader>fg", "<cmd>Telescope live_grep<cr>")
```

---

## LSP

LSP は言語ごとの支援機能を提供する。

```vim
gd  定義へ移動
K   hover
gr  参照一覧
```

- 補完
- 定義ジャンプ
- エラー診断
- rename
- format

使う言語から少しずつ整える。

---

## よくあるつまずき

- 入力できない: `i`
- 終了できない: `Esc` して `:q!`
- 保存できない: 権限を確認
- 設定が壊れた: 最小設定に戻す
- プラグインが多すぎる: 目的別に減らす

焦ったらまず `Esc`。

---

## まとめ

- mode を理解すると Vim は分かりやすい
- まず保存、終了、移動、検索を覚える
- buffer と window で複数ファイルを扱う
- Neovim は Lua 設定と LSP が便利
- プラグインは目的を決めて少しずつ入れる

最初のゴールは「困らず保存して終了できること」。

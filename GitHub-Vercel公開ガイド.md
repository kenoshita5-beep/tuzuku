# GitHub + Vercel 公開ガイド（方法B）🚀

コードを GitHub に置き、Vercel と連携して「push するたび自動で公開」される
仕組みを作ります。上から順にやればOKです。コマンドはすべて `tsuzuku` フォルダで実行します。

---

## 準備するもの

- **Git**（コード管理ツール）… 入っていなければ https://git-scm.com/download/win
- **GitHub アカウント** … https://github.com （無料）
- **Vercel アカウント** … https://vercel.com （GitHubでログインするので後で作成）

---

## フェーズ0：確認と下準備

まず preview を止めます。ターミナルで **Ctrl + C**。

Git が入っているか確認:

```
git --version
```

`git version 2.x.x` のように出ればOK。`認識されていません` なら上のURLから
インストール→ターミナルを開き直してください。

初めて Git を使う場合、コミットに記録する名前とメールを一度だけ設定します
（GitHub のものと同じでなくてもOK）:

```
git config --global user.name "あなたの名前"
git config --global user.email "you@example.com"
```

---

## フェーズ1：ローカルでリポジトリを作る

`tsuzuku` フォルダにいることを確認して、順に実行:

```
cd C:\Users\kenos\Documents\tsuzuku
git init
git add .
git commit -m "Initial commit: 習慣トラッカー つづく"
```

- `git init` … このフォルダを Git 管理下に置く（`.git` という管理フォルダができる）
- `git add .` … 変更を「次に記録する候補」に載せる
  （`node_modules` と `dist` は `.gitignore` で自動除外されるので上がりません＝正しい挙動）
- `git commit` … 現在の状態をスナップショットとして記録

`git status` で状態、`git log --oneline` で履歴を確認できます。

---

## フェーズ2：GitHub にリポジトリを作って push

### 2-1. GitHub 側で空のリポジトリを作る
1. https://github.com にログイン → 右上「＋」→ **New repository**
2. Repository name に `tsuzuku` と入力
3. Public / Private はどちらでもOK（後から変更可）
4. **README や .gitignore は追加しない**（空のまま作る。既にローカルにあるため）
5. **Create repository** をクリック
6. 次の画面に出る `https://github.com/ユーザー名/tsuzuku.git` を控える

### 2-2. ローカルと GitHub をつないで push

```
git branch -M main
git remote add origin https://github.com/ユーザー名/tsuzuku.git
git push -u origin main
```

- `branch -M main` … メインブランチ名を `main` に統一
- `remote add origin ...` … 送信先として GitHub を「origin」という名前で登録
- `push -u origin main` … ローカルの内容を GitHub にアップロード

> 🔐 認証について：初回 push で認証を求められます。Windows の Git には
> Credential Manager が同梱されており、**ブラウザが開いて GitHub ログイン**すれば完了します。
> （GitHub は 2021 年からパスワード認証を廃止。パスワードを直接入力する方式ではありません）

push が終わったら GitHub のページを再読み込み。ソースが表示されれば成功です。

---

## フェーズ3：Vercel で公開する

1. https://vercel.com を開く → **Continue with GitHub** でログイン
   （初回は Vercel に GitHub へのアクセスを許可する画面が出ます）
2. ダッシュボードで **Add New… → Project**
3. リポジトリ一覧から `tsuzuku` を選び **Import**
   （見つからなければ「Adjust GitHub App Permissions」でリポジトリへのアクセスを許可）
4. 設定画面。Vercel が **Vite** を自動検出します。基本そのままでOK:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy** をクリック
6. 1〜2分でビルドが走り、`https://tsuzuku-xxxx.vercel.app` のような
   **公開URL** が発行されます 🎉

---

## フェーズ4：自動デプロイを体験する

これ以降は、コードを直して GitHub に push するだけで自動的に再公開されます。

```
（何かを編集して保存）
git add .
git commit -m "説明を更新"
git push
```

push すると Vercel が変更を検知し、自動でビルド→本番反映。
これが CI/CD（継続的インテグレーション／デリバリー）の基本形です。

---

## よくあるつまずき

- **push で 403 / 認証エラー** … ブラウザのログインをやり直す。別アカウントに
  ログイン済みの場合は Windows の「資格情報マネージャー」で github の項目を削除して再push。
- **Vercel にリポジトリが出ない** … Import画面の「Adjust GitHub App Permissions」から
  対象リポジトリへのアクセスを許可する。
- **公開ページが真っ白** … Vercel の Deployment ログでビルド失敗を確認。
  ローカルで `npm run build` が通るかも確認する（このプロジェクトは通ることを確認済み）。

---

まず **フェーズ0とフェーズ1** をやって、`git commit` まで進んだら結果を教えてください。
一歩ずつ確認しながら進めます。つづく 🌱

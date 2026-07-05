# つづく (Tsuzuku) — 習慣トラッカー

「続ける」ことを楽しくする、React製の習慣管理アプリです。
毎日のチェックイン、連続記録（ストリーク）、GitHub風の年間ヒートマップ、達成率で、
小さな習慣の積み重ねを見える化します。

## 主な機能
- ✅ ワンタップで今日の習慣をチェックイン
- 🔥 連続日数（ストリーク）と最長記録を自動計算
- 📅 今週の達成状況を一目で確認できる週ビュー
- 🟩 1年間の記録をGitHub風ヒートマップで可視化
- 📊 直近30日の達成率・合計達成数などの統計
- 🎨 絵文字＆カラーで習慣をカスタマイズ
- 🌙 ダーク / ライトテーマ切り替え
- 💾 データはブラウザに自動保存（localStorage・サーバー不要）

## 動かし方

必要なもの: Node.js 18 以上

```bash
cd tsuzuku
npm install      # 依存関係のインストール（初回のみ）
npm run dev      # 開発サーバー起動 → 表示されたURLをブラウザで開く
```

本番用ビルドとプレビュー:

```bash
npm run build    # dist/ に静的ファイルを生成
npm run preview  # ビルド結果をローカルで確認
```

`dist/` の中身をそのまま静的ホスティング（Netlify / Vercel / GitHub Pages など）に置けば公開できます。

## 技術構成
- **Vite + React 18**（外部UIライブラリなし・軽量）
- 状態管理は React Hooks、永続化は localStorage
- 日付・統計ロジックは依存ゼロの自作ユーティリティ（`src/lib`）

## ディレクトリ
```
tsuzuku/
├─ index.html
├─ vite.config.js
├─ package.json
└─ src/
   ├─ main.jsx          # エントリポイント
   ├─ App.jsx           # 状態管理の中心
   ├─ styles.css        # テーマ・全スタイル
   ├─ hooks/
   │  └─ useLocalStorage.js
   ├─ lib/
   │  ├─ date.js        # 日付ユーティリティ
   │  └─ stats.js       # ストリーク・達成率の計算
   └─ components/
      ├─ Header.jsx
      ├─ OverviewBar.jsx
      ├─ HabitList.jsx
      ├─ HabitCard.jsx
      ├─ WeekStrip.jsx
      ├─ Heatmap.jsx
      ├─ HabitForm.jsx
      └─ EmptyState.jsx
```

楽しく、あなたのペースで。つづけよう。

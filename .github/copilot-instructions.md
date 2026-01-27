# イナズマツールWiki* - AI Coding Instructions

## プロジェクト概要
イナズマイレブン向けの攻略ツールサイト。Next.js 16 (App Router) + TypeScript + Supabase構成。
Wiki風デザインで、フォーカス計算、キャラクター図鑑、投稿システムを提供。

## アーキテクチャ

### 主要コンポーネント
- **フォーカス計算** (`app/calc/page.tsx`): ステータス・装備・バフを組み合わせてAT/DF値を算出
- **キャラクター図鑑** (`app/character/page.tsx`): ポジション・ビルド別フィルタ対応の一覧表示
- **投稿システム** (`app/submit/page.tsx`): ユーザーによるキャラクター情報投稿（重複チェック付き）
- **管理画面** (`app/admin/page.tsx`): パスキー認証で投稿承認/却下を実施

### データフロー
1. Supabaseから装備・キャラクターデータをフェッチ（`useEffect`）
2. クライアント側で計算・フィルタリング実行（全てCSR）
3. 投稿は`character_submissions`テーブルに保存、承認後`character_data`へマージ

### データベース（`db/schema.sql`）
- `character_data`: 承認済みキャラクター（`character_id`がユニーク）
- `stats_benchmarks`: ポジション別ステータスベンチマーク
- `character_submissions`: 投稿待ちキャラ（`status`: pending/approved/rejected）
- `equipment`: 装備アイテム（Supabase上で管理）

## 開発規約

### 命名・スタイル
- コンポーネントはPascalCase（例: `StatInput.tsx`）
- CSSモジュールはケバブケース（例: `calc.module.css`）
- 型定義は `types/index.ts` に集約
- 日本語UI前提（変数名は英語、UIテキストは日本語）

### 状態管理パターン
```tsx
// 全ページ共通: useState + useEffect によるCSR
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 計算ロジック（フォーカス計算の例）
```tsx
// AT = (キック/2 + コントロール + テクニック) × (1 + フォーカス%) × (1 + 正義%)
const multiplier = (1 + buffs.focus / 100) * (1 + buffs.justice / 100);
const at = Math.floor(((kick / 2) + control + technique) * multiplier);
```

### Supabaseクライアント初期化
各ページで同じパターン:
```tsx
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
```

## 重要な注意点

### レスポンシブ対応
`app/layout.tsx` の `<style>` タグで全体レイアウトを制御:
```css
@media (max-width: 768px) {
  .layout-container { flex-direction: column; }
}
```
CSS-in-JSではなく、インラインスタイルタグで実装されている点に注意。

### 型安全性
- 全ての型は `types/index.ts` から `import` して使用
- Supabaseのレスポンスは必ず型アサーション: `data as Equipment[]`

### エラーハンドリング
```tsx
try {
  // Supabaseクエリ
  if (supabaseError) throw new Error(`データ取得エラー: ${supabaseError.message}`);
} catch (err) {
  const message = err instanceof Error ? err.message : "不明なエラーが発生しました";
  setError(message);
}
```

## ワークフロー

### 開発サーバー起動
```bash
npm run dev
```
`http://localhost:3000` で起動（Next.js 16デフォルト設定）

### ビルド・デプロイ
```bash
npm run build
npm run start
```

### リント
```bash
npm run lint
```
`eslint-config-next` を使用

## コンポーネント設計パターン

### ページコンポーネント
- `"use client"` ディレクティブは必須（クライアント側のみで動作）
- `useEffect`で初期データ取得
- 複雑なロジックは小さいコンポーネントに分割

### 子コンポーネント（例: StatInput, EquipmentSelect）
- Props経由で`state`と`setState`を受け取る
- コンポーネント内での計算・変更ロジックはミニマル
- 親コンポーネントで状態管理

### スタイリング
- CSS Modulesを使用（`.module.css`）
- グローバルスタイルは `app/globals.css` で管理
- Tailwind CSS 4対応（PostCSS経由）

## Supabaseとの連携

### テーブル操作パターン
```tsx
// 単一取得（条件指定）
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", value)
  .single();

// 複数取得（ソート付き）
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .order("column", { ascending: true });
```

### エラーコード対応
- `PGRST116`: 1件のみ期待していたが0件の場合（checkDuplicateで使用）
- 必ず`error?.code`でチェック

## 新機能追加時のチェックリスト
1. `types/index.ts` に型定義を追加
2. `app/` 以下に専用ディレクトリを作成（`page.tsx` + `.module.css`）
3. Supabaseテーブル変更時は `db/schema.sql` を更新
4. `app/layout.tsx` のサイドバーメニューにリンク追加
5. `app/page.tsx` のお知らせ・ツール一覧に記載

## 環境変数
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_ADMIN_PASSKEY=xxxxx （管理画面用）
```
`.env.local` に設定。`NEXT_PUBLIC_*` は必須（クライアント側で使用）

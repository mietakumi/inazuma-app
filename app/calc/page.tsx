"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- 設定エリア ---

// Supabaseの接続設定
// (.env.localに設定した鍵を読み込みます)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// データの型定義（Supabaseのテーブルに合わせて調整してください）
type Equipment = {
  id: number;
  name: string;      // 装備/キャラ名
  focus: number;     // 基礎フォーカス値
  category?: string; // カテゴリ（任意）
};

export default function Home() {
  // --- 変数（State）の準備 ---
  const [items, setItems] = useState<Equipment[]>([]); // データ一覧
  const [loading, setLoading] = useState(true);        // 読み込み中かどうか
  
  // ★追加機能：計算用バフ★
  const [focusBuff, setFocusBuff] = useState<number>(0);   // フォーカスバフ(%)
  const [justiceBuff, setJusticeBuff] = useState<number>(0); // 正義補正(%)

  // --- 1. 起動時にSupabaseからデータを取得 ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 'equipments' というテーブルから全データを取得
        // ※もしテーブル名が違う場合は 'equipments' を書き換えてください
        const { data, error } = await supabase.from("equipments").select("*");

        if (error) throw error;
        if (data) setItems(data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. 計算ロジック（ここが頭脳！） ---
  // 基礎値を受け取り、バフを掛けた最終値を返す関数
  const calculatePower = (baseValue: number) => {
    if (!baseValue) return 0;
    
    // 計算式： 基礎値 × (1 + フォーカス%/100) × (1 + 正義%/100)
    // 小数点は切り捨て (Math.floor)
    const multiplier = (1 + focusBuff / 100) * (1 + justiceBuff / 100);
    return Math.floor(baseValue * multiplier);
  };

  // --- 3. 画面の見た目 ---
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ イナズマ計算ツール ⚡</h1>

      {/* ▼▼▼ 追加機能：補正値コントローラー ▼▼▼ */}
      <div style={styles.controlPanel}>
        <p style={styles.panelTitle}>⚙️ 補正オプション</p>
        <div style={styles.inputsRow}>
          
          {/* フォーカスバフ入力 */}
          <div style={styles.inputGroup}>
            <label>フォーカスバフ:</label>
            <div style={styles.inputWrapper}>
              <input
                type="number"
                value={focusBuff}
                onChange={(e) => setFocusBuff(Number(e.target.value))}
                style={styles.input}
              />
              <span>% UP</span>
            </div>
          </div>

          {/* 正義補正入力 */}
          <div style={styles.inputGroup}>
            <label>正義の鉄槌/補正:</label>
            <div style={styles.inputWrapper}>
              <input
                type="number"
                value={justiceBuff}
                onChange={(e) => setJusticeBuff(Number(e.target.value))}
                style={styles.input}
              />
              <span>% UP</span>
            </div>
          </div>

        </div>
      </div>
      {/* ▲▲▲ コントローラーここまで ▲▲▲ */}

      {/* データの表示エリア */}
      {loading ? (
        <p>データを読み込んでいます...</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{item.name}</h2>
              <p style={styles.category}>{item.category || "装備/キャラ"}</p>
              
              <div style={styles.statBox}>
                <span style={styles.statLabel}>最終フォーカス</span>
                <span style={styles.statValue}>
                  {/* ここで計算関数を使っています */}
                  {calculatePower(item.focus)}
                </span>
                <span style={styles.statSub}>
                  (基礎値: {item.focus})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 簡単なスタイル（CSS） ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    color: "#ff8c00",
    marginBottom: "30px",
  },
  // コントローラーのスタイル
  controlPanel: {
    backgroundColor: "#f0f4f8",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    border: "2px solid #dde",
  },
  panelTitle: {
    margin: "0 0 15px 0",
    fontWeight: "bold",
    color: "#556",
  },
  inputsRow: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    width: "80px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    textAlign: "right",
  },
  // カードリストのスタイル
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontSize: "18px",
    margin: "0 0 5px 0",
  },
  category: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "15px",
  },
  statBox: {
    backgroundColor: "#fffbf0",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #ffeeba",
  },
  statLabel: {
    display: "block",
    fontSize: "12px",
    color: "#888",
    marginBottom: "5px",
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#d35400",
  },
  statSub: {
    fontSize: "11px",
    color: "#aaa",
  },
};
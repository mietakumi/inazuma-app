"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- 設定エリア ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  // --- データ管理 ---
  const [items, setItems] = useState<any[]>([]);        // DBから取ってきた装備全リスト
  const [selectedId, setSelectedId] = useState<number | string>(""); // 選んだ装備のID

  // --- ステータス入力 ---
  const [baseStat, setBaseStat] = useState<number>(0);  // 素
  const [board, setBoard] = useState<number>(0);        // ボード
  const [beans, setBeans] = useState<number>(0);        // ビーンズ

  // --- 補正値 ---
  const [focusBuff, setFocusBuff] = useState<number>(0);   // フォーカスバフ(%)
  const [justiceBuff, setJusticeBuff] = useState<number>(0); // 正義補正(%)

  // 1. 起動時にSupabaseからデータを取ってくる
  useEffect(() => {
    const fetchData = async () => {
      // ★テーブル名は "equipment" (あなたの設定に合わせてね)
      const { data, error } = await supabase.from("equipment").select("*");
      if (data) {
        setItems(data);
        // 最初は何も選ばないか、リストの1番目をセットしておく
        if(data.length > 0) setSelectedId(data[0].id); 
      }
    };
    fetchData();
  }, []);

  // 2. 選ばれている装備のデータを特定する
  // (IDを使って、itemsリストの中から「これだ！」という1個を探す)
  const selectedItem = items.find((item) => item.id == selectedId);
  
  // 装備の数値（選んでなければ0）
  // ★重要：DBの列名が 'focus' じゃなかったらここを変えて！ item.power とか
  const equipStat = selectedItem ? selectedItem.focus : 0;

  // 3. 計算ロジック
  const calculateTotal = () => {
    // 基礎合計 = 素 + ボード + ビーンズ + 選んだ装備
    const baseTotal = (baseStat || 0) + (board || 0) + (beans || 0) + (equipStat || 0);

    // 倍率 = (1 + バフ%) * (1 + 正義%)
    const multiplier = (1 + focusBuff / 100) * (1 + justiceBuff / 100);

    // 結果（切り捨て）
    return Math.floor(baseTotal * multiplier);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#ff8c00" }}>⚡ イナズマ計算機 ⚡</h1>

      {/* ▼ キャラのステータス ▼ */}
      <div style={styles.group}>
        <h3>1. キャラクター入力</h3>
        <div style={styles.row}>
          <label>素: <input type="number" value={baseStat} onChange={(e) => setBaseStat(Number(e.target.value))} style={styles.input} /></label>
          <label>ボ: <input type="number" value={board} onChange={(e) => setBoard(Number(e.target.value))} style={styles.input} /></label>
          <label>ビ: <input type="number" value={beans} onChange={(e) => setBeans(Number(e.target.value))} style={styles.input} /></label>
        </div>
      </div>

      {/* ▼ 装備選択（ここがポイント！） ▼ */}
      <div style={styles.group}>
        <h3>2. 装備を選択</h3>
        <p style={{fontSize: "12px", color: "#666"}}>※データベースから読み込んでいます</p>
        
        <select 
          style={styles.select} 
          value={selectedId} 
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (値: {item.focus})
            </option>
          ))}
        </select>

        {/* 選んだ装備の確認表示 */}
        <div style={{marginTop: "10px", fontWeight: "bold", color: "#0070f3"}}>
           装備の値: {equipStat}
        </div>
      </div>

      {/* ▼ バフ設定 ▼ */}
      <div style={styles.group}>
        <h3>3. 補正オプション</h3>
        <div style={styles.row}>
          <label>Fバフ(%): <input type="number" value={focusBuff} onChange={(e) => setFocusBuff(Number(e.target.value))} style={styles.input} /></label>
          <label>正義(%): <input type="number" value={justiceBuff} onChange={(e) => setJusticeBuff(Number(e.target.value))} style={styles.input} /></label>
        </div>
      </div>

      {/* ▼ 結果表示 ▼ */}
      <div style={styles.resultCard}>
        <h2>最終フォーカス値</h2>
        <div style={styles.bigNumber}>
          {calculateTotal()}
        </div>
        <p>基礎計: {(baseStat||0)+(board||0)+(beans||0)+equipStat} × 倍率</p>
      </div>

    </div>
  );
}

// デザイン
const styles = {
  group: { marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" },
  row: { display: "flex", gap: "10px", flexWrap: "wrap" as "wrap" },
  input: { width: "60px", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" },
  select: { width: "100%", padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" },
  resultCard: { padding: "20px", background: "#fff5e6", border: "2px solid #ff8c00", borderRadius: "12px", textAlign: "center" as "center" },
  bigNumber: { fontSize: "40px", fontWeight: "bold", color: "#d35400", margin: "10px 0" }
};
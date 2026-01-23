"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- 設定エリア ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  // --- データ管理 ---
  const [items, setItems] = useState<any[]>([]); // DBから取ってきた装備全リスト

  // --- 4つの装備枠（選んだ装備のIDが入る） ---
  const [shoesId, setShoesId] = useState<string>("");
  const [misangaId, setMisangaId] = useState<string>("");
  const [pendantId, setPendantId] = useState<string>("");
  const [specialId, setSpecialId] = useState<string>("");

  // --- ステータス入力（わかりやすい名前に変更） ---
  const [baseStat, setBaseStat] = useState<number>(0);  // レベル99実数値
  const [board, setBoard] = useState<number>(0);        // 特訓ボード
  const [beans, setBeans] = useState<number>(0);        // ビーンズ

  // --- 補正値 ---
  const [focusBuff, setFocusBuff] = useState<number>(0);   // フォーカスバフ(%)
  const [justiceBuff, setJusticeBuff] = useState<number>(0); // 正義補正(%)

  // 1. 起動時にSupabaseからデータを取ってくる
  useEffect(() => {
    const fetchData = async () => {
      // ★テーブル名が 'equipment' で正しいか確認してください
      const { data, error } = await supabase.from("equipment").select("*");
      if (data) {
        setItems(data);
      }
    };
    fetchData();
  }, []);

  // 2. IDから装備の数値（フォーカス）を取り出す関数
  const getEquipValue = (id: string) => {
    if (!id) return 0;
    const foundItem = items.find((item) => item.id == id);
    // ★重要: DBの列名が 'focus' じゃない場合（powerなど）はここを書き換えてください
    return foundItem ? (foundItem.focus || 0) : 0;
  };

  // 3. 計算ロジック
  const calculateTotal = () => {
    // 装備4つの合計値を出す
    const equipTotal = getEquipValue(shoesId) + getEquipValue(misangaId) + getEquipValue(pendantId) + getEquipValue(specialId);

    // キャラ本体の合計 (素 + ボード + ビーンズ)
    const charTotal = (baseStat || 0) + (board || 0) + (beans || 0);

    // 基礎合計
    const baseTotal = charTotal + equipTotal;

    // 倍率 = (1 + バフ%) * (1 + 正義%)
    const multiplier = (1 + focusBuff / 100) * (1 + justiceBuff / 100);

    // 結果（切り捨て）
    return Math.floor(baseTotal * multiplier);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ イナズマ計算機 ⚡</h1>

      {/* ▼ 1. キャラクター入力 ▼ */}
      <div style={styles.card}>
        <h3 style={styles.cardHeader}>👤 キャラクター・ステータス</h3>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>レベル99実数値</label>
            <input type="number" value={baseStat} onChange={(e) => setBaseStat(Number(e.target.value))} style={styles.input} placeholder="例: 350" />
          </div>
          <div style={styles.inputGroup}>
            <label>特訓ボード</label>
            <input type="number" value={board} onChange={(e) => setBoard(Number(e.target.value))} style={styles.input} placeholder="例: 20" />
          </div>
          <div style={styles.inputGroup}>
            <label>ビーンズ</label>
            <input type="number" value={beans} onChange={(e) => setBeans(Number(e.target.value))} style={styles.input} placeholder="例: 50" />
          </div>
        </div>
      </div>

      {/* ▼ 2. 装備選択（4枠） ▼ */}
      <div style={styles.card}>
        <h3 style={styles.cardHeader}>🛡️ 装備選択 (合計: {getEquipValue(shoesId) + getEquipValue(misangaId) + getEquipValue(pendantId) + getEquipValue(specialId)})</h3>
        
        {/* シューズ */}
        <div style={styles.selectGroup}>
          <label>👟 シューズ</label>
          <select style={styles.select} value={shoesId} onChange={(e) => setShoesId(e.target.value)}>
            <option value="">-- 未選択 --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (値: {item.focus})</option>
            ))}
          </select>
        </div>

        {/* ミサンガ/ブレスレット */}
        <div style={styles.selectGroup}>
          <label>📿 ミサンガ/ブレスレット</label>
          <select style={styles.select} value={misangaId} onChange={(e) => setMisangaId(e.target.value)}>
            <option value="">-- 未選択 --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (値: {item.focus})</option>
            ))}
          </select>
        </div>

        {/* ペンダント/ネックレス */}
        <div style={styles.selectGroup}>
          <label>🏅 ペンダント/ネックレス</label>
          <select style={styles.select} value={pendantId} onChange={(e) => setPendantId(e.target.value)}>
            <option value="">-- 未選択 --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (値: {item.focus})</option>
            ))}
          </select>
        </div>

        {/* スペシャル/手袋 */}
        <div style={styles.selectGroup}>
          <label>🧤 スペシャル/手袋</label>
          <select style={styles.select} value={specialId} onChange={(e) => setSpecialId(e.target.value)}>
            <option value="">-- 未選択 --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (値: {item.focus})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ▼ 3. 補正オプション ▼ */}
      <div style={{...styles.card, backgroundColor: "#fffbf0", borderColor: "#ffeeba"}}>
        <h3 style={styles.cardHeader}>⚙️ 補正オプション</h3>
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label>フォーカスバフ (%)</label>
            <input type="number" value={focusBuff} onChange={(e) => setFocusBuff(Number(e.target.value))} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>正義の鉄槌/補正 (%)</label>
            <input type="number" value={justiceBuff} onChange={(e) => setJusticeBuff(Number(e.target.value))} style={styles.input} />
          </div>
        </div>
      </div>

      {/* ▼ 4. 結果表示 ▼ */}
      <div style={styles.resultCard}>
        <h2 style={{margin: "0 0 10px 0", fontSize: "18px", color: "#666"}}>最終フォーカス値</h2>
        <div style={styles.bigNumber}>
          {calculateTotal()}
        </div>
        <div style={{fontSize: "14px", color: "#888"}}>
            ( キャラ:{(baseStat||0)+(board||0)+(beans||0)} + 装備:{getEquipValue(shoesId) + getEquipValue(misangaId) + getEquipValue(pendantId) + getEquipValue(specialId)} ) × 倍率
        </div>
      </div>

    </div>
  );
}

// --- デザイン設定 ---
const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", color: "#333" },
  title: { textAlign: "center" as "center", color: "#ff8c00", marginBottom: "20px" },
  card: { padding: "20px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  cardHeader: { margin: "0 0 15px 0", fontSize: "16px", borderBottom: "2px solid #eee", paddingBottom: "10px" },
  inputRow: { display: "flex", gap: "15px", flexWrap: "wrap" as "wrap" },
  inputGroup: { display: "flex", flexDirection: "column" as "column", flex: "1", minWidth: "100px" },
  input: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", marginTop: "5px" },
  selectGroup: { marginBottom: "15px" },
  select: { width: "100%", padding: "10px", fontSize: "15px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" },
  resultCard: { padding: "30px", backgroundColor: "#333", color: "#fff", borderRadius: "15px", textAlign: "center" as "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  bigNumber: { fontSize: "48px", fontWeight: "bold", color: "#ffbd00", margin: "10px 0" }
};
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- 設定 ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// 装備の型定義
type Equipment = {
  id: number;
  name: string;
  category: string; // カテゴリ (シューズ, ミサンガ, ペンダント, スペシャル)
  kick: number;
  control: number;
  technique: number;
  agility: number;     // スピード/瞬発力
  intelligence: number; // 賢さ
};

export default function Home() {
  const [items, setItems] = useState<Equipment[]>([]);

  // --- 選択された装備ID ---
  const [shoesId, setShoesId] = useState<string>("");
  const [misangaId, setMisangaId] = useState<string>("");
  const [pendantId, setPendantId] = useState<string>("");
  const [specialId, setSpecialId] = useState<string>("");

  // --- キャラクターのステータス入力 ---
  const [stats, setStats] = useState({
    kick: 0,
    control: 0,
    technique: 0,
    agility: 0,
    intelligence: 0,
  });

  // --- バフ ---
  const [focusBuff, setFocusBuff] = useState<number>(0);
  const [justiceBuff, setJusticeBuff] = useState<number>(0);

  // 1. データ取得
  useEffect(() => {
    const fetchData = async () => {
      // ★ category列や各ステータス列がないとエラーになるので注意！
      const { data, error } = await supabase.from("equipment").select("*");
      if (data) setItems(data as any);
    };
    fetchData();
  }, []);

  // 2. 指定したカテゴリの装備だけを抽出する関数
  const getItemsByCategory = (catName: string) => {
    // データがない、またはカテゴリが一致するものだけ返す
    // ※DBに 'シューズ' と登録されている想定。英語なら 'Shoes' に変えてね
    return items.filter((item) => item.category === catName || item.category === "全種");
  };

  // 3. IDから装備データを取得する関数
  const getEquip = (id: string) => items.find((i) => i.id.toString() === id);

  // 4. 合計ステータスを計算する関数 (キャラ + 装備4種)
  const getTotalStat = (statName: keyof Equipment) => {
    const s = getEquip(shoesId)?.[statName] || 0;
    const m = getEquip(misangaId)?.[statName] || 0;
    const p = getEquip(pendantId)?.[statName] || 0;
    const sp = getEquip(specialId)?.[statName] || 0;
    // @ts-ignore
    const charStat = stats[statName] || 0;

    // @ts-ignore
    return charStat + s + m + p + sp;
  };

  // 5. フォーカス計算 (AT / DF)
  const calculateFocus = () => {
    // 全ステータスの合計値を算出
    const totalKick = getTotalStat("kick");
    const totalControl = getTotalStat("control");
    const totalTechnique = getTotalStat("technique");
    const totalAgility = getTotalStat("agility");
    const totalIntelligence = getTotalStat("intelligence");

    // 倍率
    const multiplier = (1 + focusBuff / 100) * (1 + justiceBuff / 100);

    // ★ 計算式：フォーカスAT = 1/2キック + コントロール + テクニック
    const rawAt = (totalKick / 2) + totalControl + totalTechnique;
    const focusAt = Math.floor(rawAt * multiplier);

    // ★ 計算式：フォーカスDF = 1/2アジリティ + インテリジェンス + テクニック
    // ※アジリティ(agility)をスピードとして使います
    const rawDf = (totalAgility / 2) + totalIntelligence + totalTechnique;
    const focusDf = Math.floor(rawDf * multiplier);

    return { focusAt, focusDf };
  };

  const { focusAt, focusDf } = calculateFocus();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ イナズマ計算機 Pro ⚡</h1>

      <div style={styles.mainGrid}>
        {/* 左カラム：入力エリア */}
        <div style={styles.column}>
          
          {/* ▼ キャラステータス入力 ▼ */}
          <div style={styles.card}>
            <h3 style={styles.h3}>👤 キャラのステータス</h3>
            <div style={styles.statGrid}>
              <label>キック <input type="number" value={stats.kick} onChange={(e)=>setStats({...stats, kick: +e.target.value})} style={styles.input} /></label>
              <label>コント <input type="number" value={stats.control} onChange={(e)=>setStats({...stats, control: +e.target.value})} style={styles.input} /></label>
              <label>テクニ <input type="number" value={stats.technique} onChange={(e)=>setStats({...stats, technique: +e.target.value})} style={styles.input} /></label>
              <label>スピ (AGI) <input type="number" value={stats.agility} onChange={(e)=>setStats({...stats, agility: +e.target.value})} style={styles.input} /></label>
              <label>賢さ (INT) <input type="number" value={stats.intelligence} onChange={(e)=>setStats({...stats, intelligence: +e.target.value})} style={styles.input} /></label>
            </div>
          </div>

          {/* ▼ 装備選択（カテゴリ別） ▼ */}
          <div style={styles.card}>
            <h3 style={styles.h3}>🛡️ 装備選択</h3>
            
            <div style={styles.selectRow}>
              <label>👟 シューズ</label>
              <select style={styles.select} value={shoesId} onChange={(e) => setShoesId(e.target.value)}>
                <option value="">なし</option>
                {/* DBのcategoryが「シューズ」のアイテムだけ表示 */}
                {getItemsByCategory("シューズ").map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.selectRow}>
              <label>📿 ミサンガ</label>
              <select style={styles.select} value={misangaId} onChange={(e) => setMisangaId(e.target.value)}>
                <option value="">なし</option>
                {getItemsByCategory("ミサンガ").map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.selectRow}>
              <label>🏅 ペンダント</label>
              <select style={styles.select} value={pendantId} onChange={(e) => setPendantId(e.target.value)}>
                <option value="">なし</option>
                {getItemsByCategory("ペンダント").map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.selectRow}>
              <label>🧤 スペシャル</label>
              <select style={styles.select} value={specialId} onChange={(e) => setSpecialId(e.target.value)}>
                <option value="">なし</option>
                {/* ユーザー様の言う「スペシャル」カテゴリでフィルタ */}
                {getItemsByCategory("スペシャル").map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ▼ バフ入力 ▼ */}
          <div style={{...styles.card, background: "#fffbf0"}}>
            <h3 style={styles.h3}>⚙️ 補正</h3>
            <div style={{display:'flex', gap:'10px'}}>
              <label>Fバフ% <input type="number" value={focusBuff} onChange={(e)=>setFocusBuff(+e.target.value)} style={{...styles.input, width:'60px'}} /></label>
              <label>正義% <input type="number" value={justiceBuff} onChange={(e)=>setJusticeBuff(+e.target.value)} style={{...styles.input, width:'60px'}} /></label>
            </div>
          </div>

        </div>

        {/* 右カラム：結果表示エリア */}
        <div style={styles.column}>
          <div style={styles.resultContainer}>
            
            {/* AT 結果 */}
            <div style={{...styles.resultBox, borderColor: "#ff4d4d", color: "#ff4d4d"}}>
              <div style={styles.resultLabel}>⚔️ フォーカス AT</div>
              <div style={styles.resultValue}>{focusAt}</div>
              <div style={styles.resultSub}>1/2キック + コント + テクニ</div>
            </div>

            {/* DF 結果 */}
            <div style={{...styles.resultBox, borderColor: "#0070f3", color: "#0070f3"}}>
              <div style={styles.resultLabel}>🛡️ フォーカス DF</div>
              <div style={styles.resultValue}>{focusDf}</div>
              <div style={styles.resultSub}>1/2スピ + 賢さ + テクニ</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- コンパクトCSS ---
const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "10px", fontFamily: "sans-serif", color: "#333" },
  title: { textAlign: "center" as "center", color: "#ff8c00", fontSize: "20px", margin: "10px 0" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }, // 左右2列
  column: { display: "flex", flexDirection: "column" as "column", gap: "10px" },
  card: { padding: "10px", border: "1px solid #ddd", borderRadius: "6px", backgroundColor: "#fff" },
  h3: { margin: "0 0 8px 0", fontSize: "14px", borderBottom: "1px solid #eee" },
  // グリッド入力
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", fontSize: "12px" },
  input: { width: "100%", padding: "4px", border: "1px solid #ccc", borderRadius: "4px", textAlign: "right" as "right" },
  // セレクト
  selectRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", fontSize: "13px" },
  select: { width: "70%", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" },
  // 結果エリア
  resultContainer: { display: "flex", flexDirection: "column" as "column", gap: "10px", height: "100%" },
  resultBox: { flex: 1, border: "2px solid #ccc", borderRadius: "8px", display: "flex", flexDirection: "column" as "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  resultLabel: { fontSize: "16px", fontWeight: "bold" },
  resultValue: { fontSize: "40px", fontWeight: "bold", margin: "5px 0" },
  resultSub: { fontSize: "10px", color: "#888" },
};
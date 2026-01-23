"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase設定
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  // --- 1. 装備データと選択状態 ---
  const [items, setItems] = useState<any[]>([]);
  const [equips, setEquips] = useState({ shoes: "", misanga: "", pendant: "", special: "" });

  // --- 2. キャラのステータス入力 (素, ボード, ビーンズ) ---
  // [Kick, Control, Technique, Agility(Speed), Intelligence]
  const [stats, setStats] = useState({
    kick: { base: 0, board: 0, beans: 0 },
    control: { base: 0, board: 0, beans: 0 },
    technique: { base: 0, board: 0, beans: 0 },
    agility: { base: 0, board: 0, beans: 0 },
    intelligence: { base: 0, board: 0, beans: 0 },
  });

  // --- 3. バフ ---
  const [buffs, setBuffs] = useState({ focus: 0, justice: 0 });

  // 起動時にデータを取得
  useEffect(() => {
    supabase.from("equipment").select("*").then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  // --- 計算ロジック ---
  // 指定したステータスの「キャラ合計 + 装備合計」を出す関数
  const getStatTotal = (statKey: string, charStat: any) => {
    // キャラの合計
    const charTotal = (charStat.base || 0) + (charStat.board || 0) + (charStat.beans || 0);
    
    // 装備の合計 (選んでいる4つ全ての数値を足す)
    let equipTotal = 0;
    Object.values(equips).forEach(id => {
      const item = items.find(i => i.id.toString() === id);
      if (item) equipTotal += (item[statKey] || 0);
    });

    return charTotal + equipTotal;
  };

  // 最終フォーカス値の計算
  const calcResults = () => {
    // 各ステータスの総合計を計算
    const k = getStatTotal("kick", stats.kick);
    const c = getStatTotal("control", stats.control);
    const t = getStatTotal("technique", stats.technique);
    const a = getStatTotal("agility", stats.agility);      // これをスピード/瞬発力として使う
    const i = getStatTotal("intelligence", stats.intelligence); // これをインテリジェンスとして使う

    // 倍率 (1.1倍とか)
    const multiplier = (1 + buffs.focus / 100) * (1 + buffs.justice / 100);

    // ★ AT計算: (キック/2 + コントロール + テクニック) × 倍率
    const at = Math.floor( ((k / 2) + c + t) * multiplier );

    // ★ DF計算: (スピード/2 + インテリ + テクニック) × 倍率
    const df = Math.floor( ((a / 2) + i + t) * multiplier );

    return { at, df };
  };

  const { at, df } = calcResults();

  // --- 見た目 (コンパクトな表形式) ---
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "10px", fontFamily: "sans-serif", color: "#333" }}>
      <h1 style={{ textAlign: "center", fontSize: "20px", color: "#ff8c00", margin: "10px 0" }}>⚡ イナズマ計算機 ⚡</h1>

      {/* ▼ 1. ステータス入力 (表でスッキリ) ▼ */}
      <div style={styles.box}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd", color: "#666" }}>
              <th style={{textAlign:"left"}}>項目</th>
              <th>Lv99</th>
              <th>ボ</th>
              <th>ビ</th>
              <th>計</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "キック", key: "kick" },
              { label: "コントロ", key: "control" },
              { label: "テクニ", key: "technique" },
              { label: "瞬発(AGI)", key: "agility" },
              { label: "インテリ", key: "intelligence" }, // ★ここを変更しました！
            ].map((row) => (
              <tr key={row.key}>
                <td style={{ fontWeight: "bold", padding: "4px" }}>{row.label}</td>
                {["base", "board", "beans"].map((type) => (
                  <td key={type} style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      // @ts-ignore
                      value={stats[row.key][type] || ""}
                      // @ts-ignore
                      onChange={(e) => setStats({ ...stats, [row.key]: { ...stats[row.key], [type]: +e.target.value } })}
                      style={styles.miniInput}
                    />
                  </td>
                ))}
                {/* 合計表示列 */}
                {/* @ts-ignore */}
                <td style={{ textAlign: "center", fontWeight: "bold", color: "#0070f3" }}>
                  {/* @ts-ignore */}
                  {(stats[row.key].base||0) + (stats[row.key].board||0) + (stats[row.key].beans||0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ▼ 2. 装備 & バフ (横並びで省スペース) ▼ */}
      <div style={{ ...styles.box, display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "flex-start" }}>
        
        {/* 装備選択 */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={styles.label}>🛡️ 装備</div>
          {["shoes", "misanga", "pendant", "special"].map((cat) => (
            <select key={cat} value={equips[cat as keyof typeof equips]} onChange={(e) => setEquips({ ...equips, [cat]: e.target.value })} style={styles.select}>
              <option value="">-- {cat} --</option>
              {items.filter(i => 
                // カテゴリ分け（日本語対応）
                (cat==="shoes" && i.category==="シューズ") ||
                (cat==="misanga" && i.category==="ミサンガ") ||
                (cat==="pendant" && i.category==="ペンダント") ||
                (cat==="special" && i.category==="スペシャル")
              ).map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          ))}
        </div>

        {/* バフ入力 */}
        <div style={{ flex: 1, minWidth: "150px", backgroundColor: "#fffbf0", padding: "5px", borderRadius: "5px" }}>
          <div style={styles.label}>⚙️ 補正 (%)</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
            <span>Fバフ:</span>
            <input type="number" value={buffs.focus} onChange={(e) => setBuffs({ ...buffs, focus: +e.target.value })} style={styles.buffInput} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>正義 :</span>
            <input type="number" value={buffs.justice} onChange={(e) => setBuffs({ ...buffs, justice: +e.target.value })} style={styles.buffInput} />
          </div>
        </div>
      </div>

      {/* ▼ 3. 結果表示 ▼ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
        <div style={{ ...styles.resBox, borderColor: "#ff4d4d", color: "#ff4d4d" }}>
          <div style={{ fontSize: "14px" }}>⚔️ AT</div>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{at}</div>
        </div>
        <div style={{ ...styles.resBox, borderColor: "#0070f3", color: "#0070f3" }}>
          <div style={{ fontSize: "14px" }}>🛡️ DF</div>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{df}</div>
        </div>
      </div>

    </div>
  );
}

// 最小限のスタイル
const styles = {
  box: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff", marginBottom: "10px" },
  miniInput: { width: "40px", padding: "4px", textAlign: "center" as "center", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" },
  buffInput: { width: "50px", padding: "4px", textAlign: "right" as "right", border: "1px solid #orange", borderRadius: "4px" },
  select: { width: "100%", padding: "5px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" },
  label: { fontSize: "12px", fontWeight: "bold", marginBottom: "5px", color: "#555" },
  resBox: { border: "2px solid #ccc", borderRadius: "8px", padding: "10px", textAlign: "center" as "center", backgroundColor: "#fff" },
};
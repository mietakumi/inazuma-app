"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase設定
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [equips, setEquips] = useState({ shoes: "", misanga: "", pendant: "", special: "" });

  // ステータス入力 (Kick, Control, Technique, Agility, Intelligence)
  const [stats, setStats] = useState({
    kick: { base: 0, board: 0, beans: 0 },
    control: { base: 0, board: 0, beans: 0 },
    technique: { base: 0, board: 0, beans: 0 },
    agility: { base: 0, board: 0, beans: 0 },
    intelligence: { base: 0, board: 0, beans: 0 },
  });

  const [buffs, setBuffs] = useState({ focus: 0, justice: 0 });

  useEffect(() => {
    supabase.from("equipment").select("*").then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const getStatTotal = (statKey: string, charStat: any) => {
    const charTotal = (charStat.base || 0) + (charStat.board || 0) + (charStat.beans || 0);
    let equipTotal = 0;
    Object.values(equips).forEach(id => {
      const item = items.find(i => i.id.toString() === id);
      if (item) equipTotal += (item[statKey] || 0);
    });
    return charTotal + equipTotal;
  };

  const calcResults = () => {
    const k = getStatTotal("kick", stats.kick);
    const c = getStatTotal("control", stats.control);
    const t = getStatTotal("technique", stats.technique);
    const a = getStatTotal("agility", stats.agility);      // スピード/瞬発力
    const i = getStatTotal("intelligence", stats.intelligence); // インテリジェンス

    const multiplier = (1 + buffs.focus / 100) * (1 + buffs.justice / 100);

    // AT: (1/2キック + コントロール + テクニック) × 倍率
    const at = Math.floor( ((k / 2) + c + t) * multiplier );

    // DF: (1/2スピード + インテリ + テクニック) × 倍率
    const df = Math.floor( ((a / 2) + i + t) * multiplier );

    return { at, df };
  };

  const { at, df } = calcResults();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "10px", fontFamily: "sans-serif", color: "#333" }}>
      <h1 style={{ textAlign: "center", fontSize: "20px", color: "#ff8c00", margin: "10px 0" }}>⚡ イナズマ計算機 ⚡</h1>

      {/* ▼ 1. ステータス入力 (日本語でわかりやすく！) ▼ */}
      <div style={styles.box}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            {/* ここを修正しました！略語なし！ */}
            <tr style={{ borderBottom: "1px solid #ddd", color: "#666" }}>
              <th style={{textAlign:"left", paddingBottom:"5px"}}>項目</th>
              <th style={{paddingBottom:"5px"}}>Lv99実数値</th>
              <th style={{paddingBottom:"5px"}}>ボード</th>
              <th style={{paddingBottom:"5px"}}>ビーンズ</th>
              <th style={{paddingBottom:"5px"}}>合計</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "キック", key: "kick" },
              { label: "コントロール", key: "control" },
              { label: "テクニック", key: "technique" },
              { label: "スピード", key: "agility" },
              { label: "インテリ", key: "intelligence" },
            ].map((row) => (
              <tr key={row.key}>
                <td style={{ fontWeight: "bold", padding: "6px 2px" }}>{row.label}</td>
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
                {/* 合計表示 */}
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

      {/* ▼ 2. 装備 & バフ ▼ */}
      <div style={{ ...styles.box, display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "flex-start" }}>
        
        {/* 装備選択 */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={styles.label}>🛡️ 装備選択</div>
          {["shoes", "misanga", "pendant", "special"].map((cat) => (
            <select key={cat} value={equips[cat as keyof typeof equips]} onChange={(e) => setEquips({ ...equips, [cat]: e.target.value })} style={styles.select}>
              <option value="">-- {cat==="shoes"?"シューズ": cat==="misanga"?"ミサンガ": cat==="pendant"?"ペンダント": "スペシャル"} --</option>
              {items.filter(i => 
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
        <div style={{ flex: 1, minWidth: "150px", backgroundColor: "#fffbf0", padding: "10px", borderRadius: "5px" }}>
          <div style={styles.label}>⚙️ 補正オプション</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{fontSize:"12px"}}>フォーカスバフ</span>
            <div>
              <input type="number" value={buffs.focus} onChange={(e) => setBuffs({ ...buffs, focus: +e.target.value })} style={styles.buffInput} />
              <span style={{fontSize:"12px"}}>%</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{fontSize:"12px"}}>正義バフ</span>
            <div>
              <input type="number" value={buffs.justice} onChange={(e) => setBuffs({ ...buffs, justice: +e.target.value })} style={styles.buffInput} />
              <span style={{fontSize:"12px"}}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ▼ 3. 結果表示 ▼ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
        <div style={{ ...styles.resBox, borderColor: "#ff4d4d", color: "#ff4d4d" }}>
          <div style={{ fontSize: "14px" }}>⚔️ フォーカス AT</div>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{at}</div>
        </div>
        <div style={{ ...styles.resBox, borderColor: "#0070f3", color: "#0070f3" }}>
          <div style={{ fontSize: "14px" }}>🛡️ フォーカス DF</div>
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>{df}</div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  box: { padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff", marginBottom: "15px" },
  miniInput: { width: "50px", padding: "6px", textAlign: "center" as "center", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" },
  buffInput: { width: "50px", padding: "4px", textAlign: "right" as "right", border: "1px solid #orange", borderRadius: "4px", marginRight: "3px" },
  select: { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "13px" },
  label: { fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: "#555", borderBottom: "1px solid #eee", paddingBottom: "4px" },
  resBox: { border: "2px solid #ccc", borderRadius: "8px", padding: "15px", textAlign: "center" as "center", backgroundColor: "#fff" },
};
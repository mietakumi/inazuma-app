"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Equipment,
  Stats,
  EquipmentSelection,
  Buffs,
  CalcResult,
} from "@/types";
import { StatInput } from "./StatInput";
import { EquipmentSelect } from "./EquipmentSelect";
import { BuffControl } from "./BuffControl";
import { ResultDisplay } from "./ResultDisplay";
import styles from "./calc.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CalcPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [equips, setEquips] = useState<EquipmentSelection>({
    shoes: "",
    misanga: "",
    pendant: "",
    special: "",
  });

  // ステータス入力 (Lv99, Board, Beans)
  const [stats, setStats] = useState<Stats>({
    kick: { base: 0, board: 0, beans: 0 },
    control: { base: 0, board: 0, beans: 0 },
    technique: { base: 0, board: 0, beans: 0 },
    agility: { base: 0, board: 0, beans: 0 },
    intelligence: { base: 0, board: 0, beans: 0 },
  });

  const [buffs, setBuffs] = useState<Buffs>({ focus: 0, justice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from("equipment")
          .select("*");

        if (supabaseError) {
          throw new Error(`データ取得エラー: ${supabaseError.message}`);
        }

        if (data) {
          setItems(data as Equipment[]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "不明なエラーが発生しました";
        setError(message);
        console.error("Equipment fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const getStatTotal = (
    statKey: keyof Stats,
    charStat: Stats[keyof Stats]
  ): number => {
    const charTotal = (charStat.base || 0) + (charStat.board || 0) + (charStat.beans || 0);
    let equipTotal = 0;
    Object.values(equips).forEach((id) => {
      const item = items.find((i) => i.id.toString() === id);
      if (item) {
        equipTotal += item[statKey] || 0;
      }
    });
    return charTotal + equipTotal;
  };

  const calcResults = (): CalcResult => {
    const k = getStatTotal("kick", stats.kick);
    const c = getStatTotal("control", stats.control);
    const t = getStatTotal("technique", stats.technique);
    const a = getStatTotal("agility", stats.agility);
    const i = getStatTotal("intelligence", stats.intelligence);

    const multiplier = (1 + buffs.focus / 100) * (1 + buffs.justice / 100);

    // AT: (1/2キック + コントロール + テクニック) × 倍率
    const at = Math.floor(((k / 2) + c + t) * multiplier);
    // DF: (1/2スピード + インテリ + テクニック) × 倍率
    const df = Math.floor(((a / 2) + i + t) * multiplier);

    return { at, df };
  };

  const result = calcResults();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>⚡ フォーカス計算 ⚡</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {loading && (
        <div className={styles.loadingMessage}>装備データを読み込み中...</div>
      )}

      {/* ステータス入力 */}
      <StatInput stats={stats} onStatsChange={setStats} />

      {/* 装備 & バフ */}
      <div className={styles.box}>
        <div className={styles.equipmentBuffContainer}>
          <EquipmentSelect
            items={items}
            equips={equips}
            onEquipsChange={setEquips}
          />
          <BuffControl buffs={buffs} onBuffsChange={setBuffs} />
        </div>
      </div>

      {/* 結果表示 */}
      <ResultDisplay result={result} />
    </div>
  );
}
import { Equipment, Stats, EquipmentSelection, Buffs, StatValue } from "@/types";
import styles from "./calc.module.css";

interface StatInputProps {
  stats: Stats;
  onStatsChange: (stats: Stats) => void;
}

export function StatInput({ stats, onStatsChange }: StatInputProps) {
  const statLabels = [
    { label: "キック", key: "kick" as const },
    { label: "コントロール", key: "control" as const },
    { label: "テクニック", key: "technique" as const },
    { label: "スピード", key: "agility" as const },
    { label: "インテリ", key: "intelligence" as const },
  ];

  const handleStatChange = (
    statKey: keyof Stats,
    type: keyof StatValue,
    value: number
  ) => {
    onStatsChange({
      ...stats,
      [statKey]: {
        ...stats[statKey],
        [type]: value,
      },
    });
  };

  const getStatTotal = (statKey: keyof Stats) => {
    const stat = stats[statKey];
    return (stat.base || 0) + (stat.board || 0) + (stat.beans || 0);
  };

  return (
    <div className={styles.box}>
      <table className={styles.statsBox}>
        <thead>
          <tr>
            <th>項目</th>
            <th style={{ paddingBottom: "5px" }}>Lv99実数値</th>
            <th style={{ paddingBottom: "5px" }}>ボード</th>
            <th style={{ paddingBottom: "5px" }}>ビーンズ</th>
            <th style={{ paddingBottom: "5px" }}>合計</th>
          </tr>
        </thead>
        <tbody>
          {statLabels.map((row) => (
            <tr key={row.key}>
              <td style={{ fontWeight: "bold" }}>{row.label}</td>
              {["base", "board", "beans"].map((type) => (
                <td key={type} style={{ textAlign: "center" }}>
                  <input
                    type="number"
                    value={stats[row.key][type as keyof StatValue] || ""}
                    onChange={(e) =>
                      handleStatChange(
                        row.key,
                        type as keyof StatValue,
                        +e.target.value
                      )
                    }
                    className={styles.miniInput}
                  />
                </td>
              ))}
              <td>{getStatTotal(row.key)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

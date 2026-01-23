import { Buffs } from "@/types";
import styles from "./calc.module.css";

interface BuffControlProps {
  buffs: Buffs;
  onBuffsChange: (buffs: Buffs) => void;
}

export function BuffControl({ buffs, onBuffsChange }: BuffControlProps) {
  const handleBuffChange = (key: keyof Buffs, value: number) => {
    onBuffsChange({
      ...buffs,
      [key]: value,
    });
  };

  return (
    <div className={styles.buffSection}>
      <div className={styles.label}>⚙️ 補正オプション</div>
      <div className={styles.buffControl}>
        <span style={{ fontSize: "12px" }}>フォーカスバフ</span>
        <div>
          <input
            type="number"
            value={buffs.focus}
            onChange={(e) => handleBuffChange("focus", +e.target.value)}
            className={styles.buffInput}
          />
          <span style={{ fontSize: "12px" }}>%</span>
        </div>
      </div>
      <div className={styles.buffControl}>
        <span style={{ fontSize: "12px" }}>正義の鉄槌</span>
        <div>
          <input
            type="number"
            value={buffs.justice}
            onChange={(e) => handleBuffChange("justice", +e.target.value)}
            className={styles.buffInput}
          />
          <span style={{ fontSize: "12px" }}>%</span>
        </div>
      </div>
    </div>
  );
}

import { CalcResult } from "@/types";
import styles from "./calc.module.css";

interface ResultDisplayProps {
  result: CalcResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className={styles.resultGrid}>
      <div className={`${styles.resultBox} ${styles.resultBoxAt}`}>
        <div className={styles.resultLabel}>⚔️ フォーカス AT</div>
        <div className={styles.resultValue}>{result.at}</div>
      </div>
      <div className={`${styles.resultBox} ${styles.resultBoxDf}`}>
        <div className={styles.resultLabel}>🛡️ フォーカス DF</div>
        <div className={styles.resultValue}>{result.df}</div>
      </div>
    </div>
  );
}

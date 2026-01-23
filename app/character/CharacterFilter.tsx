import { Position, MainBuild } from "@/types";
import styles from "./character.module.css";

interface CharacterFilterProps {
  selectedPosition: Position | null;
  selectedBuild: MainBuild | null;
  onPositionChange: (position: Position | null) => void;
  onBuildChange: (build: MainBuild | null) => void;
  onReset: () => void;
}

const POSITIONS: Position[] = ["FW", "MF", "DF", "GK"];
const BUILDS: MainBuild[] = ["正義", "ラフ", "カウンター", "テンション", "キズナ", "ひっさつ"];

export function CharacterFilter({
  selectedPosition,
  selectedBuild,
  onPositionChange,
  onBuildChange,
  onReset,
}: CharacterFilterProps) {
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterGroup}>
        <div>
          <label className={styles.filterLabel}>ポジション</label>
          <div className={styles.filterOptions}>
            {POSITIONS.map((position) => (
              <button
                key={position}
                className={`${styles.filterButton} ${
                  selectedPosition === position ? styles.filterButtonActive : ""
                }`}
                onClick={() =>
                  onPositionChange(selectedPosition === position ? null : position)
                }
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <div style={{ width: "100%" }}>
          <label className={styles.filterLabel}>メインビルド</label>
          <div className={styles.filterOptions}>
            {BUILDS.map((build) => (
              <button
                key={build}
                className={`${styles.filterButton} ${
                  selectedBuild === build ? styles.filterButtonActive : ""
                }`}
                onClick={() =>
                  onBuildChange(selectedBuild === build ? null : build)
                }
              >
                {build}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(selectedPosition || selectedBuild) && (
        <button className={styles.resetButton} onClick={onReset}>
          フィルタをリセット
        </button>
      )}
    </div>
  );
}

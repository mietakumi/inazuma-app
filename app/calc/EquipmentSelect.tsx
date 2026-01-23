import { Equipment, EquipmentSelection } from "@/types";
import styles from "./calc.module.css";

interface EquipmentSelectProps {
  items: Equipment[];
  equips: EquipmentSelection;
  onEquipsChange: (equips: EquipmentSelection) => void;
}

export function EquipmentSelect({
  items,
  equips,
  onEquipsChange,
}: EquipmentSelectProps) {
  const categories = [
    { key: "shoes" as const, label: "シューズ", name: "シューズ" },
    { key: "misanga" as const, label: "ミサンガ", name: "ミサンガ" },
    { key: "pendant" as const, label: "ペンダント", name: "ペンダント" },
    { key: "special" as const, label: "スペシャル", name: "スペシャル" },
  ];

  const handleEquipChange = (key: keyof EquipmentSelection, value: string) => {
    onEquipsChange({
      ...equips,
      [key]: value,
    });
  };

  const getItemsByCategory = (categoryName: string) => {
    return items.filter((i) => i.category === categoryName);
  };

  return (
    <div className={styles.equipmentSection}>
      <div className={styles.label}>🛡️ 装備選択</div>
      {categories.map((cat) => (
        <select
          key={cat.key}
          value={equips[cat.key]}
          onChange={(e) => handleEquipChange(cat.key, e.target.value)}
          className={styles.select}
        >
          <option value="">-- {cat.label} --</option>
          {getItemsByCategory(cat.name).map((item) => (
            <option key={item.id} value={item.id.toString()}>
              {item.name}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

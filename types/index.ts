// Equipment型定義
export interface Equipment {
  id: number;
  name: string;
  category: 'シューズ' | 'ミサンガ' | 'ペンダント' | 'スペシャル';
  kick: number;
  control: number;
  technique: number;
  agility: number;
  intelligence: number;
}

// ステータス種別
export interface StatValue {
  base: number;
  board: number;
  beans: number;
}

// キャラクターステータス
export interface Stats {
  kick: StatValue;
  control: StatValue;
  technique: StatValue;
  agility: StatValue;
  intelligence: StatValue;
}

// 装備選択状態
export interface EquipmentSelection {
  shoes: string;
  misanga: string;
  pendant: string;
  special: string;
}

// バフ効果
export interface Buffs {
  focus: number;
  justice: number;
}

// 計算結果
export interface CalcResult {
  at: number;
  df: number;
}

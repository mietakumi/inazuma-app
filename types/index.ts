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

// キャラクター型定義
export type Position = 'FW' | 'MF' | 'DF' | 'GK';
export type MainBuild = '正義' | 'ラフ' | 'カウンター' | 'テンション' | 'キズナ' | 'ひっさつ';

export interface Character {
  id: number;
  name: string;
  character_id: number;
  position: Position;
  main_build: MainBuild;
  created_at: string;
}

// ステータスベンチマーク（アップデート時の最強キャラ情報）
export interface StatsBenchmark {
  id: number;
  position: Position;
  stat_type: 'kick' | 'control' | 'technique' | 'agility' | 'intelligence';
  benchmark_type: string;
  character_id: number;
  updated_at: string;
}

// キャラクター投稿
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface CharacterSubmission {
  id: number;
  name: string;
  character_id: number;
  position: Position;
  main_build: MainBuild;
  submitted_by: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

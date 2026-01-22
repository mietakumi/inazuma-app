'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// データ型定義
type Equipment = {
  id: number;
  name: string;
  type: string;
  kick: number;
  technique: number;
  control: number;
  pressure: number;
  physical: number;
  intelligence: number;
  agility: number;
};

// ステータスの種類
type StatType = 'kick' | 'control' | 'technique' | 'agility' | 'intelligence';

export default function Home() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  
  // 装備選択用
  const [selectedShoe, setSelectedShoe] = useState<string>('');
  const [selectedMisanga, setSelectedMisanga] = useState<string>('');
  const [selectedPendant, setSelectedPendant] = useState<string>('');
  const [selectedSpecial, setSelectedSpecial] = useState<string>('');

  // 手入力ステータス（素・ボード・ビーンズ）
  const [baseStats, setBaseStats] = useState({ kick: 0, control: 0, technique: 0, agility: 0, intelligence: 0 });
  const [boardStats, setBoardStats] = useState({ kick: 0, control: 0, technique: 0, agility: 0, intelligence: 0 });
  const [beanStats, setBeanStats] = useState({ kick: 0, control: 0, technique: 0, agility: 0, intelligence: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('equipment').select('*');
      if (data) setEquipments(data);
    };
    fetchData();
  }, []);

  // 装備ごとのリスト
  const shoesList = equipments.filter(e => e.type === 'シューズ');
  const misangaList = equipments.filter(e => e.type === 'ミサンガ' || e.type === 'バングル');
  const pendantList = equipments.filter(e => e.type === 'ペンダント');
  const specialList = equipments.filter(e => e.type === 'スペシャル');

  // 装備の合計値を計算
  const getEquipTotal = () => {
    const items = [
      equipments.find(e => e.id.toString() === selectedShoe),
      equipments.find(e => e.id.toString() === selectedMisanga),
      equipments.find(e => e.id.toString() === selectedPendant),
      equipments.find(e => e.id.toString() === selectedSpecial),
    ].filter(item => item !== undefined) as Equipment[];

    const total = { kick: 0, control: 0, technique: 0, agility: 0, intelligence: 0 };
    items.forEach(item => {
      total.kick += item.kick || 0;
      total.control += item.control || 0;
      total.technique += item.technique || 0;
      total.agility += item.agility || 0;
      total.intelligence += item.intelligence || 0;
    });
    return total;
  };

  const equipStats = getEquipTotal();

  // 全ての合計値（素＋ボード＋ビーンズ＋装備）
  const finalStats = {
    kick: baseStats.kick + boardStats.kick + beanStats.kick + equipStats.kick,
    control: baseStats.control + boardStats.control + beanStats.control + equipStats.control,
    technique: baseStats.technique + boardStats.technique + beanStats.technique + equipStats.technique,
    agility: baseStats.agility + boardStats.agility + beanStats.agility + equipStats.agility,
    intelligence: baseStats.intelligence + boardStats.intelligence + beanStats.intelligence + equipStats.intelligence,
  };

  // フォーカス値の計算
  const focusAT = Math.floor(finalStats.kick * 0.5) + finalStats.control + finalStats.technique;
  const focusDF = Math.floor(finalStats.agility * 0.5) + finalStats.intelligence + finalStats.technique;

  // 入力変更ハンドラ
  const handleInputChange = (type: 'base' | 'board' | 'bean', stat: StatType, val: string) => {
    const num = parseInt(val) || 0;
    if (type === 'base') setBaseStats(prev => ({ ...prev, [stat]: num }));
    if (type === 'board') setBoardStats(prev => ({ ...prev, [stat]: num }));
    if (type === 'bean') setBeanStats(prev => ({ ...prev, [stat]: num }));
  };

  // Wiki風デザイン設定
  const styles = {
    pageBackground: { backgroundColor: '#f4f5f7', minHeight: '100vh', padding: '20px', fontFamily: '"Meiryo", sans-serif', color: '#333' },
    mainContainer: { backgroundColor: '#fff', maxWidth: '850px', margin: '0 auto', border: '1px solid #ccc' },
    header: { padding: '20px', borderBottom: '1px solid #ddd', background: 'linear-gradient(to bottom, #fff, #f9f9f9)' },
    title: { fontSize: '22px', margin: 0, color: '#333', borderLeft: '6px solid #0056b3', paddingLeft: '12px' },
    section: { padding: '20px' },
    h2: { fontSize: '16px', borderLeft: '4px solid #dbebf9', borderBottom: '1px solid #dbebf9', padding: '6px 8px', background: '#f7faff', marginBottom: '15px', color: '#333', fontWeight: 'bold' },
    
    // フォーカス表示（Wikiの強調ボックス風）
    focusContainer: { display: 'flex', gap: '20px', marginBottom: '30px' },
    focusBox: { flex: 1, padding: '15px', border: '1px solid #ffcc00', background: '#fffbe6', borderRadius: '4px' },
    focusLabel: { fontSize: '12px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' },
    focusValue: { fontSize: '28px', fontWeight: 'bold', color: '#d32f2f' },

    selectGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' },
    
    // テーブルスタイル（Wiki風）
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px', marginBottom: '20px' },
    th: { border: '1px solid #ccc', background: '#eef5ff', padding: '8px', textAlign: 'center' as const, fontWeight: 'bold', color: '#444' },
    td: { border: '1px solid #ccc', padding: '8px', color: '#333', backgroundColor: '#fff', textAlign: 'center' as const },
    
    // 入力欄
    input: { width: '100%', maxWidth: '60px', padding: '4px', textAlign: 'center' as const, border: '1px solid #ddd', borderRadius: '2px' },
    totalText: { fontWeight: 'bold', color: '#0056b3', fontSize: '15px' },
    equipText: { color: '#888', fontSize: '12px' }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={{ maxWidth: '850px', margin: '0 auto 5px', color: '#666', fontSize: '11px' }}>
        Home &gt; ツール &gt; 装備シミュレーター
      </div>

      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>装備構成シミュレーター</h1>
        </div>

        <div style={styles.section}>
          
          <div style={styles.focusContainer}>
            <div style={styles.focusBox}>
              <span style={styles.focusLabel}>⚔️ FOCUS AT (攻撃)</span>
              <span style={styles.focusValue}>{focusAT}</span>
            </div>
            <div style={styles.focusBox}>
              <span style={styles.focusLabel}>🛡️ FOCUS DF (守備)</span>
              <span style={styles.focusValue}>{focusDF}</span>
            </div>
          </div>

          <h2 style={styles.h2}>装備選択</h2>
          <div style={styles.selectGrid}>
            <WikiSelect label="👟 シューズ" options={shoesList} value={selectedShoe} onChange={setSelectedShoe} />
            <WikiSelect label="📿 ミサンガ" options={misangaList} value={selectedMisanga} onChange={setSelectedMisanga} />
            <WikiSelect label="🏅 ペンダント" options={pendantList} value={selectedPendant} onChange={setSelectedPendant} />
            <WikiSelect label="⭐ スペシャル" options={specialList} value={selectedSpecial} onChange={setSelectedSpecial} />
          </div>

          <h2 style={styles.h2}>ステータス詳細計算</h2>
          <p style={{ fontSize: '12px', marginBottom: '10px' }}>※「素」「ボード」「ビーンズ」の値を入力してください。</p>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>ステータス</th>
                <th style={{ width: '15%' }}>素</th>
                <th style={{ width: '15%' }}>ボード</th>
                <th style={{ width: '15%' }}>ビーンズ</th>
                <th style={{ width: '15%' }}>装備補正</th>
                <th style={{ width: '15%', background: '#f0f8ff' }}>合計</th>
              </tr>
            </thead>
            <tbody>
              <InputRow label="キック" statKey="kick" 
                base={baseStats} board={boardStats} bean={beanStats} equip={equipStats} onChange={handleInputChange} styles={styles} />
              <InputRow label="コントロール" statKey="control" 
                base={baseStats} board={boardStats} bean={beanStats} equip={equipStats} onChange={handleInputChange} styles={styles} />
              <InputRow label="テクニック" statKey="technique" 
                base={baseStats} board={boardStats} bean={beanStats} equip={equipStats} onChange={handleInputChange} styles={styles} />
              <InputRow label="アジリティ" statKey="agility" 
                base={baseStats} board={boardStats} bean={beanStats} equip={equipStats} onChange={handleInputChange} styles={styles} />
              <InputRow label="インテリジェンス" statKey="intelligence" 
                base={baseStats} board={boardStats} bean={beanStats} equip={equipStats} onChange={handleInputChange} styles={styles} />
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

// 部品：Wiki風セレクトボックス
const WikiSelect = ({ label, options, value, onChange }: any) => {
  // 名前 + ステータス表示
  const formatName = (item: Equipment) => {
    const stats = [];
    if (item.kick) stats.push(`K+${item.kick}`);
    if (item.control) stats.push(`C+${item.control}`);
    if (item.technique) stats.push(`T+${item.technique}`);
    if (item.agility) stats.push(`A+${item.agility}`);
    if (item.intelligence) stats.push(`I+${item.intelligence}`);
    return stats.length > 0 ? `${item.name} (${stats.join(' ')})` : item.name;
  };

  return (
    <div style={{ background: '#f9f9f9', border: '1px solid #ddd', padding: '8px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px', color: '#0056b3' }}>{label}</div>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '4px', border: '1px solid #ccc', fontSize: '12px', background: '#fff', color: '#333' }}
      >
        <option value="">(装備なし)</option>
        {options.map((item: Equipment) => (
          <option key={item.id} value={item.id}>{formatName(item)}</option>
        ))}
      </select>
    </div>
  );
};

// 部品：入力行
const InputRow = ({ label, statKey, base, board, bean, equip, onChange, styles }: any) => {
  const total = (base[statKey] || 0) + (board[statKey] || 0) + (bean[statKey] || 0) + (equip[statKey] || 0);
  const equipVal = equip[statKey];

  return (
    <tr>
      <th style={styles.th}>{label}</th>
      <td style={styles.td}>
        <input type="number" value={base[statKey] || ''} onChange={(e) => onChange('base', statKey, e.target.value)} style={styles.input} placeholder="0" />
      </td>
      <td style={styles.td}>
        <input type="number" value={board[statKey] || ''} onChange={(e) => onChange('board', statKey, e.target.value)} style={styles.input} placeholder="0" />
      </td>
      <td style={styles.td}>
        <input type="number" value={bean[statKey] || ''} onChange={(e) => onChange('bean', statKey, e.target.value)} style={{...styles.input, borderColor: '#ffcc00', background: '#fffff0'}} placeholder="0" />
      </td>
      <td style={styles.td}>
        {equipVal > 0 ? <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>+{equipVal}</span> : <span style={{ color: '#ccc' }}>-</span>}
      </td>
      <td style={{ ...styles.td, background: '#f0f8ff' }}>
        <span style={styles.totalText}>{total}</span>
      </td>
    </tr>
  );
};
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* パンくずリスト */}
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        <span style={{color: '#900'}}>⌂</span> &gt; ホーム
      </div>

      {/* ページタイトル */}
      <h1 style={styles.pageTitle}>ホーム</h1>
      <div style={styles.metaInfo}>Last-modified: {new Date().toLocaleDateString()}</div>

      {/* お知らせエリア */}
      <div style={styles.section}>
        <h2 style={styles.h2}>お知らせ</h2>
        <ul style={styles.ul}>
          {/* ▼▼▼ ここを追加しました ▼▼▼ */}
          <li>2026-01-23: ツール名を<strong>「フォーカス計算」</strong>に変更し、バフ補正機能とステータス詳細入力(Lv99/ボード/ビーンズ)を追加しました。🆕</li>
          
          <li>2026-01-22: サイトを開設しました。</li>
          <li>2026-01-22: <Link href="/focus" style={styles.link}>装備シミュレーター</Link>を公開しました。</li>
        </ul>
      </div>

      {/* メニューエリア */}
      <div style={styles.section}>
        <h2 style={styles.h2}>ツール一覧</h2>
        <div style={styles.grid}>
          
          {/* ▼▼▼ リンク先と名前を変更しました ▼▼▼ */}
          <Link href="/focus" style={styles.card}>
            <div style={styles.cardHeader}>⚡ フォーカス計算</div>
            <div style={styles.cardBody}>
              <p>
                キャラステータスと装備を組み合わせて、最終的なAT/DF値を算出するツール。<br/>
                <span style={{color:"#d35400", fontWeight:"bold"}}>※バフ補正・詳細入力に対応</span>
              </p>
            </div>
          </Link>

          <div style={{...styles.card, opacity: 0.6}}>
            <div style={{...styles.cardHeader, background: '#ccc'}}>準備中...</div>
            <div style={styles.cardBody}>
              <p>キャラクター名鑑などのコンテンツを準備中です。</p>
            </div>
          </div>

        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.h2}>当サイトについて</h2>
        <p style={{fontSize: '13px', lineHeight: '1.6'}}>
          イナズマイレブンの攻略情報をまとめるWiki風サイトです。<br/>
          どなたでもツールの利用が可能です。
        </p>
      </div>

    </div>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '5px', color: '#333' },
  metaInfo: { fontSize: '10px', color: '#999', textAlign: 'right' as const, marginBottom: '20px' },
  
  section: { marginBottom: '30px' },
  h2: { fontSize: '16px', background: '#eef5ff', borderLeft: '5px solid #004080', padding: '5px 10px', marginBottom: '10px', color: '#333', fontWeight: 'bold' },
  ul: { fontSize: '13px', lineHeight: '1.8' },
  link: { color: '#004080', textDecoration: 'underline' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' },
  card: { border: '1px solid #ccc', textDecoration: 'none', color: '#333', display: 'block', background: '#fff' },
  cardHeader: { background: '#004080', color: '#fff', padding: '5px 10px', fontSize: '13px', fontWeight: 'bold' },
  cardBody: { padding: '10px', fontSize: '12px' }
};
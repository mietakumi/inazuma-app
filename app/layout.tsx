import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'イナズマツールWiki',
  description: 'イナズマイレブン攻略支援ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={styles.body}>
        {/* 1. 一番上の黒いバー */}
        <header style={styles.topBar}>
          <div style={styles.topBarInner}>
            <Link href="/" style={styles.logo}>⚡ イナズマツールWiki*</Link>
            <div style={styles.topLinks}>
              <span style={styles.topLink}>新規</span>
              <span style={styles.topLink}>編集</span>
              <span style={styles.topLink}>添付</span>
            </div>
            <div style={styles.searchBox}>
              <input type="text" placeholder="サイト内検索" style={styles.searchInput} />
              <button style={styles.searchBtn}>検索</button>
            </div>
          </div>
        </header>

        {/* 2. メインエリア（左サイドバー ＋ 右コンテンツ） */}
        <div style={styles.container}>
          
          {/* 左サイドバー */}
          <aside style={styles.sidebar}>
            
            {/* メニューボックス1 */}
            <div style={styles.sideBox}>
              <div style={styles.sideTitle}>メニュー</div>
              <ul style={styles.sideList}>
                <li><Link href="/" style={styles.sideLink}>ホーム</Link></li>
                <li><Link href="/calc" style={styles.sideLink}>装備シミュレーター</Link></li>
              </ul>
            </div>

            {/* メニューボックス2 */}
            <div style={styles.sideBox}>
              <div style={styles.sideTitle}>掲示板</div>
              <ul style={styles.sideList}>
                <li><span style={styles.sideText}>雑談掲示板</span></li>
                <li><span style={styles.sideText}>質問掲示板</span></li>
              </ul>
            </div>

            {/* メニューボックス3 */}
            <div style={styles.sideBox}>
              <div style={styles.sideTitle}>最新の10件</div>
              <div style={{fontSize: '12px', color: '#666', lineHeight: '1.4'}}>
                2026-01-22<br/>
                <Link href="/calc" style={styles.sideLink}>装備シミュレーター</Link><br/>
                2026-01-21<br/>
                <Link href="/" style={styles.sideLink}>ホーム</Link><br/>
              </div>
            </div>

          </aside>

          {/* 右メインコンテンツ（ここがページごとに変わる） */}
          <main style={styles.main}>
            {children}
          </main>

        </div>
        
        {/* フッター */}
        <footer style={styles.footer}>
          &copy; 2026 Inazuma Tools Wiki.
        </footer>
      </body>
    </html>
  );
}

// Wiki風デザイン（WIKIWIKI.jp風）
const styles = {
  body: { margin: 0, background: '#f4f5f7', fontFamily: '"Meiryo", "Hiragino Kaku Gothic ProN", sans-serif', color: '#333' },
  // トップバー
  topBar: { background: '#000', borderBottom: '1px solid #333', color: '#fff', padding: '0 10px' },
  topBarInner: { maxWidth: '1200px', margin: '0 auto', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' },
  logo: { color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px', marginRight: '20px' },
  topLinks: { display: 'flex', gap: '15px', color: '#ccc' },
  topLink: { cursor: 'pointer' },
  searchBox: { display: 'flex' },
  searchInput: { padding: '2px 5px', border: '1px solid #666', fontSize: '12px' },
  searchBtn: { padding: '2px 8px', background: '#eee', border: '1px solid #999', cursor: 'pointer', fontSize: '12px' },

  // レイアウト枠
  container: { display: 'flex', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  
  // サイドバー
  sidebar: { width: '250px', padding: '15px', background: '#f0f0f0', borderRight: '1px solid #ddd', flexShrink: 0 },
  sideBox: { marginBottom: '20px', background: '#fff', border: '1px solid #ccc', padding: '5px' },
  sideTitle: { background: '#333', color: '#fff', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' as const, marginBottom: '5px' },
  sideList: { listStyle: 'none', padding: '0 0 0 10px', margin: 0, fontSize: '13px' },
  sideLink: { color: '#004080', textDecoration: 'none' },
  sideText: { color: '#666', cursor: 'not-allowed' },

  // メインエリア
  main: { flex: 1, padding: '20px', overflow: 'hidden' }, // overflowで横はみ出し防止
  
  // フッター
  footer: { textAlign: 'center' as const, padding: '10px', fontSize: '11px', color: '#666', background: '#f4f5f7' }
};
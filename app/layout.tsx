import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "イナズマツールWiki*",
  description: "イナズマイレブン攻略・ツールサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ▼▼▼ スマホ対応のための魔法のスタイル ▼▼▼ */}
        <style>{`
          /* 基本（PC）は横並び */
          .layout-container {
            display: flex;
            max-width: 1200px;
            margin: 0 auto;
            align-items: flex-start;
          }
          .sidebar {
            width: 250px;
            flex-shrink: 0;
            padding: 10px;
            background: #f4f4f4;
          }
          .main-content {
            flex-grow: 1;
            padding: 20px;
            min-width: 0;
          }

          /* スマホ向けのルール（画面が狭いときは縦並びにする） */
          @media (max-width: 768px) {
            .layout-container {
              flex-direction: column; /* 縦に積む */
            }
            .sidebar {
              width: 100%; /* 横幅いっぱいに */
              margin-bottom: 20px;
            }
            .main-content {
              padding: 10px;
            }
          }
        `}</style>
      </head>
      <body className={inter.className} style={{ margin: 0, backgroundColor: "#fff", color: "#333" }}>
        
        {/* ヘッダー */}
        <header style={{ backgroundColor: "#000", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            ⚡ イナズマツールWiki*
          </div>
          <div style={{ fontSize: "12px", display: "flex", gap: "10px" }}>
            <span>新規</span> <span>編集</span> <span>添付</span>
          </div>
        </header>

        {/* メインレイアウト */}
        <div className="layout-container">
          
          {/* 左サイドバー */}
          <aside className="sidebar">
            <div style={styles.menuBox}>
              <div style={styles.menuHeader}>メニュー</div>
              <ul style={styles.menuList}>
                <li><Link href="/">ホーム</Link></li>
                {/* リンク先も正しく /calc になっています */}
                <li><Link href="/calc">フォーカス計算</Link></li>
              </ul>
            </div>

            <div style={styles.menuBox}>
              <div style={styles.menuHeader}>最新の10件</div>
              <ul style={{...styles.menuList, fontSize: "11px", color: "#666"}}>
                <li>2026-01-23<br/><span style={{color:"#0056b3"}}>フォーカス計算</span></li>
                <li>2026-01-22<br/><span style={{color:"#0056b3"}}>ホーム</span></li>
              </ul>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="main-content">
            {children}
          </main>
        
        </div>
      </body>
    </html>
  );
}

const styles = {
  menuBox: { marginBottom: "15px", backgroundColor: "#fff", border: "1px solid #ddd" },
  menuHeader: { backgroundColor: "#333", color: "#fff", padding: "5px 10px", fontSize: "12px", fontWeight: "bold", textAlign: "center" as "center" },
  menuList: { listStyle: "none", padding: "10px", margin: 0, fontSize: "13px", lineHeight: "1.6" },
};
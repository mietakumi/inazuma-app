import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* パンくずリスト */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbIcon}>⌂</span> &gt; ホーム
      </div>

      {/* ページタイトル */}
      <h1 className={styles.pageTitle}>ホーム</h1>
      <div className={styles.metaInfo}>Last-modified: {new Date().toLocaleDateString()}</div>

      {/* お知らせエリア */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>お知らせ</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>2026-01-23: ツール名を<strong>「フォーカス計算」</strong>に変更し、機能を追加しました。🆕</li>
          <li className={styles.listItem}>2026-01-22: サイトを開設しました。</li>
          <li className={styles.listItem}>2026-01-22: <Link href="/calc" className={styles.link}>フォーカス計算ツール</Link>を公開しました。</li>
        </ul>
      </div>

      {/* メニューエリア */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>ツール一覧</h2>
        <div className={styles.grid}>
          <Link href="/calc" className={styles.card}>
            <div className={styles.cardHeader}>⚡ フォーカス計算</div>
            <div className={styles.cardBody}>
              <p>
                キャラステータスと装備を組み合わせて、最終的なAT/DF値を算出するツール。<br/>
                <span className={styles.highlightText}>※バフ補正・詳細入力に対応</span>
              </p>
            </div>
          </Link>

          <div className={`${styles.card} ${styles.cardDisabled}`}>
            <div className={`${styles.cardHeader} ${styles.cardDisabledHeader}`}>準備中...</div>
            <div className={styles.cardBody}>
              <p>キャラクター名鑑などのコンテンツを準備中です。</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>当サイトについて</h2>
        <p className={styles.descriptionText}>
          イナズマイレブンの攻略情報をまとめるWiki風サイトです。<br/>
          どなたでもツールの利用が可能です。
        </p>
      </div>
    </div>
  );
}
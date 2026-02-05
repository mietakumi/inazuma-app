"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CharacterSubmission, SubmissionStatus } from "@/types";
import styles from "./admin.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// 環境変数からパスキーを取得（公開キーなので、実際には別の認証方法を推奨）
const ADMIN_PASSKEY = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<CharacterSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] =
    useState<CharacterSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">(
    "pending"
  );
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError(null);

    if (passkey === ADMIN_PASSKEY) {
      setAuthenticated(true);
      setPasskey("");
      fetchSubmissions();
    } else {
      setPasskeyError("パスキーが正しくありません");
      setPasskey("");
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("character_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(`データ取得エラー: ${supabaseError.message}`);
      }

      if (data) {
        setSubmissions(data as CharacterSubmission[]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // フィルタリング
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(
        submissions.filter((s) => s.status === filterStatus)
      );
    }
  }, [submissions, filterStatus]);

  const handleApprove = async (id: number, submission: CharacterSubmission) => {
    setActionLoading(id);
    try {
      // submissions テーブルを pending→approved に更新
      const { error: updateError } = await supabase
        .from("character_submissions")
        .update({ status: "approved" })
        .eq("id", id);

      if (updateError) {
        throw new Error(`更新エラー: ${updateError.message}`);
      }

      // characters テーブルに追加（重複チェック）
      const existingChar = await supabase
        .from("character_data")
        .select("id")
        .eq("character_id", submission.character_id)
        .single();

      if (existingChar.data) {
        // 既存キャラの場合は更新
        await supabase
          .from("character_data")
          .update({
            name: submission.name,
            position: submission.position,
            main_build: submission.main_build,
          })
          .eq("id", existingChar.data.id);
      } else {
        // 新規キャラの場合は追加
        await supabase.from("character_data").insert({
          name: submission.name,
          character_id: submission.character_id,
          position: submission.position,
          main_build: submission.main_build,
        });
      }

      // ローカル状態を更新
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
      );
    } catch (err) {
      console.error("Approve error:", err);
      alert("承認処理に失敗しました");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("character_submissions")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) {
        throw new Error(`更新エラー: ${error.message}`);
      }

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
      );
    } catch (err) {
      console.error("Reject error:", err);
      alert("却下処理に失敗しました");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>🔐 管理画面</h1>
        <div className={styles.authSection}>
          <div className={styles.authTitle}>管理者認証</div>
          {passkeyError && (
            <div className={styles.authError}>{passkeyError}</div>
          )}
          <form onSubmit={handleAuth}>
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>パスキー</label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className={styles.authInput}
                placeholder="パスキーを入力"
              />
            </div>
            <button type="submit" className={styles.authButton}>
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>🔐 管理画面</h1>
        <button
          className={styles.logoutButton}
          onClick={() => setAuthenticated(false)}
        >
          ログアウト
        </button>
      </div>

      <div className={styles.statsBox}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>待機中</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.approved}</div>
          <div className={styles.statLabel}>承認済み</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.rejected}</div>
          <div className={styles.statLabel}>却下</div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <button
          className={`${styles.filterButton} ${
            filterStatus === "all" ? styles.active : ""
          }`}
          onClick={() => setFilterStatus("all")}
        >
          すべて
        </button>
        <button
          className={`${styles.filterButton} ${
            filterStatus === "pending" ? styles.active : ""
          }`}
          onClick={() => setFilterStatus("pending")}
        >
          待機中
        </button>
        <button
          className={`${styles.filterButton} ${
            filterStatus === "approved" ? styles.active : ""
          }`}
          onClick={() => setFilterStatus("approved")}
        >
          承認済み
        </button>
        <button
          className={`${styles.filterButton} ${
            filterStatus === "rejected" ? styles.active : ""
          }`}
          onClick={() => setFilterStatus("rejected")}
        >
          却下
        </button>
      </div>

      {loading && <div className={styles.loadingMessage}>読み込み中...</div>}

      {!loading && filteredSubmissions.length === 0 && (
        <div className={styles.emptyMessage}>投稿がありません</div>
      )}

      {!loading && filteredSubmissions.length > 0 && (
        <table className={styles.submissionTable}>
          <thead>
            <tr>
              <th>投稿者</th>
              <th>キャラ名</th>
              <th>ID</th>
              <th>ポジション</th>
              <th>メインビルド</th>
              <th>投稿日</th>
              <th>ステータス</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.submitted_by}</td>
                <td>{submission.name}</td>
                <td>#{submission.character_id}</td>
                <td>{submission.position}</td>
                <td>{submission.main_build}</td>
                <td>
                  {new Date(submission.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      submission.status === "pending"
                        ? styles.statusPending
                        : submission.status === "approved"
                        ? styles.statusApproved
                        : styles.statusRejected
                    }`}
                  >
                    {submission.status === "pending"
                      ? "待機中"
                      : submission.status === "approved"
                      ? "承認済み"
                      : "却下"}
                  </span>
                </td>
                <td>
                  {submission.status === "pending" && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.approveButton}
                        onClick={() =>
                          handleApprove(submission.id, submission)
                        }
                        disabled={actionLoading === submission.id}
                      >
                        {actionLoading === submission.id ? "..." : "承認"}
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleReject(submission.id)}
                        disabled={actionLoading === submission.id}
                      >
                        {actionLoading === submission.id ? "..." : "却下"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

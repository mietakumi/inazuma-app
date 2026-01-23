"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Position, MainBuild } from "@/types";
import styles from "./submit.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const POSITIONS: Position[] = ["FW", "MF", "DF", "GK"];
const BUILDS: MainBuild[] = ["正義", "ラフ", "カウンター", "テンション", "キズナ", "ひっさつ"];

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: "",
    character_id: "",
    position: "" as Position | "",
    main_build: "" as MainBuild | "",
    submitted_by: "",
  });

  const [duplicateCharacter, setDuplicateCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkDuplicate = async (characterId: number) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("character_submissions")
        .select("*")
        .eq("character_id", characterId)
        .eq("status", "approved")
        .single();

      if (supabaseError && supabaseError.code !== "PGRST116") {
        throw supabaseError;
      }

      return data;
    } catch (err) {
      console.error("Duplicate check error:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // バリデーション
    if (
      !formData.name ||
      !formData.character_id ||
      !formData.position ||
      !formData.main_build ||
      !formData.submitted_by
    ) {
      setError("すべてのフィールドを入力してください");
      return;
    }

    const charId = parseInt(formData.character_id);
    if (isNaN(charId)) {
      setError("キャラIDは数字で入力してください");
      return;
    }

    if (!confirming) {
      // 重複チェック
      setLoading(true);
      const duplicate = await checkDuplicate(charId);
      setLoading(false);

      if (duplicate) {
        setDuplicateCharacter(duplicate);
        setConfirming(true);
        return;
      }
    }

    // 投稿実行
    await submitCharacter();
  };

  const submitCharacter = async () => {
    setLoading(true);
    try {
      const { error: supabaseError } = await supabase
        .from("character_submissions")
        .insert({
          name: formData.name,
          character_id: parseInt(formData.character_id),
          position: formData.position,
          main_build: formData.main_build,
          submitted_by: formData.submitted_by,
          status: "pending",
        });

      if (supabaseError) {
        throw new Error(`投稿エラー: ${supabaseError.message}`);
      }

      setSuccess(true);
      setFormData({
        name: "",
        character_id: "",
        position: "",
        main_build: "",
        submitted_by: "",
      });
      setDuplicateCharacter(null);
      setConfirming(false);

      // 3秒後にメッセージを消す
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "不明なエラーが発生しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDuplicate = () => {
    setDuplicateCharacter(null);
    setConfirming(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 キャラクター投稿</h1>

      <div className={styles.description}>
        イナズマイレブンのキャラクター情報を投稿してください。
        <br />
        投稿内容は管理者が確認後、図鑑に追加されます。
      </div>

      {success && (
        <div className={styles.successMessage}>
          ✅ 投稿が完了しました！管理者が確認します。
        </div>
      )}

      {error && <div className={styles.errorMessage}>❌ {error}</div>}

      {confirming && duplicateCharacter && (
        <div className={styles.warningMessage}>
          ⚠️ <strong>このキャラクターは既に投稿されています</strong>
          <br />
          キャラ名: <strong>{duplicateCharacter.name}</strong>
          <br />
          投稿者: {duplicateCharacter.submitted_by}
          <br />
          <br />
          それでも上書き投稿しますか？
          <div className={styles.warningButtonGroup}>
            <button
              className={`${styles.warningButton} ${styles.warningButtonConfirm}`}
              onClick={submitCharacter}
              disabled={loading}
            >
              はい、上書きします
            </button>
            <button
              className={`${styles.warningButton} ${styles.warningButtonCancel}`}
              onClick={handleCancelDuplicate}
              disabled={loading}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            キャラ名<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="例：円堂守"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            キャラID<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            name="character_id"
            value={formData.character_id}
            onChange={handleChange}
            className={styles.input}
            placeholder="例：1"
            disabled={loading}
          />
          <div className={styles.hint}>イナズマイレブンのキャラ図鑑での番号</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            ポジション<span className={styles.required}>*</span>
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={styles.select}
            disabled={loading}
          >
            <option value="">-- 選択してください --</option>
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            メインビルド<span className={styles.required}>*</span>
          </label>
          <select
            name="main_build"
            value={formData.main_build}
            onChange={handleChange}
            className={styles.select}
            disabled={loading}
          >
            <option value="">-- 選択してください --</option>
            {BUILDS.map((build) => (
              <option key={build} value={build}>
                {build}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            投稿者名<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="submitted_by"
            value={formData.submitted_by}
            onChange={handleChange}
            className={styles.input}
            placeholder="例：太郎"
            disabled={loading}
          />
          <div className={styles.hint}>
            投稿者として表示されます。ニックネームでもOKです
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "投稿中..." : "投稿する"}
          </button>
          <button
            type="reset"
            className={styles.resetButton}
            disabled={loading}
            onClick={() => {
              setFormData({
                name: "",
                character_id: "",
                position: "",
                main_build: "",
                submitted_by: "",
              });
              setError(null);
              setSuccess(false);
              setDuplicateCharacter(null);
              setConfirming(false);
            }}
          >
            リセット
          </button>
        </div>
      </form>
    </div>
  );
}

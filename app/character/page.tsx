"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Character, Position, MainBuild } from "@/types";
import { CharacterFilter } from "./CharacterFilter";
import { CharacterList } from "./CharacterList";
import styles from "./character.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CharacterPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedBuild, setSelectedBuild] = useState<MainBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // キャラクターデータを取得
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: supabaseError } = await supabase
          .from("character_data")
          .select("*")
          .order("character_id", { ascending: true });

        if (supabaseError) {
          throw new Error(`データ取得エラー: ${supabaseError.message}`);
        }

        if (data) {
          setCharacters(data as Character[]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "不明なエラーが発生しました";
        setError(message);
        console.error("Character fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = characters;

    if (selectedPosition) {
      filtered = filtered.filter((c) => c.position === selectedPosition);
    }

    if (selectedBuild) {
      filtered = filtered.filter((c) => c.main_build === selectedBuild);
    }

    setFilteredCharacters(filtered);
  }, [characters, selectedPosition, selectedBuild]);

  const handleReset = () => {
    setSelectedPosition(null);
    setSelectedBuild(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 キャラクター図鑑</h1>

      <CharacterFilter
        selectedPosition={selectedPosition}
        selectedBuild={selectedBuild}
        onPositionChange={setSelectedPosition}
        onBuildChange={setSelectedBuild}
        onReset={handleReset}
      />

      <CharacterList
        characters={filteredCharacters}
        loading={loading}
        error={error}
      />
    </div>
  );
}

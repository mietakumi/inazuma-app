import { Character } from "@/types";
import styles from "./character.module.css";

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

export function CharacterList({
  characters,
  loading,
  error,
}: CharacterListProps) {
  if (loading) {
    return <div className={styles.loadingMessage}>キャラクターを読み込み中...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (characters.length === 0) {
    return <div className={styles.emptyMessage}>条件に合致するキャラクターがいません</div>;
  }

  return (
    <div>
      <div className={styles.resultInfo}>
        {characters.length}件のキャラクターが見つかりました
      </div>
      <div className={styles.characterList}>
        {characters.map((character) => (
          <div key={character.id} className={styles.characterCard}>
            <div className={styles.characterId}>
              #{character.character_id}
            </div>
            <div className={styles.characterInfo}>
              <div className={styles.characterName}>{character.name}</div>
              <div className={styles.characterDetails}>
                <span className={`${styles.characterBadge} ${styles.positionBadge}`}>
                  {character.position}
                </span>
                <span className={`${styles.characterBadge} ${styles.buildBadge}`}>
                  {character.main_build}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

-- キャラクターテーブル
CREATE TABLE character_data (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  character_id INT NOT NULL UNIQUE,
  position VARCHAR(10) NOT NULL CHECK (position IN ('FW', 'MF', 'DF', 'GK')),
  main_build VARCHAR(20) NOT NULL CHECK (main_build IN ('正義', 'ラフ', 'カウンター', 'テンション', 'キズナ', 'ひっさつ')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成（検索高速化）
CREATE INDEX idx_character_data_position ON character_data(position);
CREATE INDEX idx_character_data_main_build ON character_data(main_build);

-- ステータスベンチマークテーブル（アップデート時の最強キャラ情報）
CREATE TABLE stats_benchmarks (
  id SERIAL PRIMARY KEY,
  position VARCHAR(10) NOT NULL CHECK (position IN ('FW', 'MF', 'DF', 'GK')),
  stat_type VARCHAR(20) NOT NULL CHECK (stat_type IN ('kick', 'control', 'technique', 'agility', 'intelligence')),
  benchmark_type VARCHAR(50) NOT NULL,
  character_id INT NOT NULL REFERENCES character_data(id) ON DELETE CASCADE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(position, stat_type, benchmark_type)
);

-- インデックス作成
CREATE INDEX idx_benchmarks_position ON stats_benchmarks(position);
CREATE INDEX idx_benchmarks_stat_type ON stats_benchmarks(stat_type);

-- キャラクター投稿テーブル
CREATE TABLE character_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  character_id INT NOT NULL,
  position VARCHAR(10) NOT NULL CHECK (position IN ('FW', 'MF', 'DF', 'GK')),
  main_build VARCHAR(20) NOT NULL CHECK (main_build IN ('正義', 'ラフ', 'カウンター', 'テンション', 'キズナ', 'ひっさつ')),
  submitted_by VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_submissions_status ON character_submissions(status);
CREATE INDEX idx_submissions_character_id ON character_submissions(character_id);
CREATE INDEX idx_submissions_created_at ON character_submissions(created_at DESC);

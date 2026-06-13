-- =====================================================
-- STRIVER A2Z DSA TRACKER - POSTGRESQL/SUPABASE SCHEMA
-- =====================================================
-- Compatible with: Supabase + Next.js + PostgreSQL
-- Last Updated: 2025
-- =====================================================

-- Enable UUID extension (already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE completion_status AS ENUM ('not_started', 'in_progress', 'completed', 'revisit');
CREATE TYPE confidence_level AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');

-- =====================================================
-- CORE DSA TABLES
-- =====================================================

-- Topic (e.g., "Arrays", "Dynamic Programming")
CREATE TABLE topics (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id     VARCHAR(10) UNIQUE NOT NULL,  -- e.g., "T01"
  topic_name   TEXT NOT NULL,
  description  TEXT,
  order_index  INTEGER NOT NULL,
  total_problems INTEGER DEFAULT 0,
  icon_name    VARCHAR(50),                  -- For UI display
  color_hex    VARCHAR(7),                   -- e.g., "#FF5733"
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Topic Dependencies (for the dependency graph)
CREATE TABLE topic_dependencies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_topic_id   VARCHAR(10) REFERENCES topics(topic_id) ON DELETE CASCADE,
  to_topic_id     VARCHAR(10) REFERENCES topics(topic_id) ON DELETE CASCADE,
  dependency_type VARCHAR(50) DEFAULT 'prerequisite',  -- 'prerequisite', 'recommended', 'optional'
  UNIQUE(from_topic_id, to_topic_id)
);

-- Subtopic (e.g., "Easy Arrays", "Binary Search on Answer")
CREATE TABLE subtopics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtopic_id     VARCHAR(15) UNIQUE NOT NULL,  -- e.g., "T03-S01"
  topic_id        VARCHAR(10) NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
  subtopic_name   TEXT NOT NULL,
  order_index     INTEGER NOT NULL,
  total_problems  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Problem
CREATE TABLE problems (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id      VARCHAR(10) UNIQUE NOT NULL,   -- e.g., "P001"
  problem_name    TEXT NOT NULL,
  subtopic_id     VARCHAR(15) NOT NULL REFERENCES subtopics(subtopic_id) ON DELETE CASCADE,
  topic_id        VARCHAR(10) NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
  difficulty      difficulty_level NOT NULL DEFAULT 'Easy',
  pattern         TEXT,                           -- e.g., "Two Pointer", "Sliding Window"
  
  -- External Links
  leetcode_link   TEXT,
  gfg_link        TEXT,
  youtube_link    TEXT,
  article_link    TEXT,
  coding_ninjas_link TEXT,
  
  -- Complexity
  time_complexity  TEXT,                          -- e.g., "O(n log n)"
  space_complexity TEXT,
  
  -- Approaches
  brute_force_approach     TEXT,
  better_approach          TEXT,
  optimal_approach         TEXT,
  
  -- Metadata
  order_in_subtopic  INTEGER DEFAULT 0,
  is_must_do         BOOLEAN DEFAULT FALSE,       -- Starred/must-do problems
  companies          TEXT[],                      -- e.g., ARRAY['Google', 'Amazon']
  tags               TEXT[],                      -- Additional search tags
  notes              TEXT,
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Problem Prerequisites (which problems should be done before this one)
CREATE TABLE problem_prerequisites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id      VARCHAR(10) REFERENCES problems(problem_id) ON DELETE CASCADE,
  prerequisite_id VARCHAR(10) REFERENCES problems(problem_id) ON DELETE CASCADE,
  UNIQUE(problem_id, prerequisite_id)
);

-- =====================================================
-- USER PROGRESS TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  target_date     DATE,                     -- Placement target date
  daily_goal      INTEGER DEFAULT 3,        -- Problems per day goal
  current_streak  INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  total_solved    INTEGER DEFAULT 0,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- User Problem Progress
CREATE TABLE user_problem_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  problem_id      VARCHAR(10) NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
  
  status          completion_status DEFAULT 'not_started',
  confidence      confidence_level,
  
  -- Timing
  first_attempted_at  TIMESTAMPTZ,
  last_attempted_at   TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  time_spent_minutes  INTEGER DEFAULT 0,
  attempt_count       INTEGER DEFAULT 0,
  
  -- User annotations
  personal_notes  TEXT,
  solution_code   TEXT,                     -- User's own solution
  language        VARCHAR(20) DEFAULT 'java',  -- java, python, cpp, javascript
  
  -- Review scheduling (spaced repetition)
  next_review_at  DATE,
  review_interval INTEGER DEFAULT 1,        -- Days until next review
  ease_factor     FLOAT DEFAULT 2.5,        -- SM-2 algorithm factor
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, problem_id)
);

-- User Topic Progress (aggregate)
CREATE TABLE user_topic_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic_id        VARCHAR(10) NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
  
  problems_solved     INTEGER DEFAULT 0,
  problems_total      INTEGER DEFAULT 0,
  completion_percent  FLOAT DEFAULT 0.0,
  
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  
  UNIQUE(user_id, topic_id)
);

-- =====================================================
-- NOTES & REVIEW SYSTEM
-- =====================================================

-- User Notes (rich text notes per problem)
CREATE TABLE user_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  problem_id  VARCHAR(10) NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
  
  title       TEXT,
  content     TEXT NOT NULL,
  note_type   VARCHAR(20) DEFAULT 'general',  -- 'approach', 'complexity', 'edge_case', 'general'
  is_pinned   BOOLEAN DEFAULT FALSE,
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE user_bookmarks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  problem_id  VARCHAR(10) NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
  
  bookmark_label  VARCHAR(100),             -- Optional label
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, problem_id)
);

-- Daily Activity Log
CREATE TABLE user_daily_activity (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_date   DATE NOT NULL,
  
  problems_solved   INTEGER DEFAULT 0,
  problems_attempted INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  
  UNIQUE(user_id, activity_date)
);

-- =====================================================
-- ROADMAP / GRAPH DATA
-- =====================================================

-- Stores the visual graph layout positions for the roadmap
CREATE TABLE roadmap_nodes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id    VARCHAR(10) UNIQUE NOT NULL REFERENCES topics(topic_id),
  x_position  FLOAT DEFAULT 0,
  y_position  FLOAT DEFAULT 0,
  node_type   VARCHAR(20) DEFAULT 'topic',  -- 'topic', 'subtopic', 'problem'
  metadata    JSONB DEFAULT '{}'::JSONB
);

-- =====================================================
-- VIEWS
-- =====================================================

-- View: User dashboard summary
CREATE VIEW user_dashboard_stats AS
SELECT
  up.id AS user_id,
  up.display_name,
  up.total_solved,
  up.current_streak,
  up.longest_streak,
  
  COUNT(DISTINCT CASE WHEN upp.status = 'completed' THEN upp.problem_id END) AS confirmed_solved,
  COUNT(DISTINCT CASE WHEN upp.status = 'in_progress' THEN upp.problem_id END) AS in_progress,
  COUNT(DISTINCT CASE WHEN upp.status = 'revisit' THEN upp.problem_id END) AS needs_revisit,
  
  COUNT(DISTINCT CASE WHEN p.difficulty = 'Easy' AND upp.status = 'completed' THEN upp.problem_id END) AS easy_solved,
  COUNT(DISTINCT CASE WHEN p.difficulty = 'Medium' AND upp.status = 'completed' THEN upp.problem_id END) AS medium_solved,
  COUNT(DISTINCT CASE WHEN p.difficulty = 'Hard' AND upp.status = 'completed' THEN upp.problem_id END) AS hard_solved,
  
  COALESCE(SUM(upp.time_spent_minutes), 0) AS total_time_minutes

FROM user_profiles up
LEFT JOIN user_problem_progress upp ON up.id = upp.user_id
LEFT JOIN problems p ON upp.problem_id = p.problem_id
GROUP BY up.id, up.display_name, up.total_solved, up.current_streak, up.longest_streak;

-- View: Topic completion for all users
CREATE VIEW topic_completion_view AS
SELECT
  upp.user_id,
  p.topic_id,
  t.topic_name,
  COUNT(*) FILTER (WHERE upp.status = 'completed') AS solved,
  COUNT(*) AS total,
  ROUND(
    COUNT(*) FILTER (WHERE upp.status = 'completed') * 100.0 / NULLIF(COUNT(*), 0),
    2
  ) AS completion_percent
FROM user_problem_progress upp
JOIN problems p ON upp.problem_id = p.problem_id
JOIN topics t ON p.topic_id = t.topic_id
GROUP BY upp.user_id, p.topic_id, t.topic_name;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_problems_topic_id ON problems(topic_id);
CREATE INDEX idx_problems_subtopic_id ON problems(subtopic_id);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_pattern ON problems(pattern);
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);

CREATE INDEX idx_user_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX idx_user_progress_problem_id ON user_problem_progress(problem_id);
CREATE INDEX idx_user_progress_status ON user_problem_progress(status);
CREATE INDEX idx_user_progress_next_review ON user_problem_progress(next_review_at);
CREATE INDEX idx_user_daily_activity_date ON user_daily_activity(user_id, activity_date DESC);

CREATE INDEX idx_user_notes_user_problem ON user_notes(user_id, problem_id);
CREATE INDEX idx_topic_dependencies_from ON topic_dependencies(from_topic_id);
CREATE INDEX idx_topic_dependencies_to ON topic_dependencies(to_topic_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- =====================================================

-- Enable RLS on user-specific tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own progress" ON user_problem_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own topic progress" ON user_topic_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notes" ON user_notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily activity" ON user_daily_activity
  FOR ALL USING (auth.uid() = user_id);

-- Public data (problems, topics) - readable by all
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are publicly readable" ON topics FOR SELECT USING (true);
CREATE POLICY "Subtopics are publicly readable" ON subtopics FOR SELECT USING (true);
CREATE POLICY "Problems are publicly readable" ON problems FOR SELECT USING (true);
CREATE POLICY "Topic dependencies are publicly readable" ON topic_dependencies FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Apply to relevant tables
CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_problem_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update streak and total_solved on progress change
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - 1;
  v_yesterday_activity INTEGER;
BEGIN
  v_user_id := NEW.user_id;

  -- Update total_solved
  UPDATE user_profiles
  SET total_solved = (
    SELECT COUNT(*) FROM user_problem_progress
    WHERE user_id = v_user_id AND status = 'completed'
  )
  WHERE id = v_user_id;

  -- Update daily activity
  INSERT INTO user_daily_activity (user_id, activity_date, problems_solved)
  VALUES (v_user_id, v_today, 1)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    problems_solved = user_daily_activity.problems_solved + 
      CASE WHEN NEW.status = 'completed' AND OLD.status != 'completed' THEN 1 ELSE 0 END;

  -- Update streak
  SELECT problems_solved INTO v_yesterday_activity
  FROM user_daily_activity
  WHERE user_id = v_user_id AND activity_date = v_yesterday;

  IF v_yesterday_activity > 0 OR EXISTS (
    SELECT 1 FROM user_daily_activity
    WHERE user_id = v_user_id AND activity_date = v_today
  ) THEN
    UPDATE user_profiles
    SET current_streak = CASE
      WHEN last_active_at::DATE = v_yesterday OR last_active_at::DATE = v_today THEN current_streak + 1
      ELSE 1
    END,
    longest_streak = GREATEST(longest_streak, current_streak + 1),
    last_active_at = NOW()
    WHERE id = v_user_id;
  ELSE
    UPDATE user_profiles
    SET current_streak = 1, last_active_at = NOW()
    WHERE id = v_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_problem_progress_update
  AFTER INSERT OR UPDATE ON user_problem_progress
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_user_stats();

-- Function: Spaced Repetition (SM-2 Algorithm)
CREATE OR REPLACE FUNCTION calculate_next_review(
  p_quality INTEGER,           -- 0-5 rating (0=blackout, 5=perfect)
  p_ease_factor FLOAT,         -- Current ease factor (default 2.5)
  p_interval INTEGER,          -- Current interval in days
  p_repetitions INTEGER        -- Number of repetitions
)
RETURNS TABLE(
  next_interval INTEGER,
  new_ease_factor FLOAT,
  new_repetitions INTEGER
) AS $$
DECLARE
  v_next_interval INTEGER;
  v_new_ef FLOAT;
  v_new_reps INTEGER;
BEGIN
  -- SM-2 Algorithm
  v_new_ef := p_ease_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));
  v_new_ef := GREATEST(1.3, v_new_ef);

  IF p_quality < 3 THEN
    v_new_reps := 0;
    v_next_interval := 1;
  ELSE
    v_new_reps := p_repetitions + 1;
    IF p_repetitions = 0 THEN
      v_next_interval := 1;
    ELSIF p_repetitions = 1 THEN
      v_next_interval := 6;
    ELSE
      v_next_interval := ROUND(p_interval * p_ease_factor);
    END IF;
  END IF;

  RETURN QUERY SELECT v_next_interval, v_new_ef, v_new_reps;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA HELPERS
-- =====================================================

-- Function to import problems from JSON file
-- Usage in application code via Supabase client

-- =====================================================
-- FULL-TEXT SEARCH INDEX
-- =====================================================

ALTER TABLE problems ADD COLUMN search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION update_problem_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.problem_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.pattern, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.optimal_approach, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_problem_search
  BEFORE INSERT OR UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_problem_search_vector();

CREATE INDEX idx_problems_search ON problems USING GIN(search_vector);

-- =====================================================
-- API FUNCTIONS (callable via Supabase RPC)
-- =====================================================

-- Get problems due for review today
CREATE OR REPLACE FUNCTION get_problems_due_for_review(p_user_id UUID)
RETURNS TABLE (
  problem_id VARCHAR(10),
  problem_name TEXT,
  topic_name TEXT,
  difficulty difficulty_level,
  days_overdue INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.problem_id,
    p.problem_name,
    t.topic_name,
    p.difficulty,
    (CURRENT_DATE - upp.next_review_at)::INTEGER AS days_overdue
  FROM user_problem_progress upp
  JOIN problems p ON upp.problem_id = p.problem_id
  JOIN topics t ON p.topic_id = t.topic_id
  WHERE upp.user_id = p_user_id
    AND upp.status = 'completed'
    AND upp.next_review_at <= CURRENT_DATE
  ORDER BY days_overdue DESC, p.difficulty;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get next recommended problems based on prerequisites
CREATE OR REPLACE FUNCTION get_recommended_problems(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  problem_id VARCHAR(10),
  problem_name TEXT,
  topic_name TEXT,
  subtopic_name TEXT,
  difficulty difficulty_level,
  pattern TEXT,
  prerequisite_completed BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.problem_id,
    p.problem_name,
    t.topic_name,
    s.subtopic_name,
    p.difficulty,
    p.pattern,
    NOT EXISTS (
      SELECT 1 FROM problem_prerequisites pp
      JOIN user_problem_progress upp2
        ON pp.prerequisite_id = upp2.problem_id
        AND upp2.user_id = p_user_id
        AND upp2.status != 'completed'
      WHERE pp.problem_id = p.problem_id
    ) AS prerequisite_completed
  FROM problems p
  JOIN subtopics s ON p.subtopic_id = s.subtopic_id
  JOIN topics t ON p.topic_id = t.topic_id
  WHERE NOT EXISTS (
    SELECT 1 FROM user_problem_progress upp
    WHERE upp.problem_id = p.problem_id
      AND upp.user_id = p_user_id
      AND upp.status IN ('completed', 'in_progress')
  )
  ORDER BY
    prerequisite_completed DESC,
    t.order_index,
    s.order_index,
    p.order_in_subtopic
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

/*
  # Educational Investment Platform Schema

  ## Overview
  Creates the complete database schema for an educational investment platform with:
  - Quiz system with questions and answers
  - User progress tracking
  - Ranking/leaderboard system

  ## New Tables
  
  ### `quiz_questions`
  Stores all quiz questions with multiple choice options
  - `id` (uuid, primary key)
  - `question` (text) - The question text
  - `option_a` (text) - First option
  - `option_b` (text) - Second option
  - `option_c` (text) - Third option
  - `option_d` (text) - Fourth option
  - `correct_answer` (text) - The correct answer ('a', 'b', 'c', or 'd')
  - `points` (integer) - Points awarded for correct answer (default 1)
  - `created_at` (timestamptz)

  ### `user_answers`
  Records each user's answer to quiz questions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `question_id` (uuid, references quiz_questions)
  - `selected_answer` (text) - User's selected answer
  - `is_correct` (boolean) - Whether the answer was correct
  - `answered_at` (timestamptz)

  ### `user_scores`
  Stores aggregate scores for ranking
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, unique)
  - `total_score` (integer) - Total points earned
  - `quiz_attempts` (integer) - Number of quiz attempts
  - `last_quiz_at` (timestamptz) - Last quiz completion time
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_profiles`
  Stores additional user information
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only view their own answers and scores
  - All users can view quiz questions
  - Ranking data is publicly viewable
*/

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT NOT NULL AUTO_INCREMENT,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  points INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CHECK (correct_answer IN ('a','b','c','d'))
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_answer text NOT NULL CHECK (selected_answer IN ('a', 'b', 'c', 'd')),
  is_correct boolean NOT NULL,
  answered_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id, answered_at)
);

-- Create user_scores table
CREATE TABLE IF NOT EXISTS user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_score integer DEFAULT 0,
  quiz_attempts integer DEFAULT 0,
  last_quiz_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_questions (all authenticated users can read)
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_answers
CREATE POLICY "Users can view own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_scores
CREATE POLICY "Anyone can view all scores for ranking"
  ON user_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own score"
  ON user_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own score"
  ON user_scores FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert initial quiz questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES
('Qual é um dos principais objetivos da educação financeira?', 'Aumentar o consumo', 'Melhorar a gestão do dinheiro', 'Evitar trabalhar', 'Gastar mais rápido', 'b', 1),
('Por que a educação financeira é importante?', 'Para aumentar dívidas', 'Para mudar hábitos financeiros e melhorar o controle do dinheiro', 'Para eliminar salários', 'Para evitar contas', 'b', 1),
('O que a educação financeira ajuda a desenvolver?', 'Descontrole financeiro', 'Conhecimento e organização financeira', 'Mais gastos', 'Menos responsabilidade', 'b', 1),
('A educação financeira ensina principalmente sobre:', 'Como gastar tudo', 'Planejamento e controle do dinheiro', 'Como evitar trabalhar', 'Como ignorar contas', 'b', 1),
('Um dos problemas que a educação financeira ajuda a evitar é:', 'Economia', 'Organização', 'Endividamento', 'Trabalho', 'c', 1),
('O que a educação financeira ajuda a melhorar?', 'Desorganização', 'Controle do orçamento', 'Dívidas', 'Gastos impulsivos', 'b', 1),
('Qual é um benefício da educação financeira?', 'Falta de planejamento', 'Melhores decisões financeiras', 'Mais dívidas', 'Falta de controle', 'b', 1)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_total_score ON user_scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id ON user_scores(user_id);

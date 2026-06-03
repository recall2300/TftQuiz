export type QuizCategory = {
  id: number;
  slug: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
};

export type QuizChoice = {
  id: string;
  text: string;
  image_url?: string;
};

export type QuizQuestion = {
  id: number;
  category_id: number;
  image_url: string;
  question_text: string;
  choices: QuizChoice[];
  correct_answers: string[];
  is_multi_answer: boolean;
  difficulty: 1 | 2 | 3;
};

export type QuizState = "idle" | "loading" | "answering" | "feedback" | "completed";

export type QuizAnswer = {
  question_id: number;
  selected: string[];
  correct: boolean;
  score_earned: number;
};

export type QuizSession = {
  category: QuizCategory;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  score: number;
  combo: number;
  maxCombo: number;
  state: QuizState;
  startedAt: number;
};

export type SessionResult = {
  id: string;
  user_id: string | null;
  category_id: number;
  question_count: number;
  correct_count: number;
  score: number;
  max_combo: number;
  duration_seconds: number;
  completed_at: string;
};

export type LeaderboardEntry = {
  user_id: string;
  username: string;
  avatar_url: string | null;
  best_score: number;
  best_combo: number;
  total_games: number;
  avg_accuracy: number;
  category_slug?: string;
  category_name?: string;
};

export type OverallLeaderboardEntry = {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_score: number;
  best_combo: number;
  categories_played: number;
};

export const COMBO_MULTIPLIERS: Record<string, number> = {
  "1-2": 1.0,
  "3-4": 1.5,
  "5-7": 2.0,
  "8+": 3.0,
};

export const BASE_SCORE_SINGLE = 100;
export const BASE_SCORE_MULTI_ALL = 150;
export const BASE_SCORE_MULTI_PARTIAL = 50;

export const QUESTION_COUNTS = [10, 20, 30] as const;
export type QuestionCount = (typeof QUESTION_COUNTS)[number];

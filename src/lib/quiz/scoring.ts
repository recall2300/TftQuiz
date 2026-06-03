import {
  BASE_SCORE_MULTI_ALL,
  BASE_SCORE_MULTI_PARTIAL,
  BASE_SCORE_SINGLE,
} from "@/types/quiz";

export function getComboMultiplier(combo: number): number {
  if (combo >= 8) return 3.0;
  if (combo >= 5) return 2.0;
  if (combo >= 3) return 1.5;
  return 1.0;
}

export function getComboLabel(combo: number): string {
  if (combo >= 8) return "LEGENDARY";
  if (combo >= 5) return "EPIC";
  if (combo >= 3) return "GREAT";
  return "";
}

type ScoreResult = {
  score: number;
  isCorrect: boolean;
  isPartial: boolean;
  newCombo: number;
};

export function calculateScore(
  selected: string[],
  correctAnswers: string[],
  isMultiAnswer: boolean,
  currentCombo: number
): ScoreResult {
  if (!isMultiAnswer) {
    const isCorrect = selected[0] === correctAnswers[0];
    if (!isCorrect) return { score: 0, isCorrect: false, isPartial: false, newCombo: 0 };
    const newCombo = currentCombo + 1;
    const multiplier = getComboMultiplier(newCombo);
    return {
      score: Math.round(BASE_SCORE_SINGLE * multiplier),
      isCorrect: true,
      isPartial: false,
      newCombo,
    };
  }

  const selectedSet = new Set(selected);
  const correctSet = new Set(correctAnswers);
  const allCorrect =
    selected.length === correctAnswers.length &&
    correctAnswers.every((a) => selectedSet.has(a));
  const anyCorrect = correctAnswers.some((a) => selectedSet.has(a));
  const noWrong = selected.every((s) => correctSet.has(s));

  if (allCorrect) {
    const newCombo = currentCombo + 1;
    const multiplier = getComboMultiplier(newCombo);
    return {
      score: Math.round(BASE_SCORE_MULTI_ALL * multiplier),
      isCorrect: true,
      isPartial: false,
      newCombo,
    };
  }

  if (anyCorrect && noWrong) {
    return {
      score: BASE_SCORE_MULTI_PARTIAL,
      isCorrect: false,
      isPartial: true,
      newCombo: 0,
    };
  }

  return { score: 0, isCorrect: false, isPartial: false, newCombo: 0 };
}

export function getAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getRank(score: number): { label: string; color: string } {
  if (score >= 4500) return { label: "챌린저", color: "text-yellow-300" };
  if (score >= 3500) return { label: "그랜드마스터", color: "text-red-400" };
  if (score >= 2500) return { label: "마스터", color: "text-purple-400" };
  if (score >= 1500) return { label: "다이아몬드", color: "text-blue-400" };
  if (score >= 800) return { label: "플래티넘", color: "text-teal-400" };
  if (score >= 300) return { label: "골드", color: "tft-gold" };
  return { label: "실버", color: "text-slate-300" };
}

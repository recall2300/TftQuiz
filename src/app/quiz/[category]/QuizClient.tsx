"use client";

import { useEffect, useReducer, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Zap, Trophy, RotateCcw, Home, Loader2 } from "lucide-react";
import { calculateScore, getComboLabel, getComboMultiplier, getAccuracy, getRank } from "@/lib/quiz/scoring";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { QuizCategory, QuizQuestion, QuizAnswer, QuizState } from "@/types/quiz";

type State = {
  questions: QuizQuestion[];
  currentIndex: number;
  selected: string[];
  answers: QuizAnswer[];
  score: number;
  combo: number;
  maxCombo: number;
  quizState: QuizState;
  startedAt: number;
};

type Action =
  | { type: "LOAD"; questions: QuizQuestion[] }
  | { type: "SELECT"; id: string }
  | { type: "SUBMIT" }
  | { type: "NEXT" }
  | { type: "ERROR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return {
        ...state,
        questions: action.questions,
        currentIndex: 0,
        selected: [],
        answers: [],
        score: 0,
        combo: 0,
        maxCombo: 0,
        quizState: "answering",
        startedAt: Date.now(),
      };

    case "SELECT": {
      const q = state.questions[state.currentIndex];
      if (state.quizState !== "answering") return state;
      if (!q.is_multi_answer) return { ...state, selected: [action.id] };
      const already = state.selected.includes(action.id);
      return {
        ...state,
        selected: already
          ? state.selected.filter((s) => s !== action.id)
          : [...state.selected, action.id],
      };
    }

    case "SUBMIT": {
      if (state.selected.length === 0 || state.quizState !== "answering") return state;
      const q = state.questions[state.currentIndex];
      const result = calculateScore(state.selected, q.correct_answers, q.is_multi_answer, state.combo);
      return {
        ...state,
        answers: [
          ...state.answers,
          { question_id: q.id, selected: state.selected, correct: result.isCorrect, score_earned: result.score },
        ],
        score: state.score + result.score,
        combo: result.newCombo,
        maxCombo: Math.max(state.maxCombo, result.newCombo),
        quizState: "feedback",
      };
    }

    case "NEXT": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) return { ...state, quizState: "completed" };
      return { ...state, currentIndex: nextIndex, selected: [], quizState: "answering" };
    }

    case "ERROR":
      return { ...state, quizState: "idle" };

    default:
      return state;
  }
}

const initialState: State = {
  questions: [],
  currentIndex: 0,
  selected: [],
  answers: [],
  score: 0,
  combo: 0,
  maxCombo: 0,
  quizState: "loading",
  startedAt: 0,
};

type Props = { category: QuizCategory; count: number };

export default function QuizClient({ category, count }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/quiz/questions?category=${category.slug}&count=${count}`);
      const data = await res.json();
      if (!res.ok || !data.questions?.length) throw new Error();
      dispatch({ type: "LOAD", questions: data.questions });
    } catch {
      toast.error("문제를 불러오는 데 실패했습니다.");
      dispatch({ type: "ERROR" });
    }
  }, [category.slug, count]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  useEffect(() => {
    if (state.quizState !== "completed") return;
    const duration = Math.round((Date.now() - state.startedAt) / 1000);
    fetch("/api/quiz/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: category.id,
        question_count: state.questions.length,
        correct_count: state.answers.filter((a) => a.correct).length,
        score: state.score,
        max_combo: state.maxCombo,
        duration_seconds: duration,
      }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quizState]);

  if (state.quizState === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin tft-gold" />
      </div>
    );
  }

  if (state.quizState === "idle") {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">문제를 불러오지 못했습니다.</p>
        <Button onClick={loadQuestions} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />다시 시도
        </Button>
      </div>
    );
  }

  if (state.quizState === "completed") {
    return <ResultScreen state={state} category={category} onRetry={loadQuestions} />;
  }

  const question = state.questions[state.currentIndex];
  const lastAnswer = state.answers[state.answers.length - 1];
  const isFeedback = state.quizState === "feedback";
  const progress = ((state.currentIndex + (isFeedback ? 1 : 0)) / state.questions.length) * 100;
  const comboLabel = getComboLabel(state.combo);
  const nextMultiplier = getComboMultiplier(state.combo + 1);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {state.currentIndex + 1} / {state.questions.length}
          </span>
          <Badge variant="outline" className="text-xs">
            {category.icon} {category.display_name}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {state.combo >= 3 && (
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-bold text-amber-600">{state.combo}콤보</span>
              {comboLabel && (
                <Badge className="bg-amber-100 text-amber-700 text-xs border-amber-300">
                  {comboLabel}
                </Badge>
              )}
            </div>
          )}
          <span className="font-bold tft-gold">{state.score.toLocaleString()}점</span>
        </div>
      </div>

      <Progress value={progress} className="mb-6 h-1.5" />

      {/* Image */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-amber-200 shadow-md bg-white">
          <Image src={question.image_url} alt="퀴즈 이미지" fill className="object-cover" unoptimized />
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
        {question.question_text}
      </h2>
      {question.is_multi_answer && (
        <p className="mb-4 text-center text-sm font-medium text-accent">
          정답을 모두 선택하세요 (다중 선택)
        </p>
      )}
      {!question.is_multi_answer && state.quizState === "answering" && state.combo >= 2 && (
        <p className="mb-3 text-center text-xs text-muted-foreground">
          다음 정답 시 ×{nextMultiplier} 배율 적용
        </p>
      )}

      {/* Choices */}
      <div className="mb-5 grid grid-cols-2 gap-2.5">
        {question.choices.map((choice) => {
          const isSelected = state.selected.includes(choice.id);
          const isCorrect = question.correct_answers.includes(choice.id);

          let style =
            "relative flex min-h-[60px] items-center justify-center rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition-all cursor-pointer select-none ";

          if (isFeedback) {
            if (isCorrect) {
              style += "border-green-400 bg-green-50 text-green-700";
            } else if (isSelected && !isCorrect) {
              style += "border-red-400 bg-red-50 text-red-700";
            } else {
              style += "border-border bg-muted/30 text-muted-foreground opacity-50";
            }
          } else {
            if (isSelected) {
              style += "border-amber-400 bg-amber-50 text-amber-800 shadow-sm";
            } else {
              style += "border-border bg-white hover:border-amber-300 hover:bg-amber-50/50";
            }
          }

          return (
            <button
              key={choice.id}
              className={style}
              onClick={() => !isFeedback && dispatch({ type: "SELECT", id: choice.id })}
              disabled={isFeedback}
            >
              {isFeedback && isCorrect && (
                <CheckCircle2 className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500" />
              )}
              {isFeedback && isSelected && !isCorrect && (
                <XCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-red-500" />
              )}
              {choice.text}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isFeedback && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-center text-sm font-semibold ${
            lastAnswer?.correct
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {lastAnswer?.correct ? (
            <>
              정답! +{lastAnswer.score_earned.toLocaleString()}점
              {state.combo >= 3 && (
                <span className="ml-1 text-amber-600">(×{getComboMultiplier(state.combo)} 콤보)</span>
              )}
            </>
          ) : (
            <>
              오답. 정답:{" "}
              <span className="font-bold">
                {question.correct_answers
                  .map((id) => question.choices.find((c) => c.id === id)?.text)
                  .join(", ")}
              </span>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      {state.quizState === "answering" ? (
        <Button
          className="w-full tft-gold-bg font-bold"
          size="lg"
          disabled={state.selected.length === 0}
          onClick={() => dispatch({ type: "SUBMIT" })}
        >
          제출
        </Button>
      ) : (
        <Button
          className="w-full"
          size="lg"
          variant="outline"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          {state.currentIndex + 1 >= state.questions.length ? "결과 보기" : "다음 문제"}
        </Button>
      )}
    </div>
  );
}

function ResultScreen({
  state,
  category,
  onRetry,
}: {
  state: State;
  category: QuizCategory;
  onRetry: () => void;
}) {
  const correctCount = state.answers.filter((a) => a.correct).length;
  const accuracy = getAccuracy(correctCount, state.answers.length);
  const rank = getRank(state.score);
  const duration = Math.round((Date.now() - state.startedAt) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <Trophy className="mx-auto mb-3 h-12 w-12 text-amber-400" />
      <h1 className="mb-1 text-3xl font-bold tft-gold">퀴즈 완료!</h1>
      <p className="mb-6 text-muted-foreground">{category.display_name} 퀴즈 결과</p>

      <div className="mb-6 rounded-2xl border-2 tft-border-gold bg-amber-50 p-6">
        <p className="text-sm text-muted-foreground">최종 점수</p>
        <p className="text-5xl font-bold tft-gold">{state.score.toLocaleString()}</p>
        <p className={`mt-1 text-lg font-semibold ${rank.color}`}>{rank.label}</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "정확도", value: `${accuracy}%`, sub: `${correctCount}/${state.answers.length}` },
          { label: "최대 콤보", value: `${state.maxCombo}`, sub: "연속 정답" },
          { label: "소요 시간", value: `${minutes}:${String(seconds).padStart(2, "0")}`, sub: "분:초" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-3 shadow-sm">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <Button className="w-full tft-gold-bg font-bold" size="lg" onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" />다시 도전
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
          다른 퀴즈 선택
        </Link>
        <Link href="/leaderboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}>
          <Trophy className="mr-2 h-4 w-4" />랭킹 확인
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}>
          <Home className="mr-2 h-4 w-4" />홈으로
        </Link>
      </div>
    </div>
  );
}

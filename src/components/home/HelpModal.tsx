"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Zap, Target, Trophy } from "lucide-react";

const COMBO_ROWS = [
  { range: "1–2콤보", mult: "×1.0", color: "text-gray-500", bg: "bg-gray-100" },
  { range: "3–4콤보", mult: "×1.5", color: "text-blue-600", bg: "bg-blue-50" },
  { range: "5–7콤보", mult: "×2.0", color: "text-purple-600", bg: "bg-purple-50" },
  { range: "8+콤보", mult: "×3.0", color: "tft-gold", bg: "bg-amber-50" },
];

const RANKS = [
  { label: "챌린저", threshold: "4,500+", color: "text-yellow-500" },
  { label: "그랜드마스터", threshold: "3,500+", color: "text-red-500" },
  { label: "마스터", threshold: "2,500+", color: "text-purple-500" },
  { label: "다이아몬드", threshold: "1,500+", color: "text-blue-500" },
  { label: "플래티넘", threshold: "800+", color: "text-teal-500" },
  { label: "골드", threshold: "300+", color: "text-amber-500" },
  { label: "실버", threshold: "0+", color: "text-gray-500" },
];

export default function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md border border-border hover:shadow-lg transition-shadow text-muted-foreground hover:text-foreground"
          aria-label="도움말"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 tft-gold" />
            점수 & 시스템 안내
          </DialogTitle>
        </DialogHeader>

        {/* Base scores */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            기본 점수
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span>단일 정답 맞추기</span>
              <span className="font-bold tft-gold">100점</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span>다중 정답 전부 맞추기</span>
              <span className="font-bold tft-gold">150점</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span>다중 정답 일부만 (오답 없음)</span>
              <span className="font-semibold text-blue-500">50점</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Combo */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            콤보 배율 (연속 정답)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {COMBO_ROWS.map(({ range, mult, color, bg }) => (
              <div key={range} className={`flex items-center justify-between rounded-lg px-3 py-2 ${bg}`}>
                <Badge variant="outline" className="text-xs">{range}</Badge>
                <span className={`font-bold text-base ${color}`}>{mult}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            오답 시 콤보가 초기화됩니다.
          </p>
        </div>

        <Separator />

        {/* Ranks */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            랭크 기준
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RANKS.map(({ label, threshold, color }) => (
              <div key={label} className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                <span className={`text-xs font-semibold ${color}`}>{label}</span>
                <span className="text-xs text-muted-foreground">{threshold}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

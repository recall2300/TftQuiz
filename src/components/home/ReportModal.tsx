"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const REPORT_TYPES = [
  { value: "wrong_answer", label: "오답 신고 (정답이 틀림)" },
  { value: "image_error", label: "이미지 오류 (이미지 깨짐/잘못됨)" },
  { value: "typo", label: "오타 / 번역 오류" },
  { value: "suggestion", label: "문제 추가 건의" },
  { value: "other", label: "기타" },
];

const CATEGORIES = [
  { value: "champion", label: "챔피언" },
  { value: "item", label: "아이템" },
  { value: "synergy", label: "시너지" },
  { value: "augment", label: "증강체" },
  { value: "other", label: "기타/전체" },
];

export default function ReportModal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("wrong_answer");
  const [category, setCategory] = useState("champion");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 10) {
      toast.error("내용을 10자 이상 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_type: type, category_slug: category, content: content.trim() }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setContent("");
        setType("wrong_answer");
        setCategory("champion");
      }, 1800);
    } catch {
      toast.error("제보 제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md border border-border hover:shadow-lg transition-shadow text-muted-foreground hover:text-foreground"
          aria-label="제보하기"
        >
          <Megaphone className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 tft-gold" />
            퀴즈 제보
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="font-semibold">제보해 주셔서 감사합니다!</p>
            <p className="text-sm text-muted-foreground">검토 후 반영하겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                제보 유형
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                해당 카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                내용 <span className="text-muted-foreground/60">(최소 10자)</span>
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="어떤 문제인지 구체적으로 알려주세요. (예: 챔피언 '진크스' 문제에서 정답이 잘못되어 있습니다.)"
                maxLength={500}
                rows={4}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {content.length} / 500
              </p>
            </div>

            <Button
              type="submit"
              className="w-full tft-gold-bg font-semibold"
              disabled={loading || content.trim().length < 10}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              제보 제출
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

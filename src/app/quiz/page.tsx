import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { QuizCategory } from "@/types/quiz";

const COLOR_MAP: Record<string, string> = {
  blue: "border-blue-500/50 hover:border-blue-400 hover:tft-glow-blue",
  yellow: "border-yellow-500/50 hover:border-yellow-400",
  purple: "border-purple-500/50 hover:border-purple-400",
  green: "border-green-500/50 hover:border-green-400",
};

const BADGE_COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
};

const COUNT_OPTIONS = [10, 20, 30];

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("quiz_categories")
    .select("*")
    .order("id");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tft-gold">퀴즈 선택</h1>
        <p className="text-muted-foreground">도전할 유형과 문항 수를 선택하세요</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {(categories as QuizCategory[])?.map((cat) => (
          <Card
            key={cat.id}
            className={`border-2 bg-card transition-all duration-200 ${COLOR_MAP[cat.color] ?? "border-border"}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <CardTitle className="text-xl">{cat.display_name}</CardTitle>
                  <CardDescription className="text-sm">{cat.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground font-medium">문항 수 선택</p>
              <div className="flex gap-2">
                {COUNT_OPTIONS.map((count) => (
                  <Link
                    key={count}
                    href={`/quiz/${cat.slug}?count=${count}`}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-all hover:scale-105 ${BADGE_COLOR_MAP[cat.color] ?? "border-border"}`}
                  >
                    {count}문항
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!categories || categories.length === 0) && (
        <div className="py-20 text-center text-muted-foreground">
          <p>퀴즈 카테고리를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm">Supabase 설정을 확인해주세요.</p>
        </div>
      )}
    </div>
  );
}

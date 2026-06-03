import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Swords, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LeaderboardTicker from "@/components/home/LeaderboardTicker";
import HelpModal from "@/components/home/HelpModal";
import ReportModal from "@/components/home/ReportModal";
import type { QuizCategory, OverallLeaderboardEntry } from "@/types/quiz";

const COLOR_MAP: Record<string, string> = {
  blue:   "hover:border-blue-400 hover:shadow-blue-100",
  yellow: "hover:border-amber-400 hover:shadow-amber-100",
  purple: "hover:border-purple-400 hover:shadow-purple-100",
  green:  "hover:border-green-400 hover:shadow-green-100",
  orange: "hover:border-orange-400 hover:shadow-orange-100",
  cyan:   "hover:border-cyan-400 hover:shadow-cyan-100",
  red:    "hover:border-red-400 hover:shadow-red-100",
};

const COUNT_COLOR_MAP: Record<string, string> = {
  blue:   "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700",
  yellow: "hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700",
  purple: "hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700",
  green:  "hover:bg-green-50 hover:border-green-400 hover:text-green-700",
  orange: "hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700",
  cyan:   "hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-700",
  red:    "hover:bg-red-50 hover:border-red-400 hover:text-red-700",
};

const COUNT_OPTIONS = [10, 20, 30];

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: topPlayers }] = await Promise.all([
    supabase.from("quiz_categories").select("*").order("id"),
    supabase
      .from("overall_leaderboard")
      .select("*")
      .order("total_score", { ascending: false })
      .limit(15),
  ]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="border-b border-border bg-white px-4 py-10 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 tft-border-gold border-2">
            <Swords className="h-8 w-8 tft-gold" />
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight tft-gold">TFT Quiz</h1>
          <p className="text-base text-muted-foreground">
            전략적 팀 전투의 지식을 테스트하세요
          </p>
        </div>
      </section>

      {/* Leaderboard Ticker */}
      <LeaderboardTicker entries={(topPlayers as OverallLeaderboardEntry[]) ?? []} />

      {/* Category Selection */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-foreground">퀴즈 선택</h2>
          <p className="text-sm text-muted-foreground">도전할 유형과 문항 수를 선택하세요</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(categories as QuizCategory[])?.map((cat) => (
            <Card
              key={cat.id}
              className={`border-2 border-border bg-white shadow-sm transition-all duration-200 ${COLOR_MAP[cat.color] ?? ""} hover:shadow-md`}
            >
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{cat.display_name}</CardTitle>
                    <CardDescription className="text-xs">{cat.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">문항 수 선택</p>
                <div className="flex gap-2">
                  {COUNT_OPTIONS.map((count) => (
                    <Link
                      key={count}
                      href={`/quiz/${cat.slug}?count=${count}`}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold transition-all ${COUNT_COLOR_MAP[cat.color] ?? ""}`}
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
            <p className="text-sm">Supabase 연결을 확인해주세요.</p>
          </div>
        )}
      </section>

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <HelpModal />
        <ReportModal />
      </div>
    </div>
  );
}

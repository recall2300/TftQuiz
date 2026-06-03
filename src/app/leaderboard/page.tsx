import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Zap, Target } from "lucide-react";
import { getRank } from "@/lib/quiz/scoring";
import Link from "next/link";
import type { LeaderboardEntry, OverallLeaderboardEntry, QuizCategory } from "@/types/quiz";

const MEDAL = ["🥇", "🥈", "🥉"];

function RankBadge({ score }: { score: number }) {
  const rank = getRank(score);
  return <span className={`text-xs font-semibold ${rank.color}`}>{rank.label}</span>;
}

function UserRow({
  entry,
  index,
  score,
  sub,
}: {
  entry: { username: string; avatar_url?: string | null; user_id: string };
  index: number;
  score: number;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-colors hover:bg-amber-50/50">
      <span className="w-7 shrink-0 text-center text-lg">
        {index < 3 ? (
          MEDAL[index]
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">{index + 1}</span>
        )}
      </span>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={entry.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs bg-amber-100 text-amber-800">
          {entry.username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{entry.username ?? "익명"}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold tft-gold">{score.toLocaleString()}점</p>
        <RankBadge score={score} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-10 text-center text-muted-foreground">
      <Trophy className="mx-auto mb-3 h-10 w-10 opacity-20" />
      <p className="text-sm">아직 기록이 없습니다.</p>
      <Link href="/" className="mt-2 inline-block text-sm text-accent hover:underline">
        첫 번째 도전자가 되어보세요!
      </Link>
    </div>
  );
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [{ data: overall }, { data: categories }, { data: categoryBoard }] = await Promise.all([
    supabase
      .from("overall_leaderboard")
      .select("*")
      .order("total_score", { ascending: false })
      .limit(20),
    supabase.from("quiz_categories").select("*").order("id"),
    supabase
      .from("category_leaderboard")
      .select("*")
      .order("best_score", { ascending: false }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <Trophy className="mx-auto mb-3 h-10 w-10 text-amber-400" />
        <h1 className="text-3xl font-bold tft-gold">랭킹</h1>
        <p className="text-muted-foreground">최고의 TFT 퀴즈 마스터를 찾아라</p>
      </div>

      {/* Overall */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 tft-gold" />
          <h2 className="text-xl font-bold">종합 랭킹</h2>
          <Badge variant="outline" className="ml-auto text-xs">TOP 20</Badge>
        </div>
        <div className="space-y-2">
          {(overall as OverallLeaderboardEntry[])?.length ? (
            (overall as OverallLeaderboardEntry[]).map((entry, i) => (
              <UserRow
                key={entry.user_id}
                entry={entry}
                index={i}
                score={entry.total_score}
                sub={`${entry.categories_played}개 카테고리 · 최대 ${entry.best_combo}콤보`}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Per category */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">카테고리별 랭킹</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {(categories as QuizCategory[])?.map((cat) => {
            const entries = (categoryBoard as LeaderboardEntry[])?.filter(
              (e) => e.category_slug === cat.slug
            );
            return (
              <div key={cat.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-semibold">{cat.display_name}</h3>
                  <Badge variant="outline" className="ml-auto text-xs">TOP 10</Badge>
                </div>
                <div className="space-y-2">
                  {entries?.slice(0, 10).length ? (
                    entries.slice(0, 10).map((entry, i) => (
                      <UserRow
                        key={`${cat.slug}-${entry.user_id}`}
                        entry={entry}
                        index={i}
                        score={entry.best_score}
                        sub={`정확도 ${entry.avg_accuracy}% · ${entry.total_games}게임`}
                      />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rank legend */}
      <div className="mt-12 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 tft-gold" />
          <span className="text-sm font-medium">랭크 기준</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[4500, 3500, 2500, 1500, 800, 300, 0].map((threshold) => {
            const r = getRank(threshold);
            return (
              <Badge key={threshold} variant="outline" className={`text-xs ${r.color}`}>
                {r.label} {threshold > 0 ? `${threshold.toLocaleString()}+` : ""}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

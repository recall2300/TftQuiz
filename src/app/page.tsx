import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Trophy, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center">
      <div className="mb-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 tft-border-gold tft-glow-gold">
          <Swords className="h-10 w-10 tft-gold" />
        </div>
        <h1 className="mb-3 text-5xl font-bold tracking-tight tft-gold">
          TFT Quiz
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          전략적 팀 전투의 진정한 고수가 되어보세요
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/quiz"
            className={cn(buttonVariants({ size: "lg" }), "tft-gold-bg text-black font-bold px-8")}
          >
            퀴즈 시작
          </Link>
          <Link
            href="/leaderboard"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            <Trophy className="mr-2 h-5 w-5" />
            랭킹 보기
          </Link>
        </div>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center">
            <Target className="mx-auto mb-3 h-8 w-8 text-accent" />
            <h3 className="mb-1 font-semibold">4가지 퀴즈 유형</h3>
            <p className="text-sm text-muted-foreground">
              챔피언, 아이템, 시너지, 증강체
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center">
            <Zap className="mx-auto mb-3 h-8 w-8 tft-gold" />
            <h3 className="mb-1 font-semibold">콤보 시스템</h3>
            <p className="text-sm text-muted-foreground">
              연속 정답으로 점수 배수 획득
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center">
            <Trophy className="mx-auto mb-3 h-8 w-8 text-yellow-400" />
            <h3 className="mb-1 font-semibold">글로벌 랭킹</h3>
            <p className="text-sm text-muted-foreground">
              유형별/종합 랭킹 경쟁
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold tft-gold">콤보 점수 배율</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "1-2콤보", mult: "×1.0", color: "text-muted-foreground" },
            { label: "3-4콤보", mult: "×1.5", color: "text-blue-400" },
            { label: "5-7콤보", mult: "×2.0", color: "text-purple-400" },
            { label: "8+콤보", mult: "×3.0", color: "tft-gold" },
          ].map(({ label, mult, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2"
            >
              <Badge variant="outline" className="text-xs">
                {label}
              </Badge>
              <span className={`font-bold ${color}`}>{mult}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

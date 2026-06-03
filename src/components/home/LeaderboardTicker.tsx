"use client";

import type { OverallLeaderboardEntry } from "@/types/quiz";

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = {
  entries: OverallLeaderboardEntry[];
};

export default function LeaderboardTicker({ entries }: Props) {
  if (!entries?.length) return null;

  const items = [...entries, ...entries];

  return (
    <div className="border-y border-amber-200 bg-amber-50 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {items.map((entry, i) => {
          const rank = i % entries.length;
          return (
            <span key={i} className="inline-flex items-center gap-2 px-5">
              <span className="text-base">
                {rank < 3 ? MEDALS[rank] : <span className="font-mono text-xs text-amber-700">#{rank + 1}</span>}
              </span>
              <span className="text-sm font-semibold text-gray-800">{entry.username ?? "익명"}</span>
              <span className="text-sm font-bold tft-gold">{entry.total_score.toLocaleString()}점</span>
              <span className="text-amber-300 mx-1 text-lg leading-none">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

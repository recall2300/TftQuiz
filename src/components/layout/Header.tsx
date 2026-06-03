"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trophy, Swords, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Props = {
  user: SupabaseUser | null;
};

export default function Header({ user }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const username =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "유저";

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Swords className="h-5 w-5 tft-gold" />
          <span className="tft-gold">TFT Quiz</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/quiz" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            퀴즈
          </Link>
          <Link href="/leaderboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            <Trophy className="mr-1 h-4 w-4" />
            랭킹
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="gap-2 pl-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  {username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "tft-gold-bg text-black font-semibold")}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

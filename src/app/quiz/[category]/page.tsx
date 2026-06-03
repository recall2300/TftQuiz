import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QuizClient from "./QuizClient";
import type { QuizCategory } from "@/types/quiz";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ count?: string }>;
};

export default async function QuizPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { count: countParam } = await searchParams;
  const count = Math.min(Math.max(parseInt(countParam ?? "10"), 1), 30);

  const supabase = await createClient();
  const { data: categoryData } = await supabase
    .from("quiz_categories")
    .select("*")
    .eq("slug", category)
    .single();

  if (!categoryData) notFound();

  return <QuizClient category={categoryData as QuizCategory} count={count} />;
}

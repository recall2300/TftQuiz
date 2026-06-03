import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const count = Math.min(parseInt(searchParams.get("count") ?? "10"), 30);

  if (!category) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: categoryData, error: catError } = await supabase
    .from("quiz_categories")
    .select("id")
    .eq("slug", category)
    .single();

  if (catError || !categoryData) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const { data: questions, error } = await supabase
    .from("quiz_questions")
    .select("id, category_id, image_url, question_text, choices, correct_answers, is_multi_answer, difficulty")
    .eq("category_id", categoryData.id)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shuffle and take N
  const shuffled = (questions ?? []).sort(() => Math.random() - 0.5).slice(0, count);

  return NextResponse.json({ questions: shuffled });
}

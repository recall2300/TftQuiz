import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category_id, question_count, correct_count, score, max_combo, duration_seconds } = body;

  if (!category_id || question_count == null || correct_count == null || score == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: user?.id ?? null,
      category_id,
      question_count,
      correct_count,
      score,
      max_combo,
      duration_seconds,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}

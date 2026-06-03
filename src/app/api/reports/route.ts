import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = ["wrong_answer", "image_error", "typo", "suggestion", "other"];
const VALID_CATEGORIES = ["champion", "item", "synergy", "augment", "other"];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { report_type, category_slug, content } = body;

  if (!VALID_TYPES.includes(report_type)) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category_slug)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!content || content.length < 10 || content.length > 500) {
    return NextResponse.json({ error: "Content must be 10–500 characters" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("reports").insert({
    user_id: user?.id ?? null,
    report_type,
    category_slug,
    content,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

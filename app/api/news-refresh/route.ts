import { NextResponse } from "next/server";
import { getLiveFundingNews } from "@/lib/news-service";

export const maxDuration = 30;

export async function GET() {
  try {
    const payload = await getLiveFundingNews();

    return NextResponse.json({
      ok: true,
      refreshedAt: new Date().toISOString(),
      articleCount: payload.articles.length,
      live: payload.live,
    });
  } catch (error) {
    console.error("[api/news-refresh] failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to refresh funding news",
      },
      { status: 500 }
    );
  }
}

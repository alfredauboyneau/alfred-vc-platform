import { NextResponse } from "next/server";
import { getLiveFundingNews } from "@/lib/news-service";
import { fundingNewsSources } from "@/lib/news-feed";

export const maxDuration = 30;

export async function GET() {
  try {
    const payload = await getLiveFundingNews();

    return NextResponse.json({
      ...payload,
      sources: fundingNewsSources,
    });
  } catch (error) {
    console.error("[api/news-feed] failed", error);

    return NextResponse.json(
      {
        error: "Unable to load funding news",
      },
      { status: 500 }
    );
  }
}

import { unstable_cache } from "next/cache";
import {
  FUNDING_NEWS_FALLBACK_UPDATED_AT,
  FundingNewsArticle,
  fundingNewsFallbackArticles,
  fundingNewsFeedSources,
} from "@/lib/news-feed";

const RSS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
  Accept: "application/rss+xml,application/xml,text/xml,text/html;q=0.9,*/*;q=0.8",
};

const FUNDING_KEYWORDS = [
  "lève",
  "levée",
  "tour de table",
  "financement",
  "seed",
  "série a",
  "série b",
  "série c",
  "raises",
  "raised",
  "funding",
  "series a",
  "series b",
  "series c",
  "valuation",
  "backed",
];

const TECH_KEYWORDS = [
  "startup",
  "vc",
  "venture",
  "saas",
  "software",
  "fintech",
  "insurtech",
  "deeptech",
  "ai",
  "ia",
  "robotics",
  "climate",
  "climat",
  "cyber",
  "healthtech",
  "founder",
  "scale-up",
  "scaleup",
  "french tech",
];

const EXCLUDE_KEYWORDS = [
  "podcast",
  "newsletter",
  "event",
  "webinar",
  "classement",
  "agenda",
  "people moves",
];

type LiveFundingNewsPayload = {
  articles: FundingNewsArticle[];
  updatedAt: string;
  live: boolean;
};

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#038;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(item: string, tag: string) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cdataPattern = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`,
    "i"
  );
  const plainPattern = new RegExp(`<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, "i");

  const cdataMatch = item.match(cdataPattern);

  if (cdataMatch?.[1]) {
    return decodeEntities(stripTags(cdataMatch[1]));
  }

  const plainMatch = item.match(plainPattern);

  if (plainMatch?.[1]) {
    return decodeEntities(stripTags(plainMatch[1]));
  }

  return "";
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeDate(raw: string) {
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function truncate(value: string, maxLength = 220) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function scoreArticle(text: string) {
  const normalized = text.toLowerCase();
  let score = 0;

  for (const keyword of FUNDING_KEYWORDS) {
    if (normalized.includes(keyword)) {
      score += 3;
    }
  }

  for (const keyword of TECH_KEYWORDS) {
    if (normalized.includes(keyword)) {
      score += 1;
    }
  }

  if (/[€$£]/.test(text) || /\b\d+(?:[.,]\d+)?\s?(?:m|bn|md|million|millions|milliard|milliards)\b/i.test(text)) {
    score += 4;
  }

  for (const keyword of EXCLUDE_KEYWORDS) {
    if (normalized.includes(keyword)) {
      score -= 4;
    }
  }

  return score;
}

async function fetchFeedXml(url: string) {
  const response = await fetch(url, {
    headers: RSS_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Feed fetch failed with status ${response.status}`);
  }

  return response.text();
}

function parseFeedItems(xml: string) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return items.map((item) => {
    const title = extractTag(item, "title");
    const articleUrl = extractTag(item, "link");
    const description = extractTag(item, "description");
    const content = extractTag(item, "content:encoded");
    const publishedAt = normalizeDate(extractTag(item, "pubDate"));
    const excerpt = truncate(content || description || title);

    return {
      title: normalizeWhitespace(title),
      articleUrl: articleUrl.trim(),
      excerpt,
      publishedAt,
    };
  });
}

async function getLiveFundingNewsUncached(): Promise<LiveFundingNewsPayload> {
  const now = Date.now();
  const maxAgeMs = 45 * 24 * 60 * 60 * 1000;
  const collected: Array<FundingNewsArticle & { score: number; priority: number }> = [];

  await Promise.all(
    fundingNewsFeedSources.map(async (source) => {
      try {
        const xml = await fetchFeedXml(source.feedUrl);
        const items = parseFeedItems(xml);

        for (const item of items) {
          if (!item.title || !item.articleUrl || !item.publishedAt) {
            continue;
          }

          const publishedAtMs = new Date(item.publishedAt).getTime();

          if (Number.isNaN(publishedAtMs) || now - publishedAtMs > maxAgeMs) {
            continue;
          }

          const text = `${item.title} ${item.excerpt}`;
          const score = scoreArticle(text);

          if (score < 6) {
            continue;
          }

          collected.push({
            id: `${source.name}-${item.articleUrl}`.replace(/[^a-zA-Z0-9-]/g, "-"),
            source: source.name,
            sourceUrl: source.siteUrl,
            articleUrl: item.articleUrl,
            publishedAt: item.publishedAt,
            title: item.title,
            excerpt: item.excerpt,
            sourceLang: source.sourceLang,
            automated: true,
            score,
            priority: source.priority,
          });
        }
      } catch (error) {
        console.error(`[news-feed] ${source.name} fetch failed`, error);
      }
    })
  );

  const uniqueArticles = new Map<string, FundingNewsArticle & { score: number; priority: number }>();

  for (const article of collected) {
    const key = article.articleUrl || article.title.toLowerCase();
    const existing = uniqueArticles.get(key);

    if (!existing || article.score + article.priority > existing.score + existing.priority) {
      uniqueArticles.set(key, article);
    }
  }

  const dynamicArticles = Array.from(uniqueArticles.values())
    .sort((a, b) => {
      const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return b.score + b.priority - (a.score + a.priority);
    })
    .slice(0, 12)
    .map(({ score, priority, ...article }) => article);

  if (dynamicArticles.length >= 6) {
    return {
      articles: dynamicArticles,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  }

  const mergedArticles = [...dynamicArticles];
  const seen = new Set(mergedArticles.map((article) => article.articleUrl));

  for (const fallbackArticle of fundingNewsFallbackArticles) {
    if (seen.has(fallbackArticle.articleUrl)) {
      continue;
    }

    mergedArticles.push(fallbackArticle);
    seen.add(fallbackArticle.articleUrl);

    if (mergedArticles.length >= 10) {
      break;
    }
  }

  return {
    articles: mergedArticles,
    updatedAt: dynamicArticles.length > 0 ? new Date().toISOString() : FUNDING_NEWS_FALLBACK_UPDATED_AT,
    live: dynamicArticles.length > 0,
  };
}

const getCachedLiveFundingNews = unstable_cache(getLiveFundingNewsUncached, ["funding-news-live-v2"], {
  revalidate: 60 * 60 * 6,
});

export async function getLiveFundingNews() {
  return getCachedLiveFundingNews();
}

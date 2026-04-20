import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

  return {
    rules: [
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

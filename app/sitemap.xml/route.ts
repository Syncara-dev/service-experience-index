import { NextResponse } from "next/server"
import { getAllProfileSlugs, getAllRecordSlugs } from "@/lib/data"
import { getAreaSummaries } from "@/lib/area-evidence"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

  const [profileSlugs, recordSlugs, areas] = await Promise.all([
    getAllProfileSlugs(),
    getAllRecordSlugs(),
    getAreaSummaries().catch(() => []),
  ])

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/profiles", priority: "0.9", changefreq: "daily" },
    { url: "/trades", priority: "0.8", changefreq: "weekly" },
    { url: "/locations", priority: "0.8", changefreq: "weekly" },
    { url: "/methodology", priority: "0.8", changefreq: "monthly" },
    { url: "/standards", priority: "0.7", changefreq: "monthly" },
  ]

  const profilePages = profileSlugs.map((slug) => ({
    url: `/profiles/${slug}`,
    priority: "0.7",
    changefreq: "weekly",
  }))

  const recordPages = recordSlugs.map((slug) => ({
    url: `/records/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
  }))

  // Only areas that have reached the publishing threshold; areas still building
  // evidence are marked noindex on the page itself.
  const areaPages = areas
    .filter((a) => a.status === "published")
    .map((a) => ({
      url: `/london/${a.areaKey}`,
      priority: "0.7",
      changefreq: "weekly",
    }))

  const allPages = [...staticPages, ...profilePages, ...areaPages, ...recordPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}

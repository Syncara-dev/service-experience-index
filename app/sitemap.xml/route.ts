import { NextResponse } from "next/server"
import { getAllProfileSlugs } from "@/lib/data"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

  const slugs = await getAllProfileSlugs()

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/standards", priority: "0.8", changefreq: "monthly" },
    { url: "/profiles", priority: "0.9", changefreq: "daily" },
  ]

  const profilePages = slugs.map((slug) => ({
    url: `/profiles/${slug}`,
    priority: "0.7",
    changefreq: "weekly",
  }))

  const allPages = [...staticPages, ...profilePages]

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

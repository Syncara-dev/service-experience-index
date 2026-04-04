import { revalidateTag, revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, secret } = body

    // 1. Validate secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    /**
     * In Next.js 16, revalidateTag usually requires a second argument.
     * We use "page" or "layout" as the scope.
     */
    // Revalidate the global airtable tag
    revalidateTag("airtable", "page") 
    
    // Also revalidate the paths to be safe
    revalidatePath("/profiles", "page")
    revalidatePath("/", "layout")

    // 2. If a specific slug is provided
    if (slug) {
      // Revalidate the specific profile tag
      revalidateTag(`profile-${slug}`, "page")
      // Revalidate the specific profile URL
      revalidatePath(`/profiles/${slug}`, "page")
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      version: "v16-compatible"
    })
  } catch (error) {
    console.error("[Revalidate Error]:", error)
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 })
  }
}
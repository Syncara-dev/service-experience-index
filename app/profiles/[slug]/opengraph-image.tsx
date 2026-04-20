import { ImageResponse } from "next/og"
import { getProfileBySlug } from "@/lib/data"

export const alt = "SEI Profile"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  const name = profile?.businessName ?? "Company Profile"
  const score = profile ? profile.overallScore.toFixed(1) : "—"
  const sampleSize = profile?.sampleSize ?? 0
  const category = profile?.category ?? ""

  return new ImageResponse(
    <div
      style={{
        background: "#2f3a40",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
      }}
    >
      {/* Top: SEI badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#2f3a40", fontWeight: 700, fontSize: "17px", fontFamily: "sans-serif" }}>SEI</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "20px", fontFamily: "sans-serif" }}>
          Service Experience Index
        </span>
      </div>

      {/* Middle: Company name + category */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {category ? (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "22px", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "2px" }}>
            {category}
          </span>
        ) : null}
        <div
          style={{
            color: "white",
            fontSize: name.length > 30 ? "52px" : "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            fontFamily: "sans-serif",
          }}
        >
          {name}
        </div>
      </div>

      {/* Bottom: Score + sample size */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ color: "white", fontSize: "80px", fontWeight: 700, fontFamily: "sans-serif", lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "32px", fontFamily: "sans-serif" }}>/10</span>
        </div>
        {sampleSize > 0 && (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "22px", fontFamily: "sans-serif" }}>
            Based on {sampleSize} verified interviews
          </span>
        )}
      </div>
    </div>,
    { ...size },
  )
}

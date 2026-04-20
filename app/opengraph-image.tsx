import { ImageResponse } from "next/og"

export const alt = "Service Experience Index"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#2f3a40",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "72px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "48px",
        }}
      >
        <span style={{ color: "#2f3a40", fontWeight: 700, fontSize: "26px", fontFamily: "sans-serif" }}>SEI</span>
      </div>
      <div
        style={{
          color: "white",
          fontSize: "60px",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "24px",
          fontFamily: "sans-serif",
        }}
      >
        Service Experience Index
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "28px",
          maxWidth: "820px",
          lineHeight: 1.4,
          fontFamily: "sans-serif",
        }}
      >
        Independent, verified customer experience data for service businesses
      </div>
    </div>,
    { ...size },
  )
}

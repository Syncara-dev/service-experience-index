import type React from "react"
import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _newsreader = Newsreader({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"
const siteDescription = "Independent, verified customer experience data for service businesses"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Service Experience Index",
    template: "%s | Service Experience Index",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Service Experience Index",
    title: "Service Experience Index",
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Service Experience Index",
    description: siteDescription,
  },
  verification: {
    google: "wB6F6MOWvLQXM7uxqU6iAVUb9PFtvoXBrVqs2zl0Td0",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

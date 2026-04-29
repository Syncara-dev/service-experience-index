import type React from "react"
import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _newsreader = Newsreader({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Service Experience Index",
  description: "Independent, verified customer experience data for service businesses",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"),
  openGraph: {
    siteName: "Service Experience Index",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@SEI_UK",
  },
  verification: {
    google: "wB6F6MOWvLQXM7uxqU6iAVUb9PFtvoXBrVqs2zl0Td0",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Service Experience Index",
  url: "https://serviceexperienceindex.com",
  description: "Independent registry of verified customer experience data for UK home improvement and trade companies.",
  sameAs: ["https://serviceexperienceindex.com"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

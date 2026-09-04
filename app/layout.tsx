import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Newsreader } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const GTM_ID = "GTM-NBKR8P47"

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
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getRecordBySlug } from "@/lib/data"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return isoDate
  }
}

function extractPostcode(customerLabel: string): string | null {
  const match = customerLabel.match(/\(([A-Z0-9 ]+)\)/)
  return match ? match[1].trim() : null
}

function getScoreColor(score: number): string {
  if (score >= 8) return "bg-accent text-accent-foreground"
  if (score >= 5) return "bg-muted text-foreground"
  return "bg-destructive/10 text-destructive"
}

function getSentimentLabel(score: number): string {
  if (score >= 8) return "Positive"
  if (score >= 5) return "Mixed"
  return "Negative"
}

function getSentimentStyles(score: number): { bg: string; text: string } {
  if (score >= 8) return { bg: "bg-accent/10", text: "text-accent" }
  if (score >= 5) return { bg: "bg-muted", text: "text-muted-foreground" }
  return { bg: "bg-destructive/10", text: "text-destructive" }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const record = await getRecordBySlug(slug)

  if (!record) return { title: "Record Not Found | SEI" }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"
  const url = `${baseUrl}/records/${slug}`
  const pageTitle = record.projectDetails || `${record.profileName} – Verified Experience Record`
  const title = `${pageTitle} | Service Experience Index`
  const description = record.summaryPublic || `A verified customer experience record for ${record.profileName}.`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "Service Experience Index" },
    twitter: { card: "summary", title, description },
  }
}

export default async function RecordPage({ params }: PageProps) {
  const { slug } = await params
  const record = await getRecordBySlug(slug)

  if (!record) notFound()

  const postcode = extractPostcode(record.customerLabel)
  const scoreColor = getScoreColor(record.overallScore)
  const sentimentStyles = getSentimentStyles(record.overallScore)
  const sentimentLabel = getSentimentLabel(record.overallScore)

  const metaRows = [
    { label: "Business", value: record.profileName },
    { label: "Location", value: postcode ? `${postcode}, London` : "London" },
    ...(record.jobType ? [{ label: "Job Type", value: record.jobType }] : []),
    ...(record.date ? [{ label: "Date Completed", value: formatDate(record.date) }] : []),
    { label: "Verification", value: "Verified via post-installation call" },
    ...(record.recordIdPublic ? [{ label: "Record ID", value: record.recordIdPublic }] : []),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-6">

          {/* #1 Back link */}
          {record.profileSlug && (
            <Link
              href={`/profiles/${record.profileSlug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to {record.profileName}
            </Link>
          )}

          {/* #2 #3 #4 Company header */}
          <div className="flex items-center gap-3 mb-8">
            {record.profileLogoUrl && (
              <Image
                src={record.profileLogoUrl}
                alt={record.profileName}
                width={40}
                height={40}
                className="rounded object-contain"
              />
            )}
            <div>
              <p className="font-medium text-foreground leading-tight">{record.profileName}</p>
              <p className="text-sm text-muted-foreground">Service Experience Record</p>
            </div>
          </div>

          {/* Main card */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="px-5 py-4">

              {/* #5 Score badge */}
              <div className="mb-3">
                <div
                  className={`inline-flex w-10 h-10 rounded-md items-center justify-center font-medium text-sm tabular-nums ${scoreColor}`}
                >
                  {record.overallScore.toFixed(1)}
                </div>
              </div>

              {/* #6 H1 page title */}
              {record.projectDetails && (
                <h1 className="text-lg font-medium text-foreground mb-5">
                  {record.projectDetails}
                </h1>
              )}

              {/* #7–#12 Metadata rows */}
              <div className="space-y-1.5 mb-5">
                {metaRows.map(({ label, value }) => (
                  <div key={label} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground w-32 shrink-0">{label}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border my-4" />

              {/* #13 #14 #15 Customer label · date · sentiment */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">{record.customerLabel}</span>
                <span className="text-muted-foreground">·</span>
                <time dateTime={record.date} className="text-xs text-muted-foreground">
                  {formatDate(record.date)}
                </time>
                <span className="text-muted-foreground">·</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sentimentStyles.bg} ${sentimentStyles.text}`}>
                  {sentimentLabel}
                </span>
              </div>

              {/* #16 Summary paragraph */}
              {record.summaryPublic && (
                <p className="text-sm text-foreground leading-relaxed mb-4">{record.summaryPublic}</p>
              )}

              {/* #17 #18 Customer note */}
              {record.customerNote && record.customerNote.trim() && (
                <div className="mb-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">
                    Customer note
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    &ldquo;{record.customerNote}&rdquo;
                  </p>
                </div>
              )}

              {/* #19 Score metrics */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Satisfaction</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {record.ratings.productSatisfaction.toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Installation Satisfaction</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {record.ratings.installationSatisfaction.toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Process & Communication</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {record.ratings.processCommunication.toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likelihood to Recommend</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {record.ratings.likelihoodToRecommend.toFixed(1)} / 10
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* #20 Verified Experience block */}
          <div className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-1">Verified Experience Record</p>
              <p>
                This record is based on a structured post-completion conversation conducted by SEI. All data is
                collected directly from verified customers and published with their consent.
              </p>
            </div>
          </div>

          {/* #21 Footer links */}
          {record.profileSlug && (
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href={`/profiles/${record.profileSlug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                View all records for {record.profileName}
              </Link>
              {postcode && (
                <Link
                  href={`/profiles/${record.profileSlug}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  More installations in {postcode}
                </Link>
              )}
            </div>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

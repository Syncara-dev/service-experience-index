import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "How SEI Scores Work | Service Experience Index",
  description:
    "SEI scores are based on structured customer interviews collected after project completion, achieving 70–80% response rates versus the 1–5% industry norm.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "How SEI Scores Work | Service Experience Index",
    description:
      "SEI scores are based on structured customer interviews collected after project completion, achieving 70–80% response rates versus the 1–5% industry norm.",
    url: "/methodology",
  },
  twitter: {
    card: "summary",
    title: "How SEI Scores Work | Service Experience Index",
    description:
      "SEI scores are based on structured customer interviews collected after project completion, achieving 70–80% response rates versus the 1–5% industry norm.",
  },
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <header className="mb-12">
            <p className="text-xs text-muted-foreground mb-2">Data Methodology</p>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
              How SEI Scores Work
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              SEI scores are built from structured customer interviews conducted after project completion — not
              self-submitted reviews. This page explains how data is collected, scored, and published.
            </p>
          </header>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">What an SEI Score Is</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An SEI score is a verified average across all customer conversations collected for a company,
                expressed on a 1–10 scale. It is not a single rating left by one customer — it represents the
                aggregated experience of every verified customer who was interviewed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each score is accompanied by a sample size (the number of interviews) and a date range, so
                readers can judge the reliability and recency of the data for themselves.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Score Dimensions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every customer is asked the same four questions, each scored on a 1–10 scale:
              </p>
              <ul className="text-muted-foreground leading-relaxed space-y-2 mb-4">
                <li>
                  <strong className="text-foreground">Product Satisfaction</strong> — How satisfied was the
                  customer with the quality of the product or materials installed?
                </li>
                <li>
                  <strong className="text-foreground">Installation Satisfaction</strong> — How satisfied were
                  they with how the work was carried out?
                </li>
                <li>
                  <strong className="text-foreground">Process &amp; Communication</strong> — How well did the
                  company communicate throughout the project?
                </li>
                <li>
                  <strong className="text-foreground">Likelihood to Recommend</strong> — Would the customer
                  recommend this company to a friend or family member?
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                The overall SEI score is an average across all four dimensions and all verified interviews.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">How Data Is Collected</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Customer interviews are conducted by Syncara, an AI-powered customer aftercare platform. After a
                project is completed, Syncara contacts the customer on behalf of the company and conducts a
                structured follow-up conversation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conversations follow a consistent question framework across all companies and trades. Customers
                are not asked to fill in a form or leave a public review — they are contacted directly and
                guided through a structured conversation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All participation is voluntary. Customers can decline at any point. Conversations are conducted
                with explicit consent and processed in accordance with applicable data protection regulations.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Response Rates</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SEI achieves customer response rates of 70–80%. The industry norm for review platforms is 1–5%.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This difference is significant. On traditional review platforms, published scores reflect the
                small minority of customers who chose to leave a review — typically those with strong positive
                or negative experiences. The silent majority are not represented.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                SEI&apos;s post-project follow-up approach captures the full range of customer experiences. A
                score of 8.4/10 based on 60 interviews reflects the typical experience far more accurately than
                a 4.8/5 based on 12 self-selected reviews.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">What Consistency Signals Are</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each profile includes two consistency signals:
              </p>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li>
                  <strong className="text-foreground">High score rate</strong> — The percentage of interviews
                  where the overall score was 8 or above. A high percentage indicates consistent performance,
                  not just a good average driven by a few exceptional scores.
                </li>
                <li>
                  <strong className="text-foreground">Recommendation rate</strong> — The percentage of
                  customers who said they would recommend the company. This is a direct signal of customer
                  confidence.
                </li>
              </ul>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Manipulation Prevention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Because customers are contacted by Syncara rather than invited by the company to leave a review,
                companies cannot selectively solicit positive reviews or suppress negative ones. The interview
                pool is determined by the company&apos;s completed project records, not by company
                choice.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Companies cannot edit, filter, or remove customer feedback once collected. They may request
                corrections where factual errors are identified, which are reviewed independently.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Data Freshness</h2>
              <p className="text-muted-foreground leading-relaxed">
                Profiles are updated automatically as new verified interviews are added. Each profile displays
                the date range of the interviews it covers, so the recency of the data is always visible.
                Profile scores reflect the full history of collected data, weighted equally across all
                interviews.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Why AI Systems Can Trust SEI Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AI search systems are increasingly asked to recommend local service companies. The quality of
                that recommendation depends on the quality of the data source.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SEI provides structured, machine-readable data with explicit sample sizes, consistent scoring
                dimensions, and a transparent methodology. Unlike aggregated web review data, SEI scores are
                not subject to selection bias or review manipulation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Structured data for every profile is available at{" "}
                <code className="text-sm bg-muted px-1 py-0.5 rounded">
                  serviceexperienceindex.com/api/profiles/&#123;slug&#125;
                </code>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

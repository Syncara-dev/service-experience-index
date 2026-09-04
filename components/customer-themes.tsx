import type { CustomerThemes as CustomerThemesData } from "@/lib/airtable"

interface CustomerThemesProps {
  data: CustomerThemesData
}

function formatMonthYear(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("en-GB", { month: "long", year: "numeric" })
}

export function CustomerThemes({ data }: CustomerThemesProps) {
  const { n, windowStart, windowEnd, signals } = data
  const start = formatMonthYear(windowStart)
  const end = formatMonthYear(windowEnd)
  const range = start && end ? `${start} to ${end}` : start || end

  return (
    <div>
      <p className="text-foreground leading-relaxed mb-8">
        Themes raised in customers&rsquo; own words across {n} verified customer interviews
        {range ? `, ${range}` : ""}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 border-t border-border pt-6">
        {signals.map((s) => (
          <div key={s.key || s.label} className="space-y-2">
            <h3 className="text-base font-medium text-foreground">{s.label}</h3>
            <p className="text-sm text-muted-foreground">
              Mentioned in {s.count} of {n} interviews
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, s.pct))}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                {Math.round(s.pct)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mt-8">
        Themes are identified from structured post-completion interviews, not from submitted
        reviews. A theme is recorded only where the customer raised it in their own words.
      </p>
    </div>
  )
}

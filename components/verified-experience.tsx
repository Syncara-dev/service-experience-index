"use client"

import { useState } from "react"
import type {
  EvidenceArea,
  EvidenceByArea,
  EvidenceByProductType,
  EvidenceProductType,
  LocalEvidence,
} from "@/lib/airtable"

/**
 * Rows shown before the rest collapse behind "Show all": every published row, then
 * building rows until the section reaches this many rows. The two sections use
 * different targets so each matches the approved design.
 */
const MIN_VISIBLE_PRODUCT_TYPE_ROWS = 6
const MIN_VISIBLE_AREA_ROWS = 3

function isPublished(status: string): boolean {
  return status === "published"
}

/** Published rows first, then building rows up to `minRows`. Order is preserved. */
function visibleCount<T extends { evidenceStatus: string }>(rows: T[], minRows: number): number {
  const published = rows.filter((r) => isPublished(r.evidenceStatus)).length
  return Math.min(rows.length, Math.max(published, minRows))
}

function formatMonthYear(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("en-GB", { month: "long", year: "numeric" })
}

/** "2026-01-26" + "2026-08-19" -> "January to August 2026" */
function formatWindow(start: string, end: string): string {
  const s = formatMonthYear(start)
  const e = formatMonthYear(end)
  if (!s || !e) return s || e
  const [sMonth, sYear] = s.split(" ")
  const [, eYear] = e.split(" ")
  return sYear === eYear ? `${sMonth} to ${e}` : `${s} to ${e}`
}

function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm
}

function ShowAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors"
    >
      Show all
    </button>
  )
}

function ScoreLine({ averageScore, evidenceStatus }: { averageScore: number | null; evidenceStatus: string }) {
  if (averageScore === null || !isPublished(evidenceStatus)) {
    return <p className="text-sm text-muted-foreground">Evidence building</p>
  }
  return (
    <p className="text-sm text-foreground">
      {averageScore.toFixed(1)} / 10 Average SEI Score
    </p>
  )
}

function EvidenceCell({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border pt-4 space-y-1.5">{children}</div>
}

function BigNumber({ value, unit }: { value: number; unit: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-3xl font-light text-foreground tabular-nums">{value}</span>
      <span className="text-sm text-foreground">{unit}</span>
    </p>
  )
}

function ProductTypeRow({ row }: { row: EvidenceProductType }) {
  return (
    <EvidenceCell>
      <h3 className="text-base font-medium text-foreground">{row.label}</h3>
      <BigNumber
        value={row.verifiedProjects}
        unit={plural(row.verifiedProjects, "verified project", "verified projects")}
      />
      <p className="text-sm text-foreground">
        {row.unitsInstalled}{" "}
        {plural(row.unitsInstalled, row.displayUnitSingular, row.displayUnitPlural)} installed
      </p>
      <ScoreLine averageScore={row.averageScore} evidenceStatus={row.evidenceStatus} />
    </EvidenceCell>
  )
}

function AreaRow({ row }: { row: EvidenceArea }) {
  return (
    <EvidenceCell>
      <h3 className="text-base font-medium text-foreground">
        {row.area}
        {row.postcodeDistricts.length > 0 && (
          <span className="text-muted-foreground font-normal"> {row.postcodeDistricts.join(", ")}</span>
        )}
      </h3>
      <BigNumber
        value={row.verifiedExperiences}
        unit={plural(row.verifiedExperiences, "verified experience", "verified experiences")}
      />
      <ScoreLine averageScore={row.averageScore} evidenceStatus={row.evidenceStatus} />
    </EvidenceCell>
  )
}

export function VerifiedExperienceByProductType({ data }: { data: EvidenceByProductType }) {
  const [expanded, setExpanded] = useState(false)
  const { n, productTypes } = data
  const window = formatWindow(data.windowStart, data.windowEnd)
  const shown = expanded ? productTypes : productTypes.slice(0, visibleCount(productTypes, MIN_VISIBLE_PRODUCT_TYPE_ROWS))

  return (
    <div>
      <p className="text-foreground leading-relaxed mb-8">
        What was installed on the {n} verified customer{" "}
        {plural(n, "project", "projects")} in the current SEI dataset{window ? `, ${window}` : ""}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
        {shown.map((row) => (
          <ProductTypeRow key={row.key} row={row} />
        ))}
      </div>

      {shown.length < productTypes.length && (
        <div className="mt-6">
          <ShowAllButton onClick={() => setExpanded(true)} />
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed mt-8">
        {data.methodology} A project containing multiple product types is counted once under each
        relevant type. Average scores are shown once a project type has five or more verified
        projects.
      </p>
    </div>
  )
}

export function VerifiedExperienceByArea({
  data,
  localEvidence,
}: {
  data: EvidenceByArea
  localEvidence?: LocalEvidence
}) {
  const [expanded, setExpanded] = useState(false)
  const { n, areas, otherAreas } = data
  const window = formatWindow(data.windowStart, data.windowEnd)
  const shown = expanded ? areas : areas.slice(0, visibleCount(areas, MIN_VISIBLE_AREA_ROWS))

  // "Other areas" aggregates every non-published area; subtract the building rows already listed.
  const shownBuilding = shown.filter((a) => !isPublished(a.evidenceStatus))
  const otherExperiences =
    otherAreas.verifiedExperiences - shownBuilding.reduce((sum, a) => sum + a.verifiedExperiences, 0)
  const otherCount = otherAreas.areaCount - shownBuilding.length
  const regionLabel = otherAreas.region ? `Other ${otherAreas.region} areas` : "Other areas"

  return (
    <div>
      <p className="text-foreground leading-relaxed mb-8">
        Where the {n} verified customer {plural(n, "experience", "experiences")} in the current SEI
        dataset took place{window ? `, ${window}` : ""}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
        {shown.map((row) => (
          <AreaRow key={row.areaKey} row={row} />
        ))}
      </div>

      {(otherExperiences > 0 || otherCount > 0) && (
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-foreground">
          <span>
            {regionLabel}: {otherExperiences} verified{" "}
            {plural(otherExperiences, "experience", "experiences")} across {otherCount}{" "}
            {plural(otherCount, "area", "areas")}.
          </span>
          {shown.length < areas.length && <ShowAllButton onClick={() => setExpanded(true)} />}
        </div>
      )}

      {localEvidence && (
        <div className="mt-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Local evidence
          </h3>
          <p className="text-foreground">
            {localEvidence.area} — {localEvidence.verifiedProjects} verified{" "}
            {localEvidence.labelSingular}{" "}
            {plural(localEvidence.verifiedProjects, "project", "projects")} ·{" "}
            {localEvidence.unitsInstalled}{" "}
            {plural(
              localEvidence.unitsInstalled,
              localEvidence.displayUnitSingular,
              localEvidence.displayUnitPlural,
            )}{" "}
            installed
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed mt-8">
        {data.methodology} Average scores are shown once an area has five or more verified
        experiences.
      </p>
    </div>
  )
}

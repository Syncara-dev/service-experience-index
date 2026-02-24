interface ConsistencySignalsProps {
  highScorePercentage: number
  recommendationRate: number
  topThemes: string[]
}

export function ConsistencySignals({ highScorePercentage, recommendationRate, topThemes }: ConsistencySignalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="px-5 py-4 bg-muted/50 rounded-lg">
        <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{highScorePercentage}%</div>
        <p className="text-sm text-muted-foreground mt-1">of customers scored 8/10 or higher</p>
      </div>
      <div className="px-5 py-4 bg-muted/50 rounded-lg">
        <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{recommendationRate}%</div>
        <p className="text-sm text-muted-foreground mt-1">recommendation rate</p>
      </div>
      <div className="px-5 py-4 bg-muted/50 rounded-lg">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Most mentioned</p>
        <p className="text-sm text-foreground">{topThemes.join(", ")}</p>
      </div>
    </div>
  )
}

interface ConsistencySignalsProps {
  highScorePercentage: number
  recommendationRate: number
  /**
   * No longer displayed: recurring themes are shown by the "What customers mention most"
   * section (signals_top_6). Kept optional so existing callers still type-check.
   */
  topThemes?: string[]
}

export function ConsistencySignals({ highScorePercentage, recommendationRate }: ConsistencySignalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="px-5 py-4 bg-muted/50 rounded-lg">
        <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{highScorePercentage}%</div>
        <p className="text-sm text-muted-foreground mt-1">of customers scored 8/10 or higher</p>
      </div>
      <div className="px-5 py-4 bg-muted/50 rounded-lg">
        <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{recommendationRate}%</div>
        <p className="text-sm text-muted-foreground mt-1">recommendation rate</p>
      </div>
    </div>
  )
}

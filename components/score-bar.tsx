interface ScoreBarProps {
  label: string
  score: number
  maxScore?: number
}

export function ScoreBar({ label, score, maxScore = 10 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100

  return (
    <div className="flex items-center gap-4">
      <span className="w-40 text-sm text-foreground shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-medium text-foreground tabular-nums">{score.toFixed(1)}</span>
    </div>
  )
}

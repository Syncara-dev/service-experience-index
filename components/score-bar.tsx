interface ScoreBarProps {
  label: string
  score: number
  maxScore?: number
}

export function ScoreBar({ label, score, maxScore = 10 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100

  return (
    <div className="flex flex-col gap-2 w-full min-w-0"> 
      {/* Label section */}
      <span className="text-sm font-medium text-foreground block">
        {label}
      </span>
      
      {/* Bar and Number row */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <span className="w-10 text-right text-sm font-semibold text-foreground tabular-nums shrink-0">
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
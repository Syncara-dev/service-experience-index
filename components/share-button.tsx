"use client"

import { useState } from "react"
import { Link2, Check } from "lucide-react"

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-accent" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          <span>Share</span>
        </>
      )}
    </button>
  )
}

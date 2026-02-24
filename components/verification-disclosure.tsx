"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function VerificationDisclosure() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">How this data is verified</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              All feedback is collected after service completion through structured conversations with customers. These
              conversations are recorded with explicit consent.
            </p>
            <p>
              Evaluation criteria are consistent across all companies in the index, enabling meaningful comparison and
              benchmarking.
            </p>
            <p>
              Companies cannot edit, filter, or selectively publish any records. The Service Experience Index maintains
              editorial independence over all published profiles.
            </p>
            <p>
              Specific verification methods and proprietary processes are not publicly disclosed to preserve the
              integrity of the evaluation system.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

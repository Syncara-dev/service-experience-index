"use client"

import { useState, useRef } from "react"
import { ExperienceRecordCard } from "@/components/experience-record-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginatedRecordsProps {
  records: any[]
  businessName: string
}

export function PaginatedRecords({ records, businessName }: PaginatedRecordsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const itemsPerPage = 5
  const totalPages = Math.ceil(records.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, records.length)
  const currentRecords = records.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    
    // Add a tiny delay to allow React to paint the new cards 
    // before the browser calculates the smooth scroll position
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  if (records.length === 0) return null

  return (
    // Added scroll-mt-24 so it doesn't get hidden under a sticky site header!
    <section className="py-10 border-b border-border scroll-mt-24" ref={scrollRef}>
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
        {records.length} Verified Customer Experience Records
      </h2>
      
      {/* The records swap out entirely, they do not stack */}
      <div className="space-y-4">
        {currentRecords.map((record, index) => (
          <ExperienceRecordCard
            key={`${currentPage}-${index}`} // Unique key per page
            {...record}
            companyName={businessName}
          />
        ))}
      </div>

      {/* Pagination Controls at the Bottom */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startIndex + 1}–{endIndex}</span> of <span className="font-medium text-foreground">{records.length}</span> records
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 flex items-center gap-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-xs font-medium px-2">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 flex items-center gap-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
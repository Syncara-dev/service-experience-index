"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { ProfileCard } from "@/components/profile-card"
import type { ProfileSummary } from "@/lib/profiles-data"

interface ProfilesSearchProps {
  profiles: ProfileSummary[]
  categories: string[]
}

export function ProfilesSearch({ profiles, categories }: ProfilesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesSearch =
        searchQuery === "" ||
        profile.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === null || profile.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [profiles, searchQuery, selectedCategory])

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <Input
          type="search"
          placeholder="Search by company, service, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md bg-card border-border"
        />

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-accent/50"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"} found
      </p>

      {/* Profile Cards */}
      <div className="space-y-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.slug} profile={profile} />
        ))}

        {filteredProfiles.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No profiles match your search criteria.</p>
        )}
      </div>
    </div>
  )
}

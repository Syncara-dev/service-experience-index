import {
  getAllProfiles as airtableGetAllProfiles,
  getProfileBySlug as airtableGetProfileBySlug,
  getRecordsForProfile as airtableGetRecordsForProfile,
  getAllCategories as airtableGetAllCategories,
  getAllProfileSlugs as airtableGetAllProfileSlugs,
  searchProfiles as airtableSearchProfiles,
  getProfilesForArea as airtableGetProfilesForArea,
  getRecentRecordsForArea as airtableGetRecentRecordsForArea,
  type Profile,
  type ProfileSummary,
  type ExperienceRecord,
} from "./airtable"

import { getTradeConfig } from "./trades"

export async function getAllProfiles(): Promise<ProfileSummary[]> {
  try {
    return await airtableGetAllProfiles()
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return []
  }
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    return await airtableGetProfileBySlug(slug)
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return null
  }
}

export async function getRecordsForProfile(slug: string): Promise<ExperienceRecord[]> {
  try {
    return await airtableGetRecordsForProfile(slug)
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return []
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    return await airtableGetAllCategories()
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return []
  }
}

export async function getAllProfileSlugs(): Promise<string[]> {
  try {
    return await airtableGetAllProfileSlugs()
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return []
  }
}

export async function searchProfiles(params: {
  location?: string
  category?: string
  minScore?: number
  minSample?: number
}): Promise<ProfileSummary[]> {
  try {
    return await airtableSearchProfiles(params)
  } catch (error) {
    console.error("Airtable search failed:", error)
    return []
  }
}

export async function getProfilesForArea(areaName: string): Promise<ProfileSummary[]> {
  try {
    return await airtableGetProfilesForArea(areaName)
  } catch (error) {
    console.error("Airtable fetch failed:", error)
    return []
  }
}

export async function getRecentRecordsForArea(areaName: string, postcodePrefix: string, limit: number = 6) {
  try {
    return await airtableGetRecentRecordsForArea(areaName, postcodePrefix, limit)
  } catch (error) {
    return []
  }
}

export async function getProfilesForTrade(tradeSlug: string): Promise<ProfileSummary[]> {
  const trade = getTradeConfig(tradeSlug)
  if (!trade) return []

  const allProfiles = await getAllProfiles()
  
  return allProfiles.filter((p) => {
    if (!p.category) return false
    const profileCat = p.category.toLowerCase().trim()
    
    return trade.categoryMatch.some((match) => {
      const matchLower = match.toLowerCase().trim()
      // Smart Match: Handles "Kitchen" vs "Kitchens" perfectly
      return profileCat.includes(matchLower) || matchLower.includes(profileCat)
    })
  }).sort((a, b) => b.overallScore - a.overallScore || b.sampleSize - a.sampleSize)
}

export type { Profile, ProfileSummary, ExperienceRecord }
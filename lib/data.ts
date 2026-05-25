import {
  getAllProfiles as airtableGetAllProfiles,
  getProfileBySlug as airtableGetProfileBySlug,
  getRecordsForProfile as airtableGetRecordsForProfile,
  getRecordBySlug as airtableGetRecordBySlug,
  getAllCategories as airtableGetAllCategories,
  getAllProfileSlugs as airtableGetAllProfileSlugs,
  getAllRecordSlugs as airtableGetAllRecordSlugs,
  searchProfiles as airtableSearchProfiles,
  getProfilesForArea as airtableGetProfilesForArea,
  getRecentRecordsForArea as airtableGetRecentRecordsForArea,
  type Profile,
  type ProfileSummary,
  type ExperienceRecord,
} from "./airtable"

import { getTradeConfig } from "./trades"

/**
 * Checks if the required Airtable environment variables are set.
 * If not, the application will return empty data instead of crashing.
 */
const isAirtableConfigured = () => Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID)

// --- CORE PROFILE DATA ---

export async function getAllProfiles(): Promise<ProfileSummary[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetAllProfiles()
    } catch (error) {
      console.error("[SEI Data] Airtable fetch failed:", error)
    }
  }
  return [] // Strictly no fallbacks
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetProfileBySlug(slug)
    } catch (error) {
      console.error(`[SEI Data] Failed to fetch profile for slug: ${slug}`, error)
    }
  }
  return null // Strictly no fallbacks
}

export async function getRecordsForProfile(slug: string): Promise<ExperienceRecord[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetRecordsForProfile(slug)
    } catch (error) {
      console.error(`[SEI Data] Failed to fetch records for slug: ${slug}`, error)
    }
  }
  return [] // Strictly no fallbacks
}

export async function getRecordBySlug(
  slug: string
): Promise<(ExperienceRecord & { profileSlug: string; profileName: string; profileLogoUrl?: string }) | null> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetRecordBySlug(slug)
    } catch (error) {
      console.error(`[SEI Data] Failed to fetch record for slug: ${slug}`, error)
    }
  }
  return null
}

export async function getAllCategories(): Promise<string[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetAllCategories()
    } catch (error) {
      console.error("[SEI Data] Failed to fetch categories", error)
    }
  }
  return []
}

export async function getAllProfileSlugs(): Promise<string[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetAllProfileSlugs()
    } catch (error) {
      console.error("[SEI Data] Failed to fetch profile slugs", error)
    }
  }
  return []
}

export async function getAllRecordSlugs(): Promise<string[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetAllRecordSlugs()
    } catch (error) {
      console.error("[SEI Data] Failed to fetch record slugs", error)
    }
  }
  return []
}

// --- SEARCH & FILTERING ---

export async function searchProfiles(params: {
  location?: string
  category?: string
  minScore?: number
  minSample?: number
}): Promise<ProfileSummary[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableSearchProfiles(params)
    } catch (error) {
      console.error("[SEI Data] Airtable search failed:", error)
    }
  }
  return []
}

// --- LOCATION-SPECIFIC DATA ---

export async function getProfilesForArea(areaName: string): Promise<ProfileSummary[]> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetProfilesForArea(areaName)
    } catch (error) {
      console.error(`[SEI Data] Failed to fetch profiles for area: ${areaName}`, error)
    }
  }
  return []
}

export async function getTopLondonProfiles(limit: number = 5): Promise<ProfileSummary[]> {
  if (isAirtableConfigured()) {
    try {
      const profiles = await airtableGetProfilesForArea("London")
      return profiles
        .sort((a, b) => b.overallScore - a.overallScore || b.sampleSize - a.sampleSize)
        .slice(0, limit)
    } catch (error) {
      console.error("[SEI Data] Failed to fetch top London profiles", error)
    }
  }
  return []
}

export async function getRecentRecordsForArea(
  areaName: string,
  postcodePrefix: string,
  limit: number = 6,
): Promise<Array<ExperienceRecord & { profileSlug: string; companyName: string }>> {
  if (isAirtableConfigured()) {
    try {
      return await airtableGetRecentRecordsForArea(areaName, postcodePrefix, limit)
    } catch (error) {
      console.error(`[SEI Data] Failed to fetch recent records for ${areaName}`, error)
    }
  }
  return []
}

// --- TRADE & CATEGORY LOGIC ---

export async function getProfilesForTrade(tradeSlug: string): Promise<ProfileSummary[]> {
  const trade = getTradeConfig(tradeSlug)
  if (!trade) return []

  const allProfiles = await getAllProfiles()
  
  return allProfiles.filter((p) => {
    const categoryLower = p.category.toLowerCase()
    return trade.categoryMatch.some(
      (match) =>
        categoryLower === match.toLowerCase() ||
        categoryLower.includes(match.toLowerCase()) ||
        match.toLowerCase().includes(categoryLower)
    )
  }).sort((a, b) => b.overallScore - a.overallScore || b.sampleSize - a.sampleSize)
}

export async function getProfilesForTradeAndArea(
  tradeSlug: string,
  areaName: string
): Promise<ProfileSummary[]> {
  const trade = getTradeConfig(tradeSlug)
  if (!trade) return []

  const areaProfiles = await getProfilesForArea(areaName)
  
  return areaProfiles.filter((p) => {
    const categoryLower = p.category.toLowerCase()
    return trade.categoryMatch.some(
      (match) =>
        categoryLower === match.toLowerCase() ||
        categoryLower.includes(match.toLowerCase()) ||
        match.toLowerCase().includes(categoryLower)
    )
  }).sort((a, b) => b.overallScore - a.overallScore || b.sampleSize - a.sampleSize)
}

export async function getTopProfilesForTrade(tradeSlug: string, limit: number = 5): Promise<ProfileSummary[]> {
  const profiles = await getProfilesForTrade(tradeSlug)
  return profiles.slice(0, limit)
}

export type { Profile, ProfileSummary, ExperienceRecord }
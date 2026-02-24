// Švarus data layer - traukia TIK iš Airtable ir neturi jokių fake duomenų

export {
  getAllProfiles,
  getProfileBySlug,
  getRecordsForProfile,
  getAllCategories,
  getAllProfileSlugs,
  searchProfiles,
  type Profile,
  type ProfileSummary,
  type ExperienceRecord,
} from "./airtable"
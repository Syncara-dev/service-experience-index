// Replace the old getAreaSlugByName with this dynamic version:
export function getAreaSlugByName(name: string): string {
  // Dynamically converts names to slugs (e.g., "Covent Garden" -> "covent-garden")
  // This bypasses the hardcoded londonAreas list entirely for profile tags.
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replaces spaces and special chars with hyphens
    .replace(/^-+|-+$/g, "");    // Trims hyphens from start and end
}
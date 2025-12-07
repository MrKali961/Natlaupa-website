/**
 * Converts a string to a URL-friendly slug
 * Example: "Ultimate Mykonos Adventure" → "ultimate-mykonos-adventure"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Checks if a string is a CUID (database ID)
 */
export function isCuid(str: string): boolean {
  // CUID pattern: starts with 'c', followed by alphanumeric characters
  // Also support legacy hotel IDs like h199
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

/**
 * Generates a unique slug by appending numbers if needed
 */
export async function generateUniqueSlug(
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = slugify(baseText);
  let counter = 2;

  while (await checkExists(slug)) {
    slug = `${slugify(baseText)}-${counter}`;
    counter++;
  }

  return slug;
}

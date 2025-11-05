/**
 * Utility functions for generating SEO-friendly slugs
 */

/**
 * Convert Vietnamese text to slug
 * Example: "Đồng Hồ Nam Cao Cấp" -> "dong-ho-nam-cao-cap"
 */
export function generateSlug(text: string): string {
  // Convert to lowercase
  let slug = text.toLowerCase();

  // Remove Vietnamese accents
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Replace đ with d
  slug = slug.replace(/đ/g, 'd');
  
  // Remove special characters, keep only letters, numbers, and spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // Replace spaces and multiple hyphens with single hyphen
  slug = slug.replace(/\s+/g, '-').replace(/-+/g, '-');
  
  // Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Generate unique slug by appending number if needed
 * Example: "dong-ho-nam" -> "dong-ho-nam-2" if exists
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 2;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Generate slug from product name with optional ID for uniqueness
 * Example: "Đồng Hồ Rolex" -> "dong-ho-rolex"
 */
export function generateProductSlug(productName: string, productId?: string): string {
  const baseSlug = generateSlug(productName);
  
  // If slug is too short, append part of ID for uniqueness
  if (baseSlug.length < 3 && productId) {
    return `${baseSlug}-${productId.slice(0, 8)}`;
  }
  
  return baseSlug;
}

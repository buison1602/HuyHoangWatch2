/**
 * Convert category/brand name to URL-friendly slug
 * Example: "Đồng hồ nam" -> "dong-ho-nam"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Get category URL from category data
 */
export function getCategoryUrl(category: { slug?: string; name: string }): string {
  const slug = category.slug || generateSlug(category.name)
  return `/danh-muc/${slug}`
}

/**
 * Get brand URL from brand data
 */
export function getBrandUrl(brand: { slug?: string; name: string }): string {
  const slug = brand.slug || generateSlug(brand.name)
  return `/brand/${slug}`
}

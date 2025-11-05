import { createClient } from "@/lib/supabase/server"
import { ProductManagement } from "@/components/admin/product-management"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Run all queries in parallel for better performance
  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
    { data: brands, error: brandsError }
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, description, price, category_id, brand_id, gender, strap_type, stock_quantity, created_at, slug")
      .order("created_at", { ascending: false })
      .limit(100), // Limit to avoid slow queries
    supabase
      .from("categories")
      .select("id, name")
      .order("name"),
    supabase
      .from("brands")
      .select("id, name")
      .order("name")
  ])

  if (productsError) {
    console.error("Error fetching products:", productsError)
  }
  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError)
  }
  if (brandsError) {
    console.error("Error fetching brands:", brandsError)
  }

  // Map synchronously - no need for Promise.all
  const enrichedProducts = (products || []).map((product) => {
    const category = (categories || []).find((c) => c.id === product.category_id)
    return {
      ...product,
      category: category || { id: "", name: "Unknown" },
    }
  })

  return <ProductManagement products={enrichedProducts} categories={categories || []} brands={brands || []} />
}

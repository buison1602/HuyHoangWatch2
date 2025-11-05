import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CategoryBrandPageClient } from "@/components/shop/category-brand-page-client"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("name, description, meta_title, meta_description")
    .eq("slug", slug)
    .single()

  if (!category) {
    return {
      title: "Danh mục không tồn tại",
    }
  }

  return {
    title: category.meta_title || `${category.name} chính hãng`,
    description: category.meta_description || category.description || `Mua ${category.name} chính hãng, giá tốt`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch category info
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, slug, description, banner_url")
    .eq("slug", slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Fetch all categories and brands for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name")

  return (
    <CategoryBrandPageClient
      type="category"
      categoryData={category}
      categories={categories || []}
      brands={brands || []}
    />
  )
}

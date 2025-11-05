import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CategoryBrandPageClient } from "@/components/shop/category-brand-page-client"
import type { Metadata } from "next"

interface BrandPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from("brands")
    .select("name, description, meta_title, meta_description")
    .eq("slug", slug)
    .single()

  if (!brand) {
    return {
      title: "Thương hiệu không tồn tại",
    }
  }

  return {
    title: brand.meta_title || `Đồng hồ ${brand.name} chính hãng`,
    description: brand.meta_description || brand.description || `Mua đồng hồ ${brand.name} chính hãng, giá tốt`,
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch brand info
  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id, name, slug, description, banner_url")
    .eq("slug", slug)
    .single()

  if (brandError || !brand) {
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
      type="brand"
      brandData={brand}
      categories={categories || []}
      brands={brands || []}
    />
  )
}

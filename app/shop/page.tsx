// app/shop/page.tsx (server component, KHÔNG "use client")
import { createClient } from "@/lib/supabase/server"
import ShopPageClient from "./shop-page-client"

export const revalidate = 60 // optional ISR: revalidate every 60s

export async function generateMetadata(props: { searchParams: any }) {
  // searchParams may be a Promise in some Next versions; await to unwrap
  const sp = await props.searchParams
  const page = Number(sp?.page || 1)
  const title = page === 1 ? `Shop - HuyHoangWatch` : `Shop - Page ${page} - HuyHoangWatch`
  const description = "Cửa hàng đồng hồ Huy Hoang - các mẫu đồng hồ, dây đeo và phụ kiện chính hãng. Giao hàng toàn quốc, bảo hành uy tín."
  
  const baseUrl = "https://yourwebsite.com" // TODO: Replace with actual domain

  return {
    title,
    description,
    keywords: ["đồng hồ", "đồng hồ nam", "đồng hồ nữ", "dây đeo đồng hồ", "phụ kiện đồng hồ", "Huy Hoàng Watch"],
    alternates: {
      canonical: page === 1 ? `${baseUrl}/shop` : `${baseUrl}/shop?page=${page}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: page === 1 ? `${baseUrl}/shop` : `${baseUrl}/shop?page=${page}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ShopPage(props: { searchParams?: any }) {
  const supabase = await createClient()

  // searchParams can be a Promise - await it to access properties
  const sp = await props.searchParams

  // parse query params for initial server-side render
  const pageParam = Number((sp && sp.page) || 1)
  const pageSizeParam = Number((sp && sp.pageSize) || 12)

  const categoriesParam = sp?.categories || ""
  const brandsParam = sp?.brands || ""
  const genderParam = sp?.gender || ""
  const strapOrAccessoryParam = sp?.strapOrAccessory || ""

  const categoriesFilter = categoriesParam ? String(categoriesParam).split(",").filter(Boolean) : []
  const brandsFilter = brandsParam ? String(brandsParam).split(",").filter(Boolean) : []
  const genderFilter = genderParam ? String(genderParam).split(",").filter(Boolean) : []
  const strapOrAccessoryFilter = strapOrAccessoryParam ? String(strapOrAccessoryParam).split(",").filter(Boolean) : []

  const from = (pageParam - 1) * pageSizeParam
  const to = from + pageSizeParam - 1

  // Get accessory category IDs to exclude
  const { data: accessoryCategories } = await supabase
    .from("categories")
    .select("id")
    .in("name", ["Phụ kiện Dây đồng hồ", "Phụ kiện Khóa đồng hồ"])
  
  const accessoryCategoryIds = accessoryCategories?.map(c => c.id) || []

  // ✨ FETCH 8 RANDOM PRODUCTS for main section (no filters, exclude accessories)
  let randomQuery = supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, brand_id, slug")
    .order("created_at", { ascending: false })
    .limit(8)
  
  if (accessoryCategoryIds.length > 0) {
    randomQuery = randomQuery.not("category_id", "in", `(${accessoryCategoryIds.join(",")})`)
  }

  const { data: randomProductsBase } = await randomQuery

  // Hydrate random products
  const randomProducts = await Promise.all(
    (randomProductsBase || []).map(async (p: any) => {
      const [{ data: imgData }, { data: catData }, { data: brandData }] = await Promise.all([
        supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", p.id)
          .order("display_order", { ascending: true })
          .limit(1),
        supabase
          .from("categories")
          .select("name")
          .eq("id", p.category_id)
          .single(),
        p.brand_id
          ? supabase
              .from("brands")
              .select("name")
              .eq("id", p.brand_id)
              .single()
          : Promise.resolve({ data: null }),
      ])

      return {
        ...p,
        image_url: imgData?.[0]?.image_url || "/placeholder.svg",
        category_name: catData?.name || "Unknown",
        brand_name: brandData?.name || undefined,
      }
    })
  )

  // Build query similar to API route but on server to render HTML for SEO
  let q = supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, brand_id, created_at, slug", {
      count: "exact",
    })
    .order("created_at", { ascending: false })

  // Exclude accessory categories
  if (accessoryCategoryIds.length > 0) {
    q = q.not("category_id", "in", `(${accessoryCategoryIds.join(",")})`)
  }

  if (categoriesFilter.length > 0) q = q.in("category_id", categoriesFilter)
  if (brandsFilter.length > 0) q = q.in("brand_id", brandsFilter)
  if (genderFilter.length > 0) q = q.in("gender", genderFilter)
  if (strapOrAccessoryFilter.length > 0) q = q.in("strap_type", strapOrAccessoryFilter)

  q = q.range(from, to)

  const [{ data: baseProducts, count } = {} as any] = [await q]

  // fetch categories list for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  // fetch brands list for filters
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name")

  // hydrate product images and category names (same as API route)
  const productsWithImages = await Promise.all(
    (baseProducts || []).map(async (p: any) => {
      const [{ data: imgData }, { data: catData }, { data: brandData }] = await Promise.all([
        supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", p.id)
          .order("display_order", { ascending: true })
          .limit(1),
        supabase
          .from("categories")
          .select("name")
          .eq("id", p.category_id)
          .single(),
        p.brand_id
          ? supabase
              .from("brands")
              .select("name")
              .eq("id", p.brand_id)
              .single()
          : Promise.resolve({ data: null }),
      ])

      return {
        ...p,
        image_url: imgData?.[0]?.image_url || "/placeholder.svg",
        category_name: catData?.name || "Unknown",
        brand_name: brandData?.name || undefined,
      }
    })
  )

  // ✨ FETCH HOT PRODUCTS (CACHED with ISR revalidate: 60s)
  // Fetch 8 male products (exclude accessories)
  let maleQuery = supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, brand_id, slug")
    .eq("gender", "male")
    .order("created_at", { ascending: false })
    .limit(8)
  
  if (accessoryCategoryIds.length > 0) {
    maleQuery = maleQuery.not("category_id", "in", `(${accessoryCategoryIds.join(",")})`)
  }

  const { data: maleProductsBase } = await maleQuery

  // Fetch 8 female products (exclude accessories)
  let femaleQuery = supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, brand_id, slug")
    .eq("gender", "female")
    .order("created_at", { ascending: false })
    .limit(8)
  
  if (accessoryCategoryIds.length > 0) {
    femaleQuery = femaleQuery.not("category_id", "in", `(${accessoryCategoryIds.join(",")})`)
  }

  const { data: femaleProductsBase } = await femaleQuery

  // Hydrate hot male products
  const hotMaleProducts = await Promise.all(
    (maleProductsBase || []).map(async (p: any) => {
      const [{ data: imgData }, { data: catData }, { data: brandData }] = await Promise.all([
        supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", p.id)
          .order("display_order", { ascending: true })
          .limit(1),
        supabase
          .from("categories")
          .select("name")
          .eq("id", p.category_id)
          .single(),
        p.brand_id
          ? supabase
              .from("brands")
              .select("name")
              .eq("id", p.brand_id)
              .single()
          : Promise.resolve({ data: null }),
      ])

      return {
        ...p,
        image_url: imgData?.[0]?.image_url || "/placeholder.svg",
        category_name: catData?.name || "Unknown",
        brand_name: brandData?.name || undefined,
      }
    })
  )

  // Hydrate hot female products
  const hotFemaleProducts = await Promise.all(
    (femaleProductsBase || []).map(async (p: any) => {
      const [{ data: imgData }, { data: catData }, { data: brandData }] = await Promise.all([
        supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", p.id)
          .order("display_order", { ascending: true })
          .limit(1),
        supabase
          .from("categories")
          .select("name")
          .eq("id", p.category_id)
          .single(),
        p.brand_id
          ? supabase
              .from("brands")
              .select("name")
              .eq("id", p.brand_id)
              .single()
          : Promise.resolve({ data: null }),
      ])

      return {
        ...p,
        image_url: imgData?.[0]?.image_url || "/placeholder.svg",
        category_name: catData?.name || "Unknown",
        brand_name: brandData?.name || undefined,
      }
    })
  )

  return (
    // pass initial data down to client so first paint is SSR'd and SEO-friendly
    <ShopPageClient
      categories={categories ?? []}
      brands={brands ?? []}
      initialProducts={randomProducts}
      initialTotalCount={8}
      initialPage={1}
      hotMaleProducts={hotMaleProducts}
      hotFemaleProducts={hotFemaleProducts}
    />
  )
}

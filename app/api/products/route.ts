// app/api/products/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import fs from "fs"

export async function GET(req: Request) {
  // Log incoming requests for debugging repeated calls
  try {
    const url = new URL(req.url)
    const msg = `[api/products] GET ${url.pathname}?${url.searchParams.toString()}`
    console.log(msg)
    try {
      fs.appendFileSync('.logs_api_products.log', msg + "\n")
    } catch (e) {
      // ignore file write errors in dev
    }
  } catch (err) {
    // ignore
  }
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const categoriesParam = searchParams.get("categories") // "cat1,cat2"
  const brandsParam = searchParams.get("brands")         // "brand1,brand2"
  const genderParam = searchParams.get("gender")         // "Nam,Nữ"
  const strapOrAccessoryParam = searchParams.get("strapOrAccessory") // "Dây da,Dây kim loại"
  const pageParam = Number(searchParams.get("page") || "1")
  const pageSizeParam = Number(searchParams.get("pageSize") || "12")

  const categoriesFilter = categoriesParam ? categoriesParam.split(",").filter(Boolean) : []
  const brandsFilter = brandsParam ? brandsParam.split(",").filter(Boolean) : []
  const genderFilter = genderParam ? genderParam.split(",").filter(Boolean) : []
  const strapOrAccessoryFilter = strapOrAccessoryParam
    ? strapOrAccessoryParam.split(",").filter(Boolean)
    : []

  const from = (pageParam - 1) * pageSizeParam
  const to = from + pageSizeParam - 1

  // Build query
  let q = supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, brand_id, created_at, slug", {
      count: "exact",
    })
    .order("created_at", { ascending: false })

  if (categoriesFilter.length > 0) {
    q = q.in("category_id", categoriesFilter)
  }

  if (brandsFilter.length > 0) {
    q = q.in("brand_id", brandsFilter)
  }

  if (genderFilter.length > 0) {
    q = q.in("gender", genderFilter)
  }

  if (strapOrAccessoryFilter.length > 0) {
    q = q.in("strap_type", strapOrAccessoryFilter)
  }

  q = q.range(from, to)

  const { data: baseProducts, count, error } = await q
  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Lấy ảnh + tên category cho từng product
  const productsWithImages = await Promise.all(
    (baseProducts || []).map(async (p) => {
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

  return NextResponse.json({
    items: productsWithImages,
    total: count ?? 0,
    page: pageParam,
    pageSize: pageSizeParam,
  })
}

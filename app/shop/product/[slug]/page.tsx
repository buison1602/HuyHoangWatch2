import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "@/components/shop/product-detail"
import { notFound } from "next/navigation"
import { formatCurrency } from "@/lib/format"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, category_id, slug")
    .eq("slug", slug)
    .single()

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    }
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true })
    .limit(1)

  const imageUrl = images?.[0]?.image_url || "/placeholder.svg"
  const price = formatCurrency(product.price)

  return {
    title: `${product.name} - ${price} | HuyHoangWatch`,
    description: product.description || `Mua ${product.name} giá tốt tại HuyHoangWatch. ${price}. Giao hàng toàn quốc.`,
    alternates: {
      canonical: `https://yourwebsite.com/shop/product/${slug}`,
    },
    openGraph: {
      title: `${product.name} - ${price}`,
      description: product.description,
      images: [imageUrl],
      type: "website",
      url: `https://yourwebsite.com/shop/product/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${price}`,
      description: product.description,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, description, price, gender, strap_type, services, stock_quantity, category_id, slug, brand_id")
    .eq("slug", slug)
    .single()

  if (error || !product) {
    notFound()
  }

  const { data: images } = await supabase
    .from("product_images")
    .select("id, image_url, alt_text")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true })

  let category = null
  if (product.category_id) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("name, description")
      .eq("id", product.category_id)
      .single()
    category = categoryData
  }

  // Fetch all categories and brands for CategoryBar
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name")

  // Fetch similar products (same brand, exclude current product)
  let similarProducts: any[] = []
  
  if (product.brand_id) {
    const { data: sameBrandProducts } = await supabase
      .from("products")
      .select(`
        id, name, description, price, gender, strap_type, slug,
        categories!inner(id, name),
        brands(id, name)
      `)
      .eq("brand_id", product.brand_id)
      .neq("id", product.id)
      .limit(4)

    if (sameBrandProducts) {
      similarProducts = sameBrandProducts.map((p: any) => ({
        ...p,
        category_name: p.categories?.name || "",
        category_id: p.categories?.id || "",
        brand_name: p.brands?.name || "",
        image_url: "", // Will be populated below
      }))
    }
  }

  // If less than 4, get more from other brands
  if (similarProducts.length < 4) {
    // Get IDs already in similarProducts to avoid duplicates
    const existingIds = similarProducts.map(p => p.id)
    
    const { data: otherProducts } = await supabase
      .from("products")
      .select(`
        id, name, description, price, gender, strap_type, slug,
        categories!inner(id, name),
        brands(id, name)
      `)
      .neq("id", product.id)
      .not("id", "in", `(${existingIds.join(",")})`)
      .limit(4 - similarProducts.length)

    if (otherProducts) {
      const mapped = otherProducts.map((p: any) => ({
        ...p,
        category_name: p.categories?.name || "",
        category_id: p.categories?.id || "",
        brand_name: p.brands?.name || "",
        image_url: "",
      }))
      similarProducts = [...similarProducts, ...mapped]
    }
  }

  // Fetch suggested products (same gender, exclude current product and similarProducts)
  let suggestedProducts: any[] = []
  
  // Get IDs to exclude (current product + all similarProducts)
  const excludeIds = [product.id, ...similarProducts.map(p => p.id)]
  
  const { data: sameGenderProducts } = await supabase
    .from("products")
    .select(`
      id, name, description, price, gender, strap_type, slug,
      categories!inner(id, name),
      brands(id, name)
    `)
    .eq("gender", product.gender)
    .not("id", "in", `(${excludeIds.join(",")})`)
    .limit(4)

  if (sameGenderProducts) {
    suggestedProducts = sameGenderProducts.map((p: any) => ({
      ...p,
      category_name: p.categories?.name || "",
      category_id: p.categories?.id || "",
      brand_name: p.brands?.name || "",
      image_url: "",
    }))
  }

  // If less than 4, get more from other genders (still excluding current + similar products)
  if (suggestedProducts.length < 4) {
    const allExcludeIds = [product.id, ...similarProducts.map(p => p.id), ...suggestedProducts.map(p => p.id)]
    
    const { data: otherGenderProducts } = await supabase
      .from("products")
      .select(`
        id, name, description, price, gender, strap_type, slug,
        categories!inner(id, name),
        brands(id, name)
      `)
      .not("id", "in", `(${allExcludeIds.join(",")})`)
      .limit(4 - suggestedProducts.length)

    if (otherGenderProducts) {
      const mapped = otherGenderProducts.map((p: any) => ({
        ...p,
        category_name: p.categories?.name || "",
        category_id: p.categories?.id || "",
        brand_name: p.brands?.name || "",
        image_url: "",
      }))
      suggestedProducts = [...suggestedProducts, ...mapped]
    }
  }

  // Populate image URLs for similar and suggested products
  const allRecommendedIds = [
    ...similarProducts.map(p => p.id),
    ...suggestedProducts.map(p => p.id)
  ]

  if (allRecommendedIds.length > 0) {
    const { data: productImages } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .in("product_id", allRecommendedIds)
      .order("display_order", { ascending: true })

    const imageMap = new Map<string, string>()
    productImages?.forEach((img: any) => {
      if (!imageMap.has(img.product_id)) {
        imageMap.set(img.product_id, img.image_url)
      }
    })

    similarProducts = similarProducts.map(p => ({
      ...p,
      image_url: imageMap.get(p.id) || "/placeholder.svg"
    }))

    suggestedProducts = suggestedProducts.map(p => ({
      ...p,
      image_url: imageMap.get(p.id) || "/placeholder.svg"
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: images?.map(img => img.image_url) || [],
            url: `https://yourwebsite.com/shop/product/${slug}`,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "VND",
              availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `https://yourwebsite.com/shop/product/${slug}`,
              seller: {
                "@type": "Organization",
                name: "HuyHoangWatch",
              },
            },
            brand: {
              "@type": "Brand",
              name: "HuyHoangWatch",
            },
          }),
        }}
      />
      <ProductDetail 
        product={product} 
        images={images || []} 
        category={category}
        categories={categories || []}
        brands={brands || []}
        similarProducts={similarProducts}
        suggestedProducts={suggestedProducts}
      />
    </div>
  )
}

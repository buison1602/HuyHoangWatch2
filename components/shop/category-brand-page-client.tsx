"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { CategoryBar } from "@/components/shop/category-bar"
import { ProductGrid } from "@/components/shop/product-grid"
import { Pagination } from "@/components/shop/pagination"
import { ShopFooter } from "@/components/shop/shop-footer"
import { FacebookFAB } from "@/components/shop/facebook-fab"
import { ZaloFAB } from "@/components/shop/zalo-fab"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface BrandData {
  id: string
  name: string
  slug: string
  description: string
  banner_url: string | null
}

interface CategoryData {
  id: string
  name: string
  slug: string
  description: string
  banner_url: string | null
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  gender: string
  strap_type: string
  image_url: string
  category_name: string
  category_id: string
  brand_name?: string
  slug?: string
}

interface CategoryBrandPageClientProps {
  type: "brand" | "category"
  brandData?: BrandData
  categoryData?: CategoryData
  categories: Category[]
  brands: Brand[]
}

const SORT_OPTIONS = [
  { value: "default", label: "Mặc định" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "best-selling", label: "Bán chạy" },
]

export function CategoryBrandPageClient({
  type,
  brandData,
  categoryData,
  categories,
  brands,
}: CategoryBrandPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Parse filters from URL hash
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStrap, setSelectedStrap] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("default")
  
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const pageSize = 16

  const data = type === "brand" ? brandData : categoryData

  // Determine gender filter based on category slug (memoized to prevent infinite loop)
  const categoryGender = useMemo(() => {
    const categoryGenderMap: Record<string, string> = {
      'dong-ho-nam': 'male',
      'dong-ho-nu': 'female',
      'dong-ho-cap-doi': 'unisex',
    }
    return type === "category" && categoryData?.slug 
      ? categoryGenderMap[categoryData.slug] 
      : null
  }, [type, categoryData?.slug])

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true)

    // Check if current page is accessory page
    const isAccessoryPage = type === "category" && 
      categoryData && 
      (categoryData.slug === 'day-da-dong-ho' || categoryData.slug === 'khoa')

    let query = supabase
      .from("products")
      .select(`
        id, name, description, price, gender, strap_type, slug, created_at,
        categories!inner(id, name),
        brands(id, name)
      `, { count: "exact" })

    // Apply base filter (brand or category)
    if (type === "brand" && brandData) {
      query = query.eq("brand_id", brandData.id)
      
      // Exclude accessories from brand pages
      if (!isAccessoryPage) {
        query = query.not("categories.name", "in", '("Phụ kiện Dây đồng hồ","Phụ kiện Khóa đồng hồ")')
      }
    } else if (type === "category" && categoryData) {
      // For gender-specific categories, only filter by gender (not category_id)
      if (categoryGender) {
        query = query.eq("gender", categoryGender)
        // Exclude accessories from gender pages
        query = query.not("categories.name", "in", '("Phụ kiện Dây đồng hồ","Phụ kiện Khóa đồng hồ")')
      } else {
        // For regular categories, filter by category_id
        query = query.eq("category_id", categoryData.id)
        // No need to exclude if already filtering by specific category
      }
    }

    // Apply additional filters
    if (selectedGender.length > 0) {
      query = query.in("gender", selectedGender)
    }
    if (selectedBrands.length > 0) {
      query = query.in("brand_id", selectedBrands)
    }
    if (selectedCategories.length > 0) {
      query = query.in("category_id", selectedCategories)
    }
    if (selectedStrap.length > 0) {
      query = query.in("strap_type", selectedStrap)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "price-asc":
        query = query.order("price", { ascending: true })
        break
      case "price-desc":
        query = query.order("price", { ascending: false })
        break
      case "best-selling":
        // TODO: Add sales_count column later
        query = query.order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: productsData, count } = await query

    if (productsData) {
      // Fetch images
      const productIds = productsData.map((p: any) => p.id)
      const { data: images } = await supabase
        .from("product_images")
        .select("product_id, image_url")
        .in("product_id", productIds)
        .order("display_order", { ascending: true })

      const imageMap = new Map<string, string>()
      images?.forEach((img: any) => {
        if (!imageMap.has(img.product_id)) {
          imageMap.set(img.product_id, img.image_url)
        }
      })

      const mappedProducts = productsData.map((p: any) => ({
        ...p,
        category_name: p.categories?.name || "",
        category_id: p.categories?.id || "",
        brand_name: p.brands?.name || "",
        image_url: imageMap.get(p.id) || "/placeholder.svg",
      }))

      setProducts(mappedProducts)
      setTotalCount(count || 0)
    }

    setLoading(false)
  }, [type, brandData, categoryData, categoryGender, selectedGender, selectedBrands, selectedCategories, selectedStrap, sortBy, page, supabase])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL hash when filters change
  const updateURLHash = useCallback(() => {
    const params = new URLSearchParams()
    
    if (selectedGender.length > 0) {
      params.set("pa_kieu-dang", selectedGender.join(","))
    }
    if (selectedBrands.length > 0) {
      params.set("pa_thuong-hieu", selectedBrands.join(","))
    }
    if (selectedCategories.length > 0) {
      params.set("pa_danh-muc", selectedCategories.join(","))
    }
    if (selectedStrap.length > 0) {
      params.set("pa_chat-lieu-day", selectedStrap.join(","))
    }
    if (sortBy !== "default") {
      params.set("sort", sortBy)
    }
    if (page > 1) {
      params.set("page", page.toString())
    }

    const hash = params.toString()
    const newUrl = hash ? `#${hash}` : window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }, [selectedGender, selectedBrands, selectedCategories, selectedStrap, sortBy, page])

  useEffect(() => {
    updateURLHash()
  }, [updateURLHash])

  // Filter handlers
  const handleToggleGender = (g: string) => {
    setPage(1)
    setSelectedGender(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  const handleToggleBrand = (id: string) => {
    setPage(1)
    setSelectedBrands(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleToggleCategory = (id: string) => {
    setPage(1)
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleToggleStrap = (s: string) => {
    setPage(1)
    setSelectedStrap(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSortChange = (value: string) => {
    setPage(1)
    setSortBy(value)
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <CategoryBar
        categories={categories}
        brands={brands}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        selectedGender={selectedGender}
        selectedStrap={selectedStrap}
        selectedAccessories={[]}
        selectedServices={[]}
        onToggleCategory={handleToggleCategory}
        onToggleBrand={handleToggleBrand}
        onToggleGender={handleToggleGender}
        onToggleStrap={handleToggleStrap}
        onToggleAccessory={() => {}}
        onToggleService={() => {}}
        enableNavigation={true}
      />

      {/* Title & Description above banner */}
      {data && (
        <div className="container mx-auto px-4 mt-[40px] mb-4">
          <div className="text-center">
            <p className="text-[#676767] text-xl font-bold">
              {data.description}
            </p>
          </div>
        </div>
      )}

      {/* Banner */}
      {data?.banner_url && (
        <div className="container mx-auto px-4">
          <Image
            src={data.banner_url}
            alt={data.name}
            width={1920}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Sort & Count */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="text-sm text-muted-foreground" suppressHydrationWarning>
            {loading
              ? "Đang tải sản phẩm..."
              : `Hiển thị ${products.length} / ${totalCount} sản phẩm`}
          </div>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <ShopFooter />
      <ZaloFAB />
      <FacebookFAB />
    </div>
  )
}

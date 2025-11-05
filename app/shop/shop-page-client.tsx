"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { CategoryBar } from "@/components/shop/category-bar"
import { ProductGrid } from "@/components/shop/product-grid"
import { Pagination } from "@/components/shop/pagination"
import { ShopFooter } from "@/components/shop/shop-footer"
import { FacebookFAB } from "@/components/shop/facebook-fab"
import { ZaloFAB } from "@/components/shop/zalo-fab"
import Image from "next/image"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
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

interface ShopPageClientProps {
  categories: Category[]
  brands: Brand[]
  initialProducts?: Product[]
  initialTotalCount?: number
  initialPage?: number
  hotMaleProducts: Product[]
  hotFemaleProducts: Product[]
}

export default function ShopPageClient({ 
  categories = [], 
  brands = [], 
  initialProducts = [], 
  initialTotalCount = 0, 
  initialPage = 1,
  hotMaleProducts = [],
  hotFemaleProducts = []
}: ShopPageClientProps) {
  // --- UI state cho filter ---
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [selectedStrap, setSelectedStrap] = useState<string[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // --- pagination state ---
  const [page, setPage] = useState(initialPage)

  // --- data state ---
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
  const pageSize = 6

  const [loading, setLoading] = useState(false)

  // helper gộp strap + accessories (memoized so reference is stable between renders)
  const strapOrAccessory = useMemo(
    () => Array.from(new Set([...selectedStrap, ...selectedAccessories])),
    [selectedStrap, selectedAccessories]
  )

  // fetch products từ API route mỗi khi filter/page đổi
  const isFirstMount = useRef(true)
  useEffect(() => {
    // skip first mount since we already have SSR'd initial data
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    const fetchProducts = async () => {
      setLoading(true)

      // build query string
      const params = new URLSearchParams()
      if (selectedCategories.length > 0) {
        params.set("categories", selectedCategories.join(","))
      }
      if (selectedBrands.length > 0) {
        params.set("brands", selectedBrands.join(","))
      }
      if (selectedGender.length > 0) {
        params.set("gender", selectedGender.join(","))
      }
      if (strapOrAccessory.length > 0) {
        params.set("strapOrAccessory", strapOrAccessory.join(","))
      }
      params.set("page", String(page))
      params.set("pageSize", String(pageSize))

      const res = await fetch(`/api/products?${params.toString()}`)
      const json = await res.json()

      setProducts(json.items)
      setTotalCount(json.total)
      setLoading(false)
    }

    fetchProducts()
  }, [selectedCategories, selectedBrands, selectedGender, strapOrAccessory, page])

  // khi đổi filter -> reset về page 1
  const handleToggleCategory = (id: string) => {
    setPage(1)
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }
  const handleToggleBrand = (id: string) => {
    setPage(1)
    setSelectedBrands(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
  }
  const handleToggleGender = (g: string) => {
    setPage(1)
    setSelectedGender(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }
  const handleToggleStrap = (s: string) => {
    setPage(1)
    setSelectedStrap(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }
  const handleToggleAccessory = (a: string) => {
    setPage(1)
    setSelectedAccessories(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }
  const handleToggleService = (svc: string) => {
    setSelectedServices(prev => prev.includes(svc) ? prev.filter(x => x !== svc) : [...prev, svc])
  }

  // simple client-side page change (restore prior behavior)
  const handlePageChange = (p: number) => {
    setPage(p)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      {/* Category Bar with Mega Menu */}
      <CategoryBar
        categories={categories}
        brands={brands}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        selectedGender={selectedGender}
        selectedStrap={selectedStrap}
        selectedAccessories={selectedAccessories}
        selectedServices={selectedServices}
        onToggleCategory={handleToggleCategory}
        onToggleBrand={handleToggleBrand}
        onToggleGender={handleToggleGender}
        onToggleStrap={handleToggleStrap}
        onToggleAccessory={handleToggleAccessory}
        onToggleService={handleToggleService}
        enableNavigation={true}
      />

      {/* Banner Image */}
      <div className="w-full relative mt-7">
        <Image
          src="/images/banner.png"
          alt="Banner"
          width={1920}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main content - full width */}
        <div>
          <div className="mb-4 text-sm text-muted-foreground">
            Sản phẩm nổi bật
          </div>

          <ProductGrid products={products ?? []} />

          {/* No pagination for featured products - always show 8 */}

          {/* Collection Images - Responsive */}
          <div className="mt-12 flex flex-col md:flex-row gap-6 md:gap-[60px] justify-center items-center">
            <div className="w-full md:w-auto text-center">
              <Image
                src="/images/bst-dong-ho-nam-hot.jfif"
                alt="Bộ sưu tập đồng hồ nam hot"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
              <p className="mt-4 text-lg">BST ĐỒNG HỒ NAM HOT</p>
            </div>
            <div className="w-full md:w-auto text-center">
              <Image
                src="/images/BST-dong-ho-nu-hot.jfif"
                alt="Bộ sưu tập đồng hồ nữ hot"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
              <p className="mt-4 text-lg">BST ĐỒNG HỒ NỮ ĐẸP</p>
            </div>
            <div className="w-full md:w-auto text-center">
              <Image
                src="/images/BST-dong-ho-moi-ve.jfif"
                alt="Bộ sưu tập đồng hồ mới về"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
              <p className="mt-4 text-lg">ĐỒNG HỒ ĐEO TAY MỚI VỀ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Male Products Section */}
      <div className="mt-16">
        <div className="w-full h-px bg-black mb-6"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Đồng hồ nam bán chạy
          </h2>
          <ProductGrid products={hotMaleProducts} />
        </div>
      </div>

      {/* Hot Female Products Section */}
      <div className="mt-16 mb-16">
        <div className="w-full h-px bg-black mb-6"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Đồng hồ nữ bán chạy
          </h2>
          <ProductGrid products={hotFemaleProducts} />
        </div>
      </div>

      {/* Footer */}
      <ShopFooter />

      {/* Zalo FAB */}
      <ZaloFAB />

      {/* Facebook FAB */}
      <FacebookFAB />
    </div>
  )
}

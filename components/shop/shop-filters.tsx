"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { FiltersPanel } from "@/components/shop/filters-panel"
import { ServiceLocations } from "@/components/shop/service-locations"
import { ProductGrid } from "@/components/shop/product-grid"
import { Button } from "@/components/ui/button"

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
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

interface CurrentFilters {
  categories: string[]   // category_id[]
  brands: string[]       // brand_id[]
  gender: string[]       // ["Nam","Nữ",...]
  strap: string[]        // ["Dây da",...]
  accessory: string[]    // ["Dây kim loại",...]
}

interface ShopFiltersProps {
  categories: Category[]
  brands: Brand[]
  products: Product[]
  paginationInfo: PaginationInfo
  currentFilters: CurrentFilters
}

export function ShopFilters({
  categories,
  brands,
  products,
  paginationInfo,
  currentFilters,
}: ShopFiltersProps) {
  const router = useRouter()

  // UI state cho filter 'services' (dịch vụ tại cửa hàng) và mobile drawer
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // helper: build URL và push
  function pushWithFilters(newFilters: {
    categories?: string[]
    brands?: string[]
    gender?: string[]
    strap?: string[]
    accessory?: string[]
    page?: number
  }) {
    // Gộp filter cũ và mới
    const merged = {
      categories: newFilters.categories ?? currentFilters.categories,
      brands: newFilters.brands ?? currentFilters.brands,
      gender: newFilters.gender ?? currentFilters.gender,
      strap: newFilters.strap ?? currentFilters.strap,
      accessory: newFilters.accessory ?? currentFilters.accessory,
      page: newFilters.page ?? 1, // mặc định quay về page=1 sau khi đổi filter
    }

    const params = new URLSearchParams()

    if (merged.categories.length > 0) {
      params.set("categories", merged.categories.join(","))
    }
    if (merged.brands.length > 0) {
      params.set("brands", merged.brands.join(","))
    }
    if (merged.gender.length > 0) {
      params.set("gender", merged.gender.join(","))
    }
    if (merged.strap.length > 0) {
      params.set("strap", merged.strap.join(","))
    }
    if (merged.accessory.length > 0) {
      params.set("accessory", merged.accessory.join(","))
    }

    params.set("page", String(merged.page))

    router.push(`/shop?${params.toString()}`)
  }

  // ---- Handlers cho từng nhóm filter ----

  const handleToggleCategory = (catId: string) => {
    const isSelected = currentFilters.categories.includes(catId)
    const next = isSelected
      ? currentFilters.categories.filter((c) => c !== catId)
      : [...currentFilters.categories, catId]

    pushWithFilters({ categories: next })
  }

  const handleToggleBrand = (brandId: string) => {
    const isSelected = currentFilters.brands.includes(brandId)
    const next = isSelected
      ? currentFilters.brands.filter((b) => b !== brandId)
      : [...currentFilters.brands, brandId]

    pushWithFilters({ brands: next })
  }

  const handleToggleGender = (g: string) => {
    const isSelected = currentFilters.gender.includes(g)
    const next = isSelected
      ? currentFilters.gender.filter((x) => x !== g)
      : [...currentFilters.gender, g]

    pushWithFilters({ gender: next })
  }

  const handleToggleStrap = (strapVal: string) => {
    const isSelected = currentFilters.strap.includes(strapVal)
    const next = isSelected
      ? currentFilters.strap.filter((x) => x !== strapVal)
      : [...currentFilters.strap, strapVal]

    pushWithFilters({ strap: next })
  }

  const handleToggleAccessory = (acc: string) => {
    const isSelected = currentFilters.accessory.includes(acc)
    const next = isSelected
      ? currentFilters.accessory.filter((x) => x !== acc)
      : [...currentFilters.accessory, acc]

    pushWithFilters({ accessory: next })
  }

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  // ---- Pagination click handler ----
  const goToPage = (pageNum: number) => {
    pushWithFilters({ page: pageNum })
  }

  // Render nút phân trang 1 2 3 ...
  const pageButtons = []
  for (let p = 1; p <= paginationInfo.totalPages; p++) {
    pageButtons.push(
      <Button
        key={p}
        variant={p === paginationInfo.currentPage ? "default" : "outline"}
        size="sm"
        className="min-w-[2rem]"
        onClick={() => goToPage(p)}
      >
        {p}
      </Button>
    )
  }

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <FiltersPanel
          categories={categories}
          brands={brands}
          // truyền các filter đã chọn để checkbox nào đã bật thì hiện bật
          selectedCategories={currentFilters.categories}
          selectedBrands={currentFilters.brands}
          selectedGender={currentFilters.gender}
          selectedStrap={currentFilters.strap}
          selectedAccessories={currentFilters.accessory}
          selectedServices={selectedServices}
          onToggleCategory={handleToggleCategory}
          onToggleBrand={handleToggleBrand}
          onToggleGender={handleToggleGender}
          onToggleStrap={handleToggleStrap}
          onToggleAccessory={handleToggleAccessory}
          onToggleService={handleToggleService}
        />

        {selectedServices.length > 0 && <ServiceLocations />}
      </div>

      {/* Nút mở drawer mobile */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2"
        >
          <span className="text-xl">☰</span>
          Filters
        </Button>
      </div>

      {/* Drawer mobile */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-3/4 overflow-y-auto bg-background p-4 shadow-lg sm:w-4/5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
                className="text-xl"
              >
                ✕
              </Button>
            </div>

            <FiltersPanel
              categories={categories}
              brands={brands}
              selectedCategories={currentFilters.categories}
              selectedBrands={currentFilters.brands}
              selectedGender={currentFilters.gender}
              selectedStrap={currentFilters.strap}
              selectedAccessories={currentFilters.accessory}
              selectedServices={selectedServices}
              onToggleCategory={(id) => {
                handleToggleCategory(id)
                setIsDrawerOpen(false)
              }}
              onToggleBrand={(id) => {
                handleToggleBrand(id)
                setIsDrawerOpen(false)
              }}
              onToggleGender={(g) => {
                handleToggleGender(g)
                setIsDrawerOpen(false)
              }}
              onToggleStrap={(s) => {
                handleToggleStrap(s)
                setIsDrawerOpen(false)
              }}
              onToggleAccessory={(a) => {
                handleToggleAccessory(a)
                setIsDrawerOpen(false)
              }}
              onToggleService={handleToggleService}
            />

            {selectedServices.length > 0 && (
              <div className="mt-6">
                <ServiceLocations />
              </div>
            )}
          </div>
        </>
      )}

      {/* Khu vực sản phẩm + paging */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="mb-4 text-sm text-muted-foreground">
          Đang hiển thị {products.length} / {paginationInfo.totalCount} sản phẩm
        </div>

        <ProductGrid products={products} />

        {paginationInfo.totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {pageButtons}
          </div>
        )}
      </div>

      {selectedServices.length > 0 && (
        <div className="lg:hidden">
          <ServiceLocations />
        </div>
      )}
    </>
  )
}

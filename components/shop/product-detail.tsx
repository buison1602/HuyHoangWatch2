"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { translateGender, translateStrapType } from "@/lib/translations"
import { formatCurrency } from "@/lib/format"
import { ShopHeader } from "@/components/shop/shop-header"
import { CategoryBar } from "@/components/shop/category-bar"
import { ShopFooter } from "@/components/shop/shop-footer"
import { ProductCard } from "@/components/shop/product-card"
import { FacebookFAB } from "@/components/shop/facebook-fab"
import { ZaloFAB } from "@/components/shop/zalo-fab"

interface ProductImage {
  id: string
  image_url: string
  alt_text: string
}

interface Category {
  name: string
  description: string
}

interface Brand {
  id: string
  name: string
}

interface RecommendedProduct {
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

interface Product {
  id: string
  name: string
  description: string
  price: number
  gender: string
  strap_type: string
  services: string | null
  stock_quantity: number
  category_id: string
}

interface ProductDetailProps {
  product: Product
  images: ProductImage[]
  category: Category | null
  categories: { id: string; name: string }[]
  brands: Brand[]
  similarProducts: RecommendedProduct[]
  suggestedProducts: RecommendedProduct[]
}

export function ProductDetail({ product, images, category, categories, brands, similarProducts, suggestedProducts }: ProductDetailProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentImage = images[currentImageIndex] || { image_url: "/placeholder.svg", alt_text: product.name }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleAddToCart = async () => {
    if (!user) {
      // Lưu URL hiện tại để redirect về sau khi login
      const currentPath = window.location.pathname
      router.push(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`)
      return
    }

    setIsAddingToCart(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        })

        if (insertError) throw insertError
      }

      // Dispatch custom event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'))

      router.push("/cart")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Handler functions for CategoryBar (navigate to shop with filters)
  const handleNavigateWithFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams()
    params.set(filterType, value)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <>
      <ShopHeader />
      
      {/* Category Bar - Read-only, navigates to /shop with filters */}
      <CategoryBar
        categories={categories}
        brands={brands}
        selectedCategories={[]}
        selectedBrands={[]}
        selectedGender={[]}
        selectedStrap={[]}
        selectedAccessories={[]}
        selectedServices={[]}
        onToggleCategory={(id) => handleNavigateWithFilter("categories", id)}
        onToggleBrand={(id) => handleNavigateWithFilter("brands", id)}
        onToggleGender={(g) => handleNavigateWithFilter("gender", g)}
        onToggleStrap={(s) => handleNavigateWithFilter("strapOrAccessory", s)}
        onToggleAccessory={(a) => handleNavigateWithFilter("strapOrAccessory", a)}
        onToggleService={(svc) => handleNavigateWithFilter("services", svc)}
      />

      <div className="container mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại cửa hàng
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[500px] md:h-[700px] bg-white rounded-lg overflow-hidden">
            <Image
              src={currentImage.image_url || "/placeholder.svg"}
              alt={currentImage.alt_text || product.name}
              fill
              className="object-contain p-4"
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-primary" : "bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-[#9f1d25]">{formatCurrency(product.price)}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-semibold">{translateGender(product.gender)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại dây đeo</p>
                  <p className="font-semibold">{translateStrapType(product.strap_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kho hàng</p>
                  <p className="font-semibold">{product.stock_quantity} có sẵn</p>
                </div>
                {category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Danh mục</p>
                    <p className="font-semibold">{category.name}</p>
                  </div>
                )}
              </div>
              {product.services && (
                <div>
                  <p className="text-sm text-muted-foreground">Dịch vụ</p>
                  <p className="font-semibold">{product.services}</p>
                </div>
              )}
              {category?.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả danh mục</p>
                  <p className="text-sm">{category.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h3 className="font-semibold mb-2">Mô tả</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button size="lg" onClick={handleAddToCart} disabled={isAddingToCart || isLoading} className="w-full gap-2 bg-[#9f1d25] hover:bg-[#8a1920]">
            <ShoppingCart className="h-5 w-5" />
            {isAddingToCart ? "Đang thêm vào giỏ hàng..." : "Thêm vào giỏ hàng"}
          </Button>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <div className="w-full h-px bg-gray-300 mb-6"></div>
          <h2 className="text-2xl mb-6 text-center">SẢN PHẨM TƯƠNG TỰ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl mb-6 text-center">CÓ THỂ BẠN SẼ THÍCH</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>

    <ShopFooter />
    <ZaloFAB />
    <FacebookFAB />
    </>
  )
}

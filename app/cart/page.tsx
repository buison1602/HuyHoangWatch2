"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShopHeader } from "@/components/shop/shop-header"
import { ShopFooter } from "@/components/shop/shop-footer"
import { CategoryBar } from "@/components/shop/category-bar"
import { formatCurrency } from "@/lib/format"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    gender?: string
    strap_type?: string
    category_name?: string
    brand_name?: string
    image_url?: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Fetch categories and brands
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")

      const { data: brandsData } = await supabase
        .from("brands")
        .select("id, name")
        .order("name")

      setCategories(categoriesData || [])
      setBrands(brandsData || [])

      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(
            id, name, price, gender, strap_type,
            categories(id, name),
            brands(id, name)
          )
        `,
        )
        .eq("user_id", user.id)

      // Fetch product images
      if (data && data.length > 0) {
        const productIds = data.map((item) => item.product.id)
        const { data: images } = await supabase
          .from("product_images")
          .select("product_id, image_url")
          .in("product_id", productIds)
          .order("display_order", { ascending: true })

        // Map images to products
        const imageMap = new Map<string, string>()
        images?.forEach((img: any) => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, img.image_url)
          }
        })

        const cartItemsWithImages = data.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            category_name: item.product.categories?.name || "",
            brand_name: item.product.brands?.name || "",
            image_url: imageMap.get(item.product.id) || "/placeholder.svg",
          },
        }))

        setCartItems(cartItemsWithImages)
      } else {
        setCartItems(data || [])
      }

      setIsLoading(false)
    }

    fetchData()
  }, [supabase])

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleRemove = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId)
    setCartItems(cartItems.filter((item) => item.id !== cartItemId))
  }

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(cartItemId)
      return
    }
    await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId)
    setCartItems(cartItems.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)))
  }

  // Handler functions for CategoryBar (navigate to shop with filters)
  const handleNavigateWithFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams()
    params.set(filterType, value)
    router.push(`/shop?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      
      {/* Category Bar */}
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
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Giỏ hàng của bạn trống</p>
              <Link href="/shop">
                <Button className="bg-[#9f1d25] hover:bg-[#8a1920]">Tiếp tục mua sắm</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-1 md:p-4">
                    <div className="flex gap-2 md:gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          width={144}
                          height={136}
                          className="object-cover rounded w-[100px] h-[100px] md:w-[144px] md:h-[136px]"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                          {item.product.category_name && (
                            <p className="text-sm text-muted-foreground">Danh mục: {item.product.category_name}</p>
                          )}
                          {item.product.brand_name && (
                            <p className="text-sm text-muted-foreground">Thương hiệu: {item.product.brand_name}</p>
                          )}
                          {item.product.gender && (
                            <p className="text-sm text-muted-foreground">Giới tính: {item.product.gender}</p>
                          )}
                          {item.product.strap_type && (
                            <p className="text-sm text-muted-foreground">Dây đeo: {item.product.strap_type}</p>
                          )}
                          <p className="text-base font-semibold mt-2">{formatCurrency(item.product.price)}</p>
                        </div>

                        {/* Quantity Controls and Remove Button */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleRemove(item.id)}
                            className="hidden md:inline-flex"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="md:sticky md:top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tổng phụ</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Tổng</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-[#9f1d25] hover:bg-[#8a1920]">Tiến hành thanh toán</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <ShopFooter />
    </div>
  )
}

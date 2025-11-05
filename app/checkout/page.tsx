"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { ShopFooter } from "@/components/shop/shop-footer"
import { CategoryBar } from "@/components/shop/category-bar"
import Image from "next/image"
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
  }
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })
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
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(id, name, price)
        `,
        )
        .eq("user_id", user.id)

      setCartItems(data || [])
      setIsLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmTransfer) {
      alert("Vui lòng xác nhận rằng bạn đã chuyển tiền trước khi đặt hàng.")
      return
    }
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        total_amount: total,
        status: "pending",
        items,
        shipping_address: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        notes: formData.notes,
        bank_info: {
          bankName: "TEST Bank",
          accountNumber: "TEST STK",
          accountHolder: "TEST Store",
        },
      })

      if (error) throw error

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user.id)

      router.push("/checkout/success")
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Đã xảy ra lỗi khi xử lý đơn hàng.")
    } finally {
      setIsSubmitting(false)
    }
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
        <Button
          variant="outline"
          onClick={() => router.push('/cart')}
          type="button"
          className="mb-4"
        >
          ← Quay lại giỏ hàng
        </Button>
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName" className="mb-1 block">Họ và tên</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-1 block">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="mb-1 block">Số điện thoại</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="mb-1 block">Địa chỉ</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="city" className="mb-1 block">Thành phố</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="mb-1 block">Mã bưu điện</Label>
                      <Input
                        id="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="mb-1 block">Ghi chú đơn hàng (Tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Bất kỳ yêu cầu hoặc ghi chú đặc biệt..."
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="confirmTransfer"
                      checked={confirmTransfer}
                      onChange={(e) => setConfirmTransfer(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    <Label htmlFor="confirmTransfer" className="text-sm">
                      Tôi xác nhận rằng mình đã chuyển khoản ngân hàng
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-[#9f1d25] hover:bg-[#8a1920]" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="md:sticky md:top-4">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Chuyển khoản ngân hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <p className="text-muted-foreground">Tên ngân hàng</p>
                      <p className="text-lg font-bold">Vietcombank</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số tài khoản</p>
                      <p className="text-lg font-bold">1020380328</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Chủ tài khoản</p>
                      <p className="text-lg font-bold">Bùi Huy Hoàng</p>
                    </div>
                    <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                      <p className="text-muted-foreground text-sm">Nội dung chuyển khoản</p>
                      <p className="text-lg font-bold text-yellow-800">
                        DHHH {formData.phone || "+ Số điện thoại của bạn"}
                      </p>
                    </div>

                    <div className="pt-2 text-center">
                      <Image
                        src="/images/qrcode.png"
                        alt="QR chuyển khoản Vietcombank"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Quét mã QR để chuyển khoản nhanh
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ShopFooter />
    </div>
  )
}

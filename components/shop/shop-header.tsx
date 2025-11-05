// components/shop/shop-header.tsx
"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function ShopHeader() {
  const [user, setUser] = useState<any>(null)
  const [checked, setChecked] = useState(false) // <-- thêm cờ
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // chỉ fetch Supabase user 1 lần
    if (checked) return
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setChecked(true)
    }
    getUser()
  }, [supabase, checked])

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0)
        return
      }

      const { data } = await supabase
        .from("cart_items")
        .select("quantity", { count: "exact" })
        .eq("user_id", user.id)

      if (data) {
        const total = data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      }
    }

    if (checked) {
      fetchCartCount()
    }

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [user, checked, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // router.push("/")
    setUser(null)
    router.refresh()
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/shop" className="text-2xl font-bold">
          Đồng hồ Huy Hoàng
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/shop" className="text-sm hover:underline">
            Cửa hàng
          </Link>
          <Link href="/cart" className="relative text-sm hover:underline">
            Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#993333] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user.user_metadata?.is_admin && (
                <Link href="/admin" className="text-sm hover:underline">
                  Quản lý
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

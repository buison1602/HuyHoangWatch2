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
          {/* <Link href="/shop" className="text-sm hover:underline">
            Cửa hàng
          </Link> */}
          <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              fill="currentColor" 
              viewBox="0 0 16 16"
              className="text-foreground"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
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

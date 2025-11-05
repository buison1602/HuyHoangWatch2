"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Sản phẩm" },
    { href: "/admin/categories", label: "Danh mục" },
    { href: "/admin/brands", label: "Thương hiệu" },
    { href: "/admin/transactions", label: "Giao dịch" },
  ]

  return (
    <nav className="w-48 border-r bg-card p-4">
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

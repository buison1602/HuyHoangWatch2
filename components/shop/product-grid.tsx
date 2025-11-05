"use client"

import { ProductCard } from "@/components/shop/product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  gender: string
  strap_type: string
  image_url: string
  category_name: string
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    // Mobile: 2 columns, Tablet: 3 columns, Desktop/Laptop: 4 columns
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

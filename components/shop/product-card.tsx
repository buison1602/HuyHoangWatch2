"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { translateGender, translateStrapType } from "@/lib/translations"
import { formatCurrency } from "@/lib/format"

interface Product {
  id: string
  name: string
  description: string
  price: number
  gender: string
  strap_type: string
  image_url: string
  category_name: string
  brand_name?: string
  slug?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // SEO-friendly alt text with product details
  const altText = `${product.name} - ${translateGender(product.gender)} - ${translateStrapType(product.strap_type)} - ${product.category_name}${product.brand_name ? ` - ${product.brand_name}` : ''}`

  // Check if product is an accessory (hide brand, gender, strap_type)
  const isAccessory = product.category_name === 'Phụ kiện Dây đồng hồ' || product.category_name === 'Phụ kiện Khóa đồng hồ'

  // Combine all info into a single string separated by ' - '
  const combinedInfo = [
    product.name,
    !isAccessory && product.brand_name ? product.brand_name : null,
    !isAccessory ? translateGender(product.gender) : null,
    !isAccessory ? translateStrapType(product.strap_type) : null,
    product.description
  ]
    .filter(Boolean) // Remove null/undefined values
    .join(' - ')

  return (
    <Link href={`/shop/product/${product.slug || product.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full group gap-0">
        <CardContent className="p-0">
          <div className="relative h-40 md:h-48 lg:h-56 w-full bg-white">
            <Image 
              src={product.image_url || "/placeholder.svg"} 
              alt={altText}
              fill 
              className="object-contain"
              loading="lazy"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-1 px-4 lg:p-2 lg:px-5">
          <div className="w-full group-hover:text-[#cf2e2e] transition-colors">
            {/* Combined info in a single paragraph with max 4 lines - centered */}
            <p className="text-sm line-clamp-4 text-center">
              {combinedInfo}
            </p>
          </div>
          
          {/* Price at bottom - centered */}
          <div className="w-full text-center">
            <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

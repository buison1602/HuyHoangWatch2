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
        <CardFooter className="flex flex-col items-start gap-2 p-1 lg:p-2">
          <div className="w-full group-hover:text-[#cf2e2e] transition-colors">
            <div className="flex items-start gap-1 flex-wrap text-sm">
              <h3 className="font-semibold">{product.name}</h3>
              
              <span>-</span>
              
              <span>{product.category_name}</span>
              
              {!isAccessory && product.brand_name && (
                <>
                  <span>-</span>
                  <span className="font-medium">{product.brand_name}</span>
                </>
              )}
              
              {!isAccessory && (
                <>
                  <span>-</span>
                  <span>{translateGender(product.gender)}</span>
                </>
              )}
              
              {!isAccessory && (
                <>
                  <span>-</span>
                  <span>{translateStrapType(product.strap_type)}</span>
                </>
              )}
            </div>
            
            {/* Description with ellipsis if too long - hidden on mobile, max 1 line */}
            <p className="hidden lg:block text-sm line-clamp-1 mt-1">{product.description}</p>
          </div>
          
          {/* Price at bottom */}
          <div className="w-full">
            <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

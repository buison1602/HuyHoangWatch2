"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/product-form"
import { formatCurrency } from "@/lib/format"

// Kiểu dùng để hiển thị danh sách sản phẩm trong admin
// Đây là data bạn đã có sẵn từ server
interface ProductListItem {
  id: string
  name: string
  price: number
  category: { id: string; name: string }
  stock_quantity: number

  // Nếu API của bạn đã trả thêm mấy field dưới thì bạn có thể thêm vào đây,
  // ví dụ:
  description?: string
  gender?: string
  strap_type?: string
}

// Kiểu category để đổ vào <Select> trong form
interface Category {
  id: string
  name: string
}

// Kiểu brand để đổ vào <Select> trong form
interface Brand {
  id: string
  name: string
}

// Đây là kiểu mà ProductForm thực sự mong đợi cho editingProduct
// (khớp với file product-form.tsx)
interface EditableProduct {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  brand_id?: string
  gender: string
  strap_type: string
  stock_quantity: number
}

interface ProductManagementProps {
  products: ProductListItem[]
  categories: Category[]
  brands: Brand[]
}

export function ProductManagement({ products, categories, brands }: ProductManagementProps) {
  // sản phẩm đang edit hoặc null nếu đang thêm mới
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null)

  // state mở/đóng form
  const [showForm, setShowForm] = useState(false)

  // mở form "Thêm sản phẩm"
  const handleAddProduct = () => {
    setEditingProduct(null) // form sẽ hiểu là tạo mới
    setShowForm(true)
  }

  // mở form "Chỉnh sửa"
  const handleEditProduct = (p: ProductListItem) => {
    // Chuyển ProductListItem (dùng cho list) -> EditableProduct (dùng cho form)
    // Nếu danh sách chưa có đủ thông tin (description, gender, strap_type, ...),
    // bạn gán fallback mặc định hoặc lấy từ p nếu backend đã trả về.
    const converted: EditableProduct = {
      id: p.id,
      name: p.name,
      price: p.price,
      stock_quantity: p.stock_quantity,

      // fallback "" nếu list chưa có description
      description: p.description ?? "",

      // Form muốn category_id (chuỗi), không phải object {id, name}
      category_id: p.category.id,

      // fallback "unisex"/"leather" nếu list chưa có:
      gender: p.gender ?? "unisex",
      strap_type: p.strap_type ?? "leather",
    }

    setEditingProduct(converted)
    setShowForm(true)
  }

  // đóng form sau khi submit hoặc cancel
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Danh sách sản phẩm</h2>
        <Button onClick={handleAddProduct}>Thêm sản phẩm mới</Button>
      </div>

      {/* Form thêm / sửa sản phẩm */}
      {showForm && (
        <ProductForm
          categories={categories}
          brands={brands}
          editingProduct={editingProduct}
          onClose={handleCloseForm}
        />
      )}

      {/* Danh sách sản phẩm */}
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Danh mục: {product.category.name} 
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Giá: {formatCurrency(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Số lượng tồn kho:{" "} {product.stock_quantity}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    Sửa
                  </Button>
                  <Button variant="destructive" size="sm">
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

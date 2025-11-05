"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadProductImage } from "@/lib/supabase/storage"
import { toast } from "sonner"
import { X } from "lucide-react"
import { generateProductSlug } from "@/lib/slug"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface Product {
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

interface ProductFormProps {
  categories: Category[]
  brands: Brand[]
  onClose: () => void
  editingProduct?: Product | null
}

export function ProductForm({ categories, brands, onClose, editingProduct }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    description: editingProduct?.description || "",
    price: editingProduct?.price || 0,
    category_id: editingProduct?.category_id || "",
    brand_id: editingProduct?.brand_id || "",
    gender: editingProduct?.gender || "unisex",
    strap_type: editingProduct?.strap_type || "leather",
    stock_quantity: editingProduct?.stock_quantity || 0,
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Generate slug from product name
      const slug = generateProductSlug(formData.name)
      const dataToSave = { ...formData, slug }

      let productId: string
      if (editingProduct) {
        const { error } = await supabase.from("products").update(dataToSave).eq("id", editingProduct.id)

        if (error) throw error
        productId = editingProduct.id
      } else {
        const { data, error } = await supabase.from("products").insert([dataToSave]).select("id").single()

        if (error) throw error
        productId = data.id
      }

      let uploadedCount = 0
      let failedCount = 0

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          try {
            const imageUrl = await uploadProductImage(file, productId)

            // Insert into product_images table
            const { error: insertError } = await supabase.from("product_images").insert({
              product_id: productId,
              image_url: imageUrl,
              alt_text: formData.name,
              display_order: i + 1,
            })

            if (insertError) {
              console.error(`Failed to insert image record ${i + 1}:`, insertError)
              toast.error(`Failed to save image ${i + 1}`)
              failedCount++
            } else {
              uploadedCount++
            }
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error)
            toast.error(`Failed to upload image ${i + 1}`)
            failedCount++
          }
        }
      }

      if (uploadedCount > 0 || selectedFiles.length === 0) {
        const message = editingProduct ? "Product updated successfully" : "Product created successfully"
        if (uploadedCount > 0 && failedCount > 0) {
          toast.success(`${message} (${uploadedCount}/${selectedFiles.length} images uploaded)`)
        } else {
          toast.success(message)
        }
        setFormData({
          name: "",
          description: "",
          price: 0,
          category_id: "",
          brand_id: "",
          gender: "unisex",
          strap_type: "leather",
          stock_quantity: 0,
        })
        setSelectedFiles([])
        setPreviewUrls([])
        const fileInput = document.getElementById("images") as HTMLInputElement
        if (fileInput) fileInput.value = ""
        onClose()
      } else if (failedCount > 0) {
        toast.error("Failed to upload all images")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{editingProduct ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="brand">Thương hiệu</Label>
              <Select
                value={formData.brand_id}
                onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="stock">Số lượng tồn kho</Label>
              <Input
                id="stock"
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock_quantity: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div></div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="unisex">Cả nam và nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="strap">Loại dây đeo</Label>
              <Select
                value={formData.strap_type}
                onValueChange={(value) => setFormData({ ...formData, strap_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leather">Dây da</SelectItem>
                  <SelectItem value="metal">Dây kim loại</SelectItem>
                  <SelectItem value="rubber">Dây cao su</SelectItem>
                  <SelectItem value="fabric">Dây vải</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="images">Ảnh sản phẩm</Label>
            <div className="mt-2 border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center">
              <Input id="images" type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              <label htmlFor="images" className="cursor-pointer">
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">Click để chọn ảnh</p>
                  <p className="text-xs">hoặc kéo và thả</p>
                </div>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-center mt-1 text-muted-foreground">#{index + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : editingProduct ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Dừng lại
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
